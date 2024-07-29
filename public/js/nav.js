function goToHomePage() {
    window.location.href = '/';
}

function toggleModal() {
    const modal = document.getElementById('modal');
    const plusIcon = document.querySelector('.plus-icon');

    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        const rect = plusIcon.getBoundingClientRect();
        modal.style.display = "flex";
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
