const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

// Middleware function to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching user with ID:', userId);

    if (!req.app.locals.database) {
      throw new Error('Database not initialized');
    }

    const workouts = await req.app.locals.database.collection('workoutPlans').find({ userId: userId, createdBy: userId }).toArray();

    res.render('pastWorkouts', { workouts: workouts });
  } catch (error) {
    console.error('Error fetching past workouts:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
