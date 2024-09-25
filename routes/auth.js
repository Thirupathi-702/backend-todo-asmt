const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const db = require('../database');
const router = express.Router();

const secret =process.env.secret ; 
//console.log(secret)

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = uuidv4();
  
  db.run('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', 
    [userId, name, email, hashedPassword], (err) => {
      if (err) return res.status(400).json({ message: 'User already exists' });
      const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
      res.json({ token });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    res.json({ token });
  });
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.sendStatus(401); 
  
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.sendStatus(403); 
      req.user = user;
      next();
    });
  };
module.exports = { router, authenticateToken };
