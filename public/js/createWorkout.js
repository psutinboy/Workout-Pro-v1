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
  
  nextButton.addEventListener("click", function () {
    const currentAnswer = answerInput.value.trim();
    if (currentAnswer) {
      appendMessage(currentAnswer, "user");
      userResponses[questions[currentQuestionIndex]] = currentAnswer;
      currentQuestionIndex++;
      askNextQuestion();
    }
  });

  function submitResponses() {
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
    window.location.href = '/';
}