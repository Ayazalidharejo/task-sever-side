// routes/feedback.js
const express = require('express');
const Feedback = require('../models/feedback');
const { adminMiddleware } = require('./middleware/auth');

const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  const { name, email, message, rating } = req.body;
  
  if (!name || !email || !message || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }
  
  try {
    const feedback = new Feedback({ name, email, message, rating });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get all feedback (admin only)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;