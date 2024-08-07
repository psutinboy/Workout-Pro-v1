document.addEventListener("DOMContentLoaded", function () {
  const answerInput = document.getElementById("answer-input");
  const nextButton = document.getElementById("next-button");
  const chatContainer = document.getElementById("chat-container");
  const workoutSchedule = document.getElementById("workout-schedule");

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
        if (data.workoutPlan) {
          window.location.href = "/";
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function appendMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-bubble ${sender}`;
    messageElement.innerHTML = `
      <div class="avatar">${sender === "user" ? "AI" : "AI"}</div>
      <div class="message">${text}</div>
    `;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function orderWorkoutPlanByCurrentDay(workoutPlan) {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    const workoutDays = workoutPlan.split("\n").filter(Boolean);

    const dayMap = {};
    let currentDayName = null;

    // Build a map of days with workouts
    workoutDays.forEach((line) => {
      const trimmedLine = line.trim();
      const day = daysOfWeek.find((d) => trimmedLine.startsWith(d));
      if (day) {
        currentDayName = day;
        dayMap[currentDayName] = [];
      }
      if (currentDayName) {
        dayMap[currentDayName].push(trimmedLine);
      }
    });

    // Reorder days starting from the current day
    const startIndex = daysOfWeek.indexOf(currentDay);
    const orderedPlan = [];

    for (let i = 0; i < daysOfWeek.length; i++) {
      const dayIndex = (startIndex + i) % daysOfWeek.length;
      const dayName = daysOfWeek[dayIndex];
      if (dayMap[dayName]) {
        orderedPlan.push(...dayMap[dayName]);
      }
    }

    return orderedPlan;
  }

  function displayWorkoutPlan(orderedPlan) {
    workoutSchedule.innerHTML = ""; // Clear existing content
    orderedPlan.forEach((line) => {
      const workoutDiv = document.createElement("div");
      workoutDiv.className = "workout-day";
      workoutDiv.textContent = line;
      workoutSchedule.appendChild(workoutDiv);
    });
  }

  askNextQuestion();

  // Define the function to show the popup
  function showPopup() {
    alert("You have answered the last question!");
  }

  // Function to handle different cases
  function handleCase(caseNumber) {
    switch (caseNumber) {
      case 1:
        console.log("Handling case 1");
        // Your logic for case 1
        break;
      case 2:
        console.log("Handling case 2");
        // Your logic for case 2
        break;
      case 3:
        console.log("Handling case 3");
        // Your logic for case 3
        showPopup(); // Show the popup after handling case 3
        break;
      default:
        console.log("Handling default case");
        // Your logic for default case
        break;
    }
  }

  // Example function to simulate answering questions
  function answerQuestion(answer) {
    handleAnswer(currentQuestionIndex, answer);
    currentQuestionIndex++;
  }
});

function goToHomePage() {
  window.location.href = "/";
}
