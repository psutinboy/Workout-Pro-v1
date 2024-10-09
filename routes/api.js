const express = require("express");
const router = express.Router();
const User = require("../models/user");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

router.get("/blackjack/balance", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.blackjackBalance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

router.post("/blackjack/balance", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.blackjackBalance = req.body.balance;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving balance:', error);
    res.status(500).json({ error: 'Failed to save balance' });
  }
});

module.exports = router;