const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.session) {
        return next();
    }
    res.redirect("/login");
}

// Render track progress page
router.get("/", ensureAuthenticated, (req, res) => {
    res.render("trackProgress");
});

// Save workout progress
router.post("/save", ensureAuthenticated, async (req, res) => {
    try {
        console.log('Received workout data:', req.body);

        await client.connect();
        const database = client.db("workout-Pro");
        const collection = database.collection("workoutProgress");

        // Validate the exercises array
        if (!Array.isArray(req.body.exercises) || req.body.exercises.length === 0) {
            console.log('Exercise validation failed:', req.body.exercises);
            return res.status(400).json({ error: "At least one exercise is required" });
        }

        // Validate and clean exercise data
        const exercises = req.body.exercises.map(exercise => ({
            name: exercise.name,
            weight: parseInt(exercise.weight) || 0,
            sets: parseInt(exercise.sets) || 0,
            reps: parseInt(exercise.reps) || 0
        }));

        const workoutData = {
            userId: req.user._id,
            date: new Date(req.body.workoutDate),
            duration: parseInt(req.body.duration) || 0,
            exercises: exercises,
            notes: req.body.notes || "",
            createdAt: new Date()
        };

        console.log('Saving workout data:', workoutData);

        await collection.insertOne(workoutData);
        res.status(200).json({ message: "Workout tracked successfully" });
    } catch (error) {
        console.error("Error saving workout progress:", error);
        res.status(500).json({ error: "Failed to save workout progress" });
    } finally {
        await client.close();
    }
});

module.exports = router; 