document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.querySelector('button.danger');
  const logoutButton = document.querySelector('form[action="/logout"] button');

  // Confirm before deleting account
  deleteButton.addEventListener('click', (event) => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      event.preventDefault();
    }
  });

  // Confirm before logging out
  logoutButton.addEventListener('click', (event) => {
    if (!confirm('Are you sure you want to log out?')) {
      event.preventDefault();
    }
  });

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

  // Handle form submission via AJAX
  document.getElementById('settingsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log('Form data:', Object.fromEntries(formData.entries())); // Log form data
    try {
      const response = await fetch('/settings/update', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log('Response:', result); // Log response
      if (result.success) {
        alert('Success: ' + result.message);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors
      alert('An error occurred. Please try again.');
    }
  });
});