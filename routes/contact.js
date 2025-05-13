const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('database.sqlite');

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  db.run('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Message saved' });
  });
});

module.exports = router;
