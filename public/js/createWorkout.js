document.addEventListener("DOMContentLoaded", function () {
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const nextButton = document.getElementById("next-button");
  const chatContainer = document.getElementById("chat-container");

  const questions = [
    "What is your age?",
    "What is your fitness goal?",
    "How many days a week can you work out?",
    "What is your preferred workout type (e.g., strength, cardio)?",
    "How many rest days would you like to have?",
  ];

  let currentQuestionIndex = 0;
  const userResponses = {};

  function askNextQuestion() {
    if (currentQuestionIndex < questions.length) {
      answerInput.value = "";
      appendMessage(questions[currentQuestionIndex], "bot");
    } else {
      submitResponses();
    }
  }

  function handleSubmission() {
    const currentAnswer = answerInput.value.trim();
    if (currentAnswer) {
      appendMessage(currentAnswer, "user");
      // Use descriptive keys that match what the server expects
      switch (currentQuestionIndex) {
        case 0:
          userResponses["age"] = currentAnswer;
          break;
        case 1:
          userResponses["fitness goal"] = currentAnswer;
          break;
        case 2:
          userResponses["workout days"] = currentAnswer;
          break;
        case 3:
          userResponses["workout type"] = currentAnswer;
          break;
      }
      currentQuestionIndex++;
      askNextQuestion();
    }
  }

  nextButton.addEventListener("click", handleSubmission);

  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior (e.g., form submission)
      handleSubmission(); // Call the submission handler
    }
  });

  function submitResponses() {
    console.log("Submitting responses:", userResponses); // Add a console log to check data
    fetch("/generate-workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userResponses),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the generated workout plan
        const workoutSchedule = document.getElementById("workout-schedule");
        workoutSchedule.innerHTML = data.workoutPlan;
      })
      .catch((error) => console.error("Error:", error));
  }

  function appendMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-bubble ${sender}`;
    messageElement.innerHTML = `
      <div class="avatar">${sender === "user" ? "ØG" : "⧉"}</div>
      <div class="message">${text}</div>
    `;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  askNextQuestion();
});

function goToHomePage() {
  window.location.href = "/";
}
