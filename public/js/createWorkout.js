document.addEventListener("DOMContentLoaded", function () {
  const answerInput = document.getElementById("answer-input");
  const nextButton = document.getElementById("next-button");
  const chatContainer = document.getElementById("chat-container");

  const questions = [
    "What is your age?",
    "What is your fitness goal?",
    "How many days a week can you work out?",
    "How many rest days do you want?",
    "What is your preferred workout type (e.g., strength, cardio)?",
  ];

  let currentQuestionIndex = 0;
  const userResponses = {};

  function askNextQuestion() {
    if (currentQuestionIndex < questions.length) {
      answerInput.value = "";
      appendMessage(questions[currentQuestionIndex], "bot");
    } else {
      showLoadingPopup();
      submitResponses();
    }
  }

  function handleSubmission() {
    const currentAnswer = answerInput.value.trim();
    if (currentAnswer) {
      appendMessage(currentAnswer, "user");
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
          userResponses["rest days"] = currentAnswer;
          break;
        case 4:
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
      event.preventDefault();
      handleSubmission();
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
        console.log("Response from server:", data); // Log the response
        // No need to update the popup message
      })
      .catch((error) => {
        console.error("Error:", error);
        // No need to update the popup message
      });
  }

  function appendMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-bubble ${sender}`;
    messageElement.innerHTML = `
      <div class="avatar">${sender === "user" ? "User" : "AI"}</div>
      <div class="message">${text}</div>
    `;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  askNextQuestion();

  function showLoadingPopup() {
    const popup = document.createElement("div");
    popup.id = "loading-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <div class="loading-animation"></div>
        <p>Generating your workout plan...</p>
      </div>
    `;
    document.body.appendChild(popup);

    // Wait for 10 seconds and then redirect to the home screen
    setTimeout(() => {
      window.location.href = "/";
    }, 10000);
  }
});

function goToHomePage() {
  window.location.href = "/";
}