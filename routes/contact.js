// routes/contact.js
const express = require('express');
const Contact = require('../models/content');
const { adminMiddleware } = require('./middleware/auth');

const router = express.Router();

// Submit a new contact message
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Validation checks
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  try {
    const newContact = new Contact({
      name,
      email,
      message,
    });
    
    await newContact.save();
    res.status(201).json({ message: 'Message saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Get all contact messages (admin only)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const contactMessages = await Contact.find().sort({ date: -1 });
    res.json(contactMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// Delete a contact message (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

module.exports = router;