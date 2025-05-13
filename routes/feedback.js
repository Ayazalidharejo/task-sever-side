// File: backend/routes/feedback.js
const express = require('express');
const router = express.Router();
const { db } = require('../app');
const authMiddleware = require('./middleware/auth');

// Submit feedback
router.post('/', (req, res) => {
  const { name, email, feedback, rating } = req.body;

  if (!name || !email || !feedback || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  db.run(
    'INSERT INTO feedback (name, email, feedback, rating) VALUES (?, ?, ?, ?)',
    [name, email, feedback, rating],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to submit feedback' });
      }
      res.status(201).json({ message: 'Feedback submitted successfully' });
    }
  );
});

// Get all feedback (admin only)
router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM feedback ORDER BY date DESC', (err, feedback) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(feedback);
  });
});

module.exports = router;