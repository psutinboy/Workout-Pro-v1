const express = require("express");
const { MongoClient, ObjectId } = require("mongodb"); // Add ObjectId here
const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware function to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.session) {
    return next();
  }
  res.redirect("/login");
}

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("workout-Pro");
    const collection = database.collection("workoutPlans");

    const userId = req.user._id;
    console.log("User ID:", userId);

    const query = { userId: new ObjectId(userId) };
    console.log("Database query:", query);

    // Sort the workouts by createdAt field in descending order
    const workouts = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    if (workouts.length === 0) {
      console.log("No workouts found for user");
    }

    // Map the workouts to include title, description, and formatted date
    const formattedWorkouts = workouts.map((workout) => ({
      _id: workout._id,
      title: workout.title || "Untitled Workout",
      description: workout.workoutPlan || "No description available.",
      date: workout.createdAt
        ? new Date(workout.createdAt).toDateString()
        : "Date not available",
    }));

    res.render("pastWorkouts", {
      workouts: formattedWorkouts,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error("Error fetching past workouts:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

router.post("/deleteWorkout", ensureAuthenticated, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("workout-Pro");
    const collection = database.collection("workoutPlans");

    const workoutId = req.body.workoutId;
    const result = await collection.deleteOne({ _id: new ObjectId(workoutId) });

    if (result.deletedCount === 1) {
      req.flash("success", "Workout deleted successfully");
    } else {
      req.flash("error", "Failed to delete workout");
    }

    res.redirect("/pastWorkouts");
  } catch (error) {
    console.error("Error deleting workout:", error);
    req.flash("error", "An error occurred while deleting the workout");
    res.redirect("/pastWorkouts");
  } finally {
    await client.close();
  }
});

router.get("/editWorkout/:id", ensureAuthenticated, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("workout-Pro");
    const collection = database.collection("workoutPlans");

    const workoutId = req.params.id;
    const workout = await collection.findOne({ _id: new ObjectId(workoutId) });

    if (!workout) {
      req.flash("error", "Workout not found");
      return res.redirect("/pastWorkouts");
    }

    res.render("editWorkout", { workout });
  } catch (error) {
    console.error("Error fetching workout for edit:", error);
    req.flash("error", "An error occurred while fetching the workout");
    res.redirect("/pastWorkouts");
  } finally {
    await client.close();
  }
});

router.post("/updateWorkout/:id", ensureAuthenticated, async (req, res) => {
  try {
    await client.connect();
    const database = client.db("workout-Pro");
    const collection = database.collection("workoutPlans");

    const workoutId = req.params.id;
    const { workoutPlan } = req.body;

    await collection.updateOne(
      { _id: new ObjectId(workoutId) },
      { $set: { workoutPlan: workoutPlan } }
    );

    req.flash("success", "Workout updated successfully");
    res.redirect("/pastWorkouts");
  } catch (error) {
    console.error("Error updating workout:", error);
    req.flash("error", "An error occurred while updating the workout");
    res.redirect("/pastWorkouts");
  } finally {
    await client.close();
  }
});

module.exports = router;
