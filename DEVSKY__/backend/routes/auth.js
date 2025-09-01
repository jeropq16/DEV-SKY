// backend/routes/auth.js
// Authentication routes: user login.
// Allows inspectors and technicians to log in.

const express = require('express');
const router = express.Router();
const db = require('../db');

// Route: POST /api/auth/login
// Receives: { nombre_usuario, contraseña }
// Responds: { success, user } or { success: false, message }
router.post('/login', (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  if (!nombre_usuario || !contraseña) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  // Query the user in the database
  db.query(
    'SELECT id, nombre_usuario, rol FROM usuarios WHERE nombre_usuario = ? AND contraseña = ?',
    [nombre_usuario, contraseña],
    (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Incorrect username or password' });
      }
      // User found
      const user = results[0];
      res.json({ success: true, user });
    }
  );
});

module.exports = router;
