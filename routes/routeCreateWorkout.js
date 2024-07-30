const express = require('express');

const router = express.Router();

// Define your route here
router.get('/', (req, res) => {
    res.render('createWorkout'); // Adjust as necessary
});

module.exports = router;