const express = require("express");
const router = express.Router();
const User = require("../models/user");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

module.exports = router;
