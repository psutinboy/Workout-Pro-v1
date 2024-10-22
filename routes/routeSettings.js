const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");
const packageJson = require("../package.json"); // Add this line
const path = require("path"); // Add this line

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in to view that resource");
  res.redirect("/login");
}

// Render settings page
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("settings", {
    user: req.user,
    message: req.flash("success"),
    version: packageJson.version, // Add this line
  });
});

// Handle update information
router.post("/update", ensureAuthenticated, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/settings");
    }

    // Update user fields
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      console.log("New password before hashing:", password);
      user.password = password; // Assign the plain password
      console.log("New password after hashing:", user.password);
    }

    // Save the user
    await user.save();
    console.log("User saved with new password:", user.password);

    // Verify the saved password
    const updatedUser = await User.findById(req.user.id);
    console.log("Password in database after save:", updatedUser.password);

    // Update session
    req.login(user, (err) => {
      if (err) {
        console.error("Error updating session:", err);
        req.flash("error", "An error occurred. Please try again.");
        return res.redirect("/settings");
      }
      req.flash("success", "Information updated successfully.");
      res.redirect("/settings");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/settings");
  }
});

// Handle delete account
router.post("/delete", ensureAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    req.logout();
    req.flash("success", "Account deleted successfully.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/settings");
  }
});

// Fetch user data
router.get("/user", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user data");
  }
});

module.exports = router;
