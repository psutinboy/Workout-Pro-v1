document.addEventListener('DOMContentLoaded', function() {
    const userTimezone = localStorage.getItem('userTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

    let strengthChart;

    // Initialize strength progress chart
    function initChart() {
        const strengthCtx = document.getElementById('strengthChart').getContext('2d');
        strengthChart = new Chart(strengthCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Weight (lbs)',
                    data: [],
                    borderColor: '#4CAF50',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Weight (lbs)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    // Exercise selector change handler
    async function updateStrengthChart(exercise) {
        try {
            const response = await fetch(`/progressTracker/api/progress/${exercise}`);
            if (!response.ok) {
                throw new Error('Failed to fetch exercise data');
            }
            const data = await response.json();
            
            console.log('Received exercise data:', data); // Add this for debugging
            
            // Update chart with new data
            strengthChart.data.labels = data.dates;
            strengthChart.data.datasets[0].data = data.weights;
            strengthChart.update();
            
        } catch (error) {
            console.error('Error updating strength chart:', error);
        }
    }

    function generateCalendar() {
        const calendarEl = document.getElementById('workoutCalendar');
        const today = new Date();
        
        // Use the user's timezone for the calendar
        const currentDate = new Date(today.toLocaleString('en-US', { timeZone: userTimezone }));
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Clear existing calendar
        calendarEl.innerHTML = '';
        
        // Add month and year header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthYearHeader = document.createElement('div');
        monthYearHeader.className = 'calendar-header';
        monthYearHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        calendarEl.appendChild(monthYearHeader);
        
        // Add day labels
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayLabelsContainer = document.createElement('div');
        dayLabelsContainer.className = 'calendar-row day-labels';
        days.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'calendar-day-label';
            dayLabel.textContent = day;
            dayLabelsContainer.appendChild(dayLabel);
        });
        calendarEl.appendChild(dayLabelsContainer);
        
        // Create calendar grid
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        
        // Calculate first day of month and total days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            if (i === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            dayEl.setAttribute('data-date', i);
            dayEl.textContent = i;
            calendarGrid.appendChild(dayEl);
        }
        
        calendarEl.appendChild(calendarGrid);
    }

    async function loadProgressData() {
        try {
            const response = await fetch('/progressTracker/api/progress');
            if (!response.ok) {
                throw new Error('Failed to fetch progress data');
            }
            const data = await response.json();
            
            console.log('Received progress data:', data); // Add this for debugging
            
            // Update summary cards with animations
            animateNumber('totalWorkouts', data.totalWorkouts);
            animateNumber('monthlyWorkouts', data.monthlyWorkouts);
            animateNumber('avgDuration', data.avgDuration);
            
            // Update calendar
            updateCalendar(data.workoutDays);
            
            // Update timeline
            updateTimeline(data.recentWorkouts);
            
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    }

    function animateNumber(elementId, target) {
        const element = document.getElementById(elementId);
        const start = parseInt(element.textContent) || 0;
        const duration = 1000; // Animation duration in milliseconds
        const steps = 60; // Number of steps in animation
        const increment = (target - start) / steps;
        let current = start;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            if (elementId === 'avgDuration') {
                element.textContent = `${Math.round(current)} min`;
            } else {
                element.textContent = Math.round(current);
            }

            if (step >= steps) {
                clearInterval(timer);
                if (elementId === 'avgDuration') {
                    element.textContent = `${target} min`;
                } else {
                    element.textContent = target;
                }
            }
        }, duration / steps);
    }

    function updateTimeline(workouts) {
        const timeline = document.getElementById('workoutTimeline');
        timeline.innerHTML = '';

        workouts.forEach(workout => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            // Parse the ISO string and convert to user's timezone, adding one day
            const utcDate = new Date(workout.date);
            utcDate.setDate(utcDate.getDate() + 1); // Add one day to fix the offset
            const formattedDate = new Intl.DateTimeFormat('default', {
                dateStyle: 'medium',
                timeZone: userTimezone
            }).format(utcDate);
            
            timelineItem.innerHTML = `
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-content">
                    <strong>${workout.name}</strong>
                    <p>${workout.summary}</p>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });

        if (workouts.length === 0) {
            const noWorkouts = document.createElement('div');
            noWorkouts.className = 'timeline-item';
            noWorkouts.innerHTML = `
                <div class="timeline-content">
                    <p>No recent workouts found</p>
                </div>
            `;
            timeline.appendChild(noWorkouts);
        }
    }

    function updateCalendar(workoutDays) {
        // Get all calendar day elements
        const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
        
        // Reset all days (remove workout class)
        calendarDays.forEach(day => {
            day.classList.remove('workout');
        });
        
        // Mark workout days
        if (Array.isArray(workoutDays)) {
            workoutDays.forEach(isoDate => {
                // Parse the ISO string and convert to user's timezone
                const utcDate = new Date(isoDate);
                const userDate = new Date(utcDate.toLocaleString('en-US', { timeZone: userTimezone }));
                // Add one day to fix the offset
                userDate.setDate(userDate.getDate() + 1);
                const dayOfMonth = userDate.getDate();
                
                const dayEl = Array.from(calendarDays).find(el => 
                    parseInt(el.getAttribute('data-date')) === dayOfMonth
                );
                if (dayEl) {
                    dayEl.classList.add('workout');
                }
            });
        }
    }

    // Initialize everything
    initChart();
    generateCalendar();
    loadProgressData();

    // Initialize Select2 for exercise selector
    $('#exerciseSelect').select2({
        placeholder: 'Search for an exercise...',
        width: '100%'
    });

    // Exercise selector change handler
    $('#exerciseSelect').on('change', function(e) {
        updateStrengthChart(e.target.value);
    });

    // Initial chart update
    updateStrengthChart(document.getElementById('exerciseSelect').value);
}); 