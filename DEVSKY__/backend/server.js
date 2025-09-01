// backend/server.js
// Main backend file. Sets up the Express server, middlewares, and routes.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const tareasRoutes = require('./routes/tareas');

// Create a router for users and expose the technicians endpoint
const usuariosRouter = express.Router();
const db = require('./db');
usuariosRouter.get('/tecnicos', (req, res) => {
  db.query('SELECT id, nombre_usuario FROM usuarios WHERE rol = "tecnico"', (err, results) => {
    if (err) {
  console.error('Error getting technicians:', err);
  return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, tecnicos: results });
  });
});

const app = express();
const PORT = 3000; // You can change the port if needed

// Middlewares
app.use(cors()); // Allows requests from the frontend
app.use(bodyParser.json()); // Allows reading JSON in requests

// Main routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tareas', tareasRoutes); // Task routes
app.use('/api/usuarios', usuariosRouter); // User routes (technicians)

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('GMA server running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening at http://localhost:${PORT}`);
});
