const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const lowerCaseUsername = username.toLowerCase(); // Convert to lowercase
  try {
    const user = await User.findOne({ username: lowerCaseUsername });
    if (!user) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/login');
    }
    console.log("User found:", user);
    console.log("Password to compare:", password);
    const isMatch = await user.comparePassword(password);
    console.log("Password comparison result for user:", user.username, "isMatch:", isMatch);
    if (!isMatch) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/login');
  }
});

module.exports = router;