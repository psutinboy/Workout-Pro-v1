function goToHomePage() {
  window.location.href = "/";
}

function toggleModal() {
  const modal = document.getElementById("modal");

  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function goToCreateWorkoutPage() {
  window.location.href = "/createWorkout";
}

function goToSettingsPage() {
  window.location.href = "/settings";
}

function toggleMenu() {
  const menu = document.getElementById("hamburgerMenu");
  const overlay = document.getElementById("menuOverlay");
  const body = document.body;

  if (menu.style.left === "0px") {
    menu.style.left = "-300px";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    body.classList.remove("menu-open");
  } else {
    menu.style.left = "0px";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    body.classList.add("menu-open");
  }
}

function goToPastWorkoutsPage() {
  window.location.href = "/pastWorkouts";
}

function goToChatPage() {
  window.location.href = '/chat';
}

function goToProgressTrackerPage() {
  window.location.href = "/progressTracker";
}

function goToTrackProgressPage() {
  window.location.href = '/trackProgress';
}

// Close the menu when the overlay is clicked
document.getElementById("menuOverlay").addEventListener("click", toggleMenu);
