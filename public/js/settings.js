document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.querySelector('button.danger');
  const logoutButton = document.querySelector('form[action="/logout"] button');

  // Confirm before deleting account
  if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        event.preventDefault();
      }
    });
  }

  // Confirm before logging out
  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      if (!confirm('Are you sure you want to log out?')) {
        event.preventDefault();
      }
    });
  }

  // Fetch user data and update the DOM
  fetch('/settings/user')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
      } else {
        document.getElementById('current-name').textContent = data.username;
        document.getElementById('current-email').textContent = data.email || 'No email added';
      }
    })
    .catch(error => console.error('Error fetching user data:', error));

  // Timezone functionality
  const timezoneSelect = document.getElementById('timezone');
  if (timezoneSelect) {
    // Get current timezone from localStorage or default to system timezone
    const currentTimezone = localStorage.getItem('userTimezone') || 
                          Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Populate timezone dropdown with major timezones
    const timezones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Toronto',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
      'Pacific/Auckland'
    ];

    // Sort timezones alphabetically
    timezones.sort();

    // Add system default option
    const systemOption = document.createElement('option');
    systemOption.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    systemOption.textContent = `System Default (${systemOption.value})`;
    timezoneSelect.appendChild(systemOption);

    // Add separator
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    timezoneSelect.appendChild(separator);

    // Add other timezones
    timezones.forEach(tz => {
      const option = document.createElement('option');
      option.value = tz;
      option.textContent = tz.replace('_', ' ');
      option.selected = tz === currentTimezone;
      timezoneSelect.appendChild(option);
    });

    // Save timezone selection to localStorage
    timezoneSelect.addEventListener('change', function() {
      localStorage.setItem('userTimezone', this.value);
      // Show success message
      alert('Timezone updated successfully! The page will now reload.');
      // Reload the page to update all date displays
      window.location.reload();
    });
  }

  // Handle form submission
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const formData = new FormData(this);
      
      try {
        const response = await fetch('/settings/update', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert('Settings updated successfully!');
          // Update displayed information
          document.getElementById('current-username').textContent = formData.get('username');
          document.getElementById('current-email').textContent = formData.get('email');
        } else {
          alert('Error: ' + (result.message || 'Failed to update settings'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating settings');
      }
    });
  }
});