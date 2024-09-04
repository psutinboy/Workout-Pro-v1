const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Middleware function to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.session) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString(); // Convert ObjectId to string
    console.log('User ID:', userId); // Add this line to log the user ID

    if (!userId || typeof userId !== 'string' || userId.length !== 24) {
      throw new Error('Invalid user ID');
    }

    const objectId = ObjectId.createFromHexString(userId);
    console.log('Fetching user with ID:', objectId);

    if (!req.app.locals.database) {
      throw new Error('Database not initialized');
    }

    const query = { userId: objectId };
    console.log('Database query:', query);

    const workouts = await req.app.locals.database.collection('workoutPlans').find(query).toArray();
    console.log('Fetched workouts:', workouts);

    res.render('pastWorkouts', { workouts: workouts });
  } catch (error) {
    console.error('Error fetching past workouts:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;