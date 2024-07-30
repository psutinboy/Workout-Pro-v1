const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

router.post("/generate-workout", async (req, res) => {
  const userResponses = req.body;

  const prompt = `
  Create a workout plan based on the following information:
  make sure to include rest days
  age: ${userResponses["What is your age?"]}
  Fitness goal: ${userResponses["What is your fitness goal?"]}
  Workout days: ${userResponses["How many days a week can you work out?"]}
  Workout type: ${userResponses["What is your preferred workout type (e.g., strength, cardio)?"]}
  `;

  console.log("Generated prompt:", prompt);

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 2048,
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
  res.render("index", { userName: "John" }); // Adjust as necessary
});

module.exports = router;
