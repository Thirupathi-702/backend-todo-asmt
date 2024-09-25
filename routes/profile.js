const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authenticateToken } = require('./auth');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
});


router.put('/', authenticateToken, (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.userId;

  let updateQuery = 'UPDATE users SET name = ?, email = ?';
  let updateParams = [name, email];

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    updateQuery += ', password = ?';
    updateParams.push(hashedPassword);
  }

  updateQuery += ' WHERE id = ?';
  updateParams.push(userId);

  db.run(updateQuery, updateParams, (err) => {
    if (err) return res.status(400).json({ message: 'Error updating profile' });
    res.json({ message: 'Profile updated' });
  });
});

module.exports = router;

