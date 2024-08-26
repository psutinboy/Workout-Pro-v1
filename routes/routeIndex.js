const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.session) {
    return next();
  }
  res.redirect('/login');
}

router.post("/generate-workout", ensureAuthenticated, async (req, res) => {
  const userResponses = req.body;

  const totalDays = parseInt(userResponses["workout days"]);
  const workoutDays = parseInt(userResponses["workout days"]) - parseInt(userResponses["rest days"]);
  const restDays = parseInt(userResponses["rest days"]);

  const prompt = `
Generate a personalized workout plan based on the following user information:

- Age: ${userResponses["age"]}
- Fitness Goal: ${userResponses["fitness goal"]}
- Workout Days: ${workoutDays}
- Rest Days: ${restDays}
- Preferred Workout Type: ${userResponses["workout type"]}

CRITICAL REQUIREMENTS (must be followed exactly):
1. Total Days: The plan MUST cover exactly ${totalDays} days, no more and no less.
2. Workout Days: Include EXACTLY ${workoutDays} workout days.
3. Rest Days: Include EXACTLY ${restDays} rest days.

FORMAT REQUIREMENTS:
1. For each day:
   - Start with the day name followed by a colon (e.g., "Day 1 (Monday): ").
   - Clearly state if it's a "Rest Day" or describe the workout focus.
   - For workout days, list 3-5 exercises with sets and reps.
   - Separate each day's plan with a newline.

CONTENT GUIDELINES:
1. Workout Specifics:
   - Focus on different muscle groups or workout types each day (e.g., legs, arms, back, chest, cardio).
   - DO NOT include full-body workouts unless specifically requested by the user.
   - Specify sets and reps for each exercise (e.g., "Squats: 3 sets of 10 reps").

2. Personalization:
   - Tailor the plan to the user's age, fitness goal, and preferred workout type.
   - Adjust exercise intensity and complexity based on the information provided.

3. Rest Day Distribution:
   - Distribute rest days evenly throughout the week if possible.

4. Additional Notes:
   - Do not include warm-up or cool-down instructions.
   - Avoid suggesting equipment unless the user's preferred workout type implies its use.

IMPORTANT: Ensure your plan strictly adheres to the number of workout and rest days specified. Any deviation is unacceptable.

Generate a concise, easy-to-read workout plan that strictly follows these guidelines and the user's specifications.`;

  console.log("Generated prompt:", prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 1024,
      temperature: 0.5,
      top_p: 1,
      n: 1,
    });

    console.log("OpenAI API response:", completion);

    const workoutPlan = completion.choices[0].message.content.trim();
    console.log("Generated workout plan:", workoutPlan);

    // Connect to the MongoDB database
    await client.connect();
    const database = client.db("workout-Pro");
    const collection = database.collection('workoutPlans');
    await collection.insertOne({ userId: req.user._id, workoutPlan, createdAt: new Date() });

    res.render("index", { user: req.user, workoutPlan: workoutPlan }); // Pass user object
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate workout plan" });
  } finally {
    await client.close();
  }
});

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    await client.connect();
    const database = client.db('workout-Pro'); // Replace with your database name
    const collection = database.collection('workoutPlans');
    const latestWorkoutPlan = await collection.findOne({ userId: req.user._id }, { sort: { createdAt: -1 } });

    //console.log("Retrieved workout plan:", latestWorkoutPlan); // Debug log

    res.render("index", { user: req.user, workoutPlan: latestWorkoutPlan ? latestWorkoutPlan.workoutPlan : "No workout plan available" }); // Pass user object
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to retrieve workout plan" });
  } finally {
    await client.close();
  }
});

module.exports = router;