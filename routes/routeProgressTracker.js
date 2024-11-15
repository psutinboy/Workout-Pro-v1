const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

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

// Main progress tracker page
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("progressTracker");
});

// API endpoint for getting all progress data
router.get("/api/progress", ensureAuthenticated, async (req, res) => {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
    const database = mongoClient.db("workout-Pro");
    const workoutProgress = database.collection("workoutProgress");
    
    // Get user's workout progress data
    const userWorkouts = await workoutProgress
      .find({ userId: new ObjectId(req.user._id) })
      .sort({ date: -1 })
      .toArray();

    console.log('Found workouts:', userWorkouts);
    
    // Calculate statistics
    const stats = calculateWorkoutStats(userWorkouts);
    
    res.json(stats);
  } catch (error) {
    console.error("Error fetching progress data:", error);
    res.status(500).json({ error: "Failed to fetch progress data" });
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
});

// API endpoint for getting exercise-specific progress data
router.get("/api/progress/:exercise", ensureAuthenticated, async (req, res) => {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
    const database = mongoClient.db("workout-Pro");
    const workoutProgress = database.collection("workoutProgress");
    
    // Get exercise-specific data
    const exerciseData = await getExerciseProgress(
      new ObjectId(req.user._id),
      req.params.exercise, 
      workoutProgress
    );
    
    res.json(exerciseData);
  } catch (error) {
    console.error("Error fetching exercise progress:", error);
    res.status(500).json({ error: "Failed to fetch exercise progress" });
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
});

function calculateWorkoutStats(workouts) {
    const workoutArray = Array.isArray(workouts) ? workouts : [];

    // Calculate total duration
    const totalDuration = workoutArray.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    const avgDuration = workoutArray.length > 0 ? Math.round(totalDuration / workoutArray.length) : 0;

    return {
        totalWorkouts: workoutArray.length,
        monthlyWorkouts: workoutArray.filter(w => {
            const workoutDate = new Date(w.date);
            const now = new Date();
            return workoutDate.getMonth() === now.getMonth() &&
                   workoutDate.getFullYear() === now.getFullYear();
        }).length,
        avgDuration,
        workoutDays: workoutArray.map(w => {
            // Ensure the date is stored as UTC
            const date = new Date(w.date);
            return date.toISOString();
        }),
        recentWorkouts: workoutArray.slice(0, 5).map(w => {
            const exercises = w.exercises || [];
            // Ensure the date is stored as UTC
            const date = new Date(w.date);
            return {
                date: date.toISOString(),
                name: Array.isArray(exercises) ? exercises.map(e => e?.name || 'Unknown').join(", ") : "No exercises recorded",
                summary: `Exercises: ${Array.isArray(exercises) ? exercises.length : 0} | Duration: ${w.duration || 0}min${w.notes ? ` | Notes: ${w.notes.substring(0, 50)}...` : ''}`
            };
        })
    };
}

async function getExerciseProgress(userId, exercise, collection) {
    console.log('Searching for exercise:', exercise, 'for user:', userId);
    
    // Get all workouts containing the specified exercise
    const workouts = await collection
        .find({
            userId: userId,
            exercises: { $ne: null },
            "exercises.name": exercise
        })
        .sort({ date: 1 })
        .toArray();

    console.log('Found workouts for exercise:', workouts);

    // Extract dates and weights for the specified exercise
    const progressData = workouts.map(workout => {
        const exerciseData = workout.exercises?.find(e => e?.name === exercise);
        const date = new Date(workout.date);
        date.setDate(date.getDate() + 1); // Add one day to fix the offset
        return {
            date: date,
            weight: exerciseData?.weight || 0
        };
    });

    return {
        dates: progressData.map(d => d.date.toLocaleDateString()),
        weights: progressData.map(d => d.weight)
    };
}

module.exports = router;
