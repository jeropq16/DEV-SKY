// frontend/js/login.js
// Logic for the login form: connects to the backend and displays error messages.
// Fully commented for easy understanding.

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevents the form from reloading the page
    loginError.textContent = '';

  // Get form values
    const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;

  // Call the backend login API
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario, contraseña })
      });
      const data = await response.json();

      if (data.success) {
  // Save the technician user's id in sessionStorage
        if (data.user.rol === 'tecnico') {
          sessionStorage.setItem('tecnicoId', data.user.id);
          window.location.href = 'tecnico.html';
        } else if (data.user.rol === 'inspector') {
          window.location.href = 'inspector.html';
        } else {
          loginError.textContent = 'Unknown user role.';
        }
      } else {
  loginError.textContent = data.message || 'Authentication error.';
      }
    } catch (error) {
  loginError.textContent = 'Could not connect to the server.';
    }
  });
});
