document.addEventListener('DOMContentLoaded', function() {
    const userTimezone = localStorage.getItem('userTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Set default date to today in user's timezone
    const today = new Date();
    const localDate = new Date(today.toLocaleString('en-US', { timeZone: userTimezone }));
    
    // Format the date as YYYY-MM-DD for the input
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    document.getElementById('workoutDate').value = formattedDate;

    // Initialize Select2 for the first exercise selector
    $('select[name="exercises[0][name]"]').select2({
        placeholder: 'Search for an exercise...',
        width: '100%'
    });

    // Handle adding new exercise entries
    let exerciseCount = 1;
    document.getElementById('addExercise').addEventListener('click', function() {
        const exerciseEntries = document.getElementById('exerciseEntries');
        const newExercise = document.createElement('div');
        newExercise.className = 'exercise-entry';
        newExercise.innerHTML = `
            <div class="form-group">
                <label for="exerciseName">Exercise</label>
                <select name="exercises[${exerciseCount}][name]" required>
                    <option value="">Select Exercise</option>
                    <!-- Chest -->
                    <option value="benchPress">Bench Press</option>
                    <option value="inclineBenchPress">Incline Bench Press</option>
                    <option value="declineBenchPress">Decline Bench Press</option>
                    <option value="chestFly">Chest Fly</option>
                    <option value="pushUps">Push-Ups</option>
                    <option value="chestDips">Dips (Chest)</option>
                    <option value="dumbbellPullover">Dumbbell Pullover</option>
                    <option value="pecDeck">Pec Deck Machine</option>
                    
                    <!-- Back -->
                    <option value="deadlift">Deadlift</option>
                    <option value="pullUp">Pull-Up</option>
                    <option value="latPulldown">Lat Pulldown</option>
                    <option value="barbellRow">Barbell Row</option>
                    <option value="dumbbellRow">Dumbbell Row</option>
                    <option value="tBarRow">T-Bar Row</option>
                    <option value="cableRow">Cable Row</option>
                    <option value="straightArmPulldown">Straight Arm Pulldown</option>
                    
                    <!-- Legs -->
                    <option value="squat">Squat</option>
                    <option value="frontSquat">Front Squat</option>
                    <option value="bulgarianSplitSquat">Bulgarian Split Squat</option>
                    <option value="conventionalDeadlift">Deadlift (Conventional)</option>
                    <option value="romanianDeadlift">Deadlift (Romanian)</option>
                    <option value="sumoDeadlift">Deadlift (Sumo)</option>
                    <option value="legPress">Leg Press</option>
                    <option value="walkingLunges">Walking Lunges</option>
                    <option value="stepUps">Step-Ups</option>
                    <option value="legExtension">Leg Extension</option>
                    <option value="legCurl">Leg Curl</option>
                    <option value="calfRaises">Calf Raises</option>
                    <option value="gluteBridge">Glute Bridge / Hip Thrust</option>
                    
                    <!-- Shoulders -->
                    <option value="overheadPress">Overhead Press</option>
                    <option value="arnoldPress">Arnold Press</option>
                    <option value="lateralRaise">Lateral Raise</option>
                    <option value="frontRaise">Front Raise</option>
                    <option value="rearDeltFly">Rear Delt Fly</option>
                    <option value="uprightRow">Upright Row</option>
                    <option value="shrugs">Shrugs</option>
                    <option value="facePulls">Face Pulls</option>
                    
                    <!-- Arms -->
                    <option value="barbellCurl">Barbell Curl</option>
                    <option value="dumbbellCurl">Dumbbell Curl</option>
                    <option value="hammerCurl">Hammer Curl</option>
                    <option value="preacherCurl">Preacher Curl</option>
                    <option value="concentrationCurl">Concentration Curl</option>
                    <option value="cableCurl">Cable Curl</option>
                    <option value="chinUps">Chin-Ups</option>
                    <option value="tricepDips">Tricep Dips</option>
                    <option value="skullCrushers">Skull Crushers</option>
                    <option value="closeGripBench">Close-Grip Bench Press</option>
                    <option value="overheadTricepExtension">Overhead Tricep Extension</option>
                    <option value="cablePushdowns">Cable Pushdowns</option>
                    <option value="kickbacks">Kickbacks</option>
                    
                    <!-- Olympic/Power -->
                    <option value="cleanAndJerk">Clean and Jerk</option>
                    <option value="snatch">Snatch</option>
                    <option value="powerClean">Power Clean</option>
                    <option value="pushPress">Push Press</option>
                    <option value="farmersWalk">Farmer's Walk</option>
                    <option value="kettlebellSwings">Kettlebell Swings</option>
                    <option value="landminePress">Landmine Press</option>
                    <option value="landmineRow">Landmine Row</option>
                    <option value="pauseBenchPress">Pause Bench Press</option>
                    <option value="boxSquats">Box Squats</option>
                    <option value="rackPulls">Rack Pulls</option>
                    <option value="deficitDeadlift">Deficit Deadlift</option>
                    
                    <!-- Core -->
                    <option value="hangingLegRaise">Hanging Leg Raise</option>
                    <option value="cableCrunch">Cable Crunch</option>
                    <option value="russianTwists">Russian Twists</option>
                    <option value="plank">Plank</option>
                    <option value="declineSitUps">Decline Sit-Ups</option>
                    <option value="abWheelRollout">Ab Wheel Rollout</option>
                    <option value="sidePlank">Side Plank</option>
                    <option value="cableWoodchopper">Cable Woodchopper</option>
                    <option value="deadBug">Dead Bug</option>
                    <option value="bicycleCrunch">Bicycle Crunch</option>
                </select>
            </div>
            <div class="form-group">
                <label for="weight">Weight (lbs)</label>
                <input type="number" name="exercises[${exerciseCount}][weight]" min="0" required>
            </div>
            <div class="form-group">
                <label for="sets">Sets</label>
                <input type="number" name="exercises[${exerciseCount}][sets]" min="1" required>
            </div>
            <div class="form-group">
                <label for="reps">Reps</label>
                <input type="number" name="exercises[${exerciseCount}][reps]" min="1" required>
            </div>
            <button type="button" class="remove-exercise secondary-button">Remove</button>
        `;
        exerciseEntries.appendChild(newExercise);
        
        // Initialize Select2 for the new select element
        $(`select[name="exercises[${exerciseCount}][name]"]`).select2({
            placeholder: 'Search for an exercise...',
            width: '100%'
        });
        
        exerciseCount++;
    });

    // Handle removing exercise entries
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-exercise')) {
            const exerciseEntry = e.target.parentElement;
            const select = exerciseEntry.querySelector('select');
            $(select).select2('destroy'); // Destroy Select2 instance before removing
            exerciseEntry.remove();
        }
    });

    // Handle form submission
    document.getElementById('trackProgressForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Create structured data object
        const data = {
            workoutDate: formData.get('workoutDate'),
            duration: parseInt(formData.get('duration')),
            notes: formData.get('notes'),
            exercises: []
        };

        // Get all exercise entries
        const exerciseEntries = document.querySelectorAll('.exercise-entry');
        exerciseEntries.forEach((entry, index) => {
            data.exercises.push({
                name: formData.get(`exercises[${index}][name]`),
                weight: parseInt(formData.get(`exercises[${index}][weight]`)),
                sets: parseInt(formData.get(`exercises[${index}][sets]`)),
                reps: parseInt(formData.get(`exercises[${index}][reps]`))
            });
        });
        
        try {
            const response = await fetch('/trackProgress/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Workout tracked successfully!');
                window.location.href = '/progressTracker';
            } else {
                const errorData = await response.json();
                alert(`Error tracking workout: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error tracking workout');
        }
    });
}); 