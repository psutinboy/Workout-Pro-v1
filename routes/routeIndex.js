const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-workout", async (req, res) => {
  const userResponses = req.body;

  const totalDays = parseInt(userResponses["workout days"]) + parseInt(userResponses["rest days"]);
  const workoutDays = parseInt(userResponses["workout days"]);
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
1. Start your response with a summary line: "This plan includes ${workoutDays} workout days and ${restDays} rest days, totaling ${totalDays} days."
2. For each day:
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
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct-0914",
      prompt: prompt,
      max_tokens: 1024,
      temperature: 0.5,
      top_p: 1,
      n: 1,
    });

    console.log("OpenAI API response:", completion);

    const workoutPlan = completion.choices[0].text.trim();
    console.log("Generated workout plan:", workoutPlan);
    res.render("index", { workoutPlan: workoutPlan });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate workout plan" });
  }
});

// Other routes remain unchanged
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;