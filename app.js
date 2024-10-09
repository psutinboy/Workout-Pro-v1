const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const createError = require('http-errors');
const User = require('./models/user'); // Ensure User model is imported

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.locals.database = mongoose.connection.db; // Store the database connection in app.locals
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 3 months
  },
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/blackjack', express.static(path.join(__dirname, 'public/blackjack')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const lowerCaseUsername = username.toLowerCase(); // Convert to lowercase
      const user = await User.findOne({ username: lowerCaseUsername });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Define routes
const indexRouter = require('./routes/routeIndex');
const createWorkoutRouter = require('./routes/routeCreateWorkout');
const signupRouter = require('./routes/routeSignup');
const settingsRouter = require('./routes/routeSettings');
const pastWorkoutsRouter = require('./routes/routePastWorkouts');
const chatRouter = require('./routes/routeChat'); // Update this line

// Routes
app.use('/', indexRouter);
app.use('/createWorkout', createWorkoutRouter);
app.use('/signup', signupRouter);
app.use('/settings', settingsRouter);
app.use('/pastWorkouts', pastWorkoutsRouter);
app.use('/chat', chatRouter);

// Login route
app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Remove or comment out this line as it's no longer needed
// app.use('/api/chat', chatRoutes);

module.exports = app;