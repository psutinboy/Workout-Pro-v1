const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Existing route for rendering the chat page
router.get("/", (req, res) => {
  res.render("chat");
});

// Route to handle messages and interact with OpenAI
router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable personal trainer AI assistant. Provide informative and engaging responses to user queries related to fitness, exercise, nutrition, and overall health. If the user asks about topics unrelated to fitness, politely redirect the conversation back to fitness-related subjects.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Error processing message" });
  }
});

module.exports = router;
