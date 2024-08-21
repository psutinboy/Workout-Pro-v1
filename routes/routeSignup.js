const express = require('express');
const router = express.Router();
const User = require('../models/user');
const flash = require('connect-flash');

// Sign-up page
router.get('/', (req, res) => {
  res.render('signup', { message: req.flash('error') });
});

// Handle sign-up form submission
router.post('/', async (req, res) => { // Change this line
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already exists.');
      return res.redirect('/signup');
    }
    const newUser = new User({ username, password, email });
    await newUser.save();
    req.flash('success', 'You have successfully signed up. Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/signup');
  }
});

module.exports = router;