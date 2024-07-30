document.addEventListener("DOMContentLoaded", function() {
    const workoutSchedule = document.getElementById('workout-schedule');
    
    // Function to fetch workout data from Firestore
    async function fetchWorkouts() {
      try {
        const snapshot = await db.collection('workouts').get();
        const workouts = snapshot.docs.map(doc => doc.data());
  
        // Get today's day in lowercase (e.g., 'monday')
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
        // Display workouts
        workouts.forEach(workout => {
          const workoutDay = workout.day.toLowerCase();
          const workoutBox = document.createElement('div');
          workoutBox.classList.add('workout-box');
          
          if (workoutDay === today) {
            workoutBox.innerHTML = `
              <div class="workout-day">${capitalizeFirstLetter(workout.day)}'s Workout</div>
              <div class="workout-type">${workout.type}</div>
            `;
          } else {
            workoutBox.innerHTML = `
              <div class="workout-day">${capitalizeFirstLetter(workout.day)}'s Workout</div>
              <div class="workout-type">${workout.type}</div>
            `;
          }
  
          workoutSchedule.appendChild(workoutBox);
        });
      } catch (error) {
        console.error("Error fetching workouts: ", error);
      }
    }
  
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    // Fetch and display workouts on load
    fetchWorkouts();
  });
  