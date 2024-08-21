const express = require('express');
const router = express.Router();

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Define your route here
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('createWorkout'); // Adjust as necessary
});

module.exports = router;