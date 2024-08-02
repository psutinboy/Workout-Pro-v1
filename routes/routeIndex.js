const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-workout", async (req, res) => {
  const userResponses = req.body;

  // Ensure that the keys match exactly with what is sent from the front end
  const prompt = `
  Create a workout plan based on the following information:
  make sure to include rest days and a variety of exercises.
  make sure not to exceed the specified amount of rest days.
  make sure to focus on specific groups of muscles for each day (e.g., legs, arms, back and shoulders, etc).
  make sure the workout plan a maximum of 7 days long including rest days.
  make sure the workouts are balanced and not too intense.
  Never do a full body workout.
  Age: ${userResponses["age"]}
  Fitness goal: ${userResponses["fitness goal"]}
  Workout days: ${userResponses["workout days"]}
  Workout type: ${userResponses["workout type"]}
  `;

  console.log("Generated prompt:", prompt);

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct-0914",
      prompt: prompt,
      max_tokens: 1024, // Increased token limit
      temperature: 0.5,
      top_p: 1,
      n: 1,
    });

    console.log("OpenAI API response:", completion);

    const workoutPlan = completion.choices[0].text.trim();
    res.json({ workoutPlan: workoutPlan });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate workout plan" });
  }
});

// Define your routes here
router.get("/", (req, res) => {
  res.render("index"); // Adjust as necessary
});

module.exports = router;
