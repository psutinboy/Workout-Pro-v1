function goToHomePage() {
    window.location.href = '/';
}

function toggleModal() {
    const modal = document.getElementById('modal');

    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function goToCreateWorkoutPage() {
    window.location.href = '/createWorkout';
}

function goToSettingsPage() {
    window.location.href = '/settings';
}