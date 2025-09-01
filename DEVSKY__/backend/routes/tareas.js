
const express = require('express');
const router = express.Router();
const db = require('../db');

// Delete a task (inspector)
// DELETE /api/tareas/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) {
  console.error('Error deleting task:', err);
  return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true });
  });
});

// Edit description and assigned technician of a task (inspector)
// PUT /api/tareas/:id/edit
// Receives: { descripcion, id_tecnico_asignado }
router.put('/:id/editar', (req, res) => {
  const { id } = req.params;
  const { descripcion, id_tecnico_asignado } = req.body;
  if (!descripcion || !id_tecnico_asignado) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }
  db.query(
    'UPDATE tareas SET descripcion = ?, id_tecnico_asignado = ? WHERE id = ?',
    [descripcion, id_tecnico_asignado, id],
    (err, result) => {
      if (err) {
  console.error('Error editing task:', err);
  return res.status(500).json({ success: false, message: 'Server error' });
      }
      res.json({ success: true });
    }
  );
});
// backend/routes/tareas.js
// Routes for managing aircraft maintenance tasks.
// Allows the inspector to assign tasks and technicians to view and update their status.

// Get all tasks (for the inspector)
// GET /api/tareas
// All tasks, including para_verificar and verificada
router.get('/', (req, res) => {
  db.query(
    `SELECT t.id, t.descripcion, t.estado, t.para_verificar, t.verificada, u.id AS id_tecnico, u.nombre_usuario AS tecnico_nombre
     FROM tareas t
     LEFT JOIN usuarios u ON t.id_tecnico_asignado = u.id`,
    (err, results) => {
      if (err) {
  console.error('Error getting tasks:', err);
  return res.status(500).json({ success: false, message: 'Server error' });
      }
      res.json({ success: true, tareas: results });
    }
  );
});

// Crear una nueva tarea y asignarla a un técnico (inspector)
// POST /api/tareas
// Recibe: { descripcion, id_tecnico_asignado }
router.post('/', (req, res) => {
  const { descripcion, id_tecnico_asignado } = req.body;
  if (!descripcion || !id_tecnico_asignado) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }
  db.query(
    'INSERT INTO tareas (descripcion, id_tecnico_asignado) VALUES (?, ?)',
    [descripcion, id_tecnico_asignado],
    (err, result) => {
      if (err) {
        console.error('Error al crear tarea:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }
      res.json({ success: true, tarea_id: result.insertId });
    }
  );
});

// Obtener tareas asignadas a un técnico específico
// GET /api/tareas/tecnico/:id_tecnico
router.get('/tecnico/:id_tecnico', (req, res) => {
  const { id_tecnico } = req.params;
  db.query(
    'SELECT id, descripcion, estado, para_verificar, verificada FROM tareas WHERE id_tecnico_asignado = ?',
    [id_tecnico],
    (err, results) => {
      if (err) {
        console.error('Error al obtener tareas del técnico:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }
      res.json({ success: true, tareas: results });
    }
  );
});
// Marcar tarea como 'para verificar' (técnico)
// PUT /api/tareas/:id/para-verificar
// Recibe: { para_verificar }
router.put('/:id/para-verificar', (req, res) => {
  const { id } = req.params;
  const { para_verificar } = req.body;
  db.query(
    'UPDATE tareas SET para_verificar = ? WHERE id = ?',
    [para_verificar ? 1 : 0, id],
    (err, result) => {
      if (err) {
        console.error('Error al marcar para verificar:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }
      res.json({ success: true });
    }
  );
});

// Marcar tarea como 'verificada' (inspector)
// PUT /api/tareas/:id/verificar
// Recibe: { verificada }
router.put('/:id/verificar', (req, res) => {
  const { id } = req.params;
  const { verificada } = req.body;
  db.query(
    'UPDATE tareas SET verificada = ? WHERE id = ?',
    [verificada ? 1 : 0, id],
    (err, result) => {
      if (err) {
        console.error('Error al marcar como verificada:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }
      res.json({ success: true });
    }
  );
});

// Actualizar el estado de una tarea (técnico)
// PUT /api/tareas/:id
// Recibe: { estado }
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!estado) {
    return res.status(400).json({ success: false, message: 'Falta el estado' });
  }
  db.query(
    'UPDATE tareas SET estado = ? WHERE id = ?',
    [estado, id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar estado:', err);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
