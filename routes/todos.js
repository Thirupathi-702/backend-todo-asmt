// routes/todos.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();


router.post('/', authenticateToken, (req, res) => {
  const { title, description, status } = req.body;
  const todoId = uuidv4();
  const userId = req.user.userId;

  db.run(
    'INSERT INTO todos (id, userId, title, description, status) VALUES (?, ?, ?, ?, ?)', 
    [todoId, userId, title, description, status || 'pending'], 
    (err) => {
      if (err) return res.status(400).json({ message: 'Error creating todo' });
      res.json({ message: 'Todo created', todoId });
    }
  );
});


router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  db.all('SELECT * FROM todos WHERE userId = ?', [userId], (err, rows) => {
    if (err) return res.status(400).json({ message: 'Error fetching todos' });
    res.json(rows);
  });
});


router.put('/:id', authenticateToken, (req, res) => {
  const { title, description, status } = req.body;
  const todoId = req.params.id;
  
  db.run(
    'UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?',
    [title, description, status, todoId],
    (err) => {
      if (err) return res.status(400).json({ message: 'Error updating todo' });
      res.json({ message: 'Todo updated' });
    }
  );
});


router.delete('/:id', authenticateToken, (req, res) => {
  const todoId = req.params.id;

  db.run('DELETE FROM todos WHERE id = ?', [todoId], (err) => {
    if (err) return res.status(400).json({ message: 'Error deleting todo' });
    res.json({ message: 'Todo deleted' });
  });
});

module.exports = router;
