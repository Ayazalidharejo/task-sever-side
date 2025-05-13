const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('database.sqlite');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;



// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const sqlite3 = require('sqlite3').verbose();

// const router = express.Router();
// const db = new sqlite3.Database('database.sqlite');

// // Login route
// router.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'All fields required' });

//   db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });
//     bcrypt.compare(password, user.password, (err, match) => {
//       if (err) return res.status(500).json({ error: 'Server error' });
//       if (!match) return res.status(401).json({ error: 'Invalid credentials' });
//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       res.json({ token });
//     });
//   });
// });

// // Register route
// router.post('/register', (req, res) => {
//   const { email, password } = req.body;
  
//   // Validate input
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
  
//   // Validate email format
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }
  
//   // Validate password strength (minimum 6 characters)
//   if (password.length < 6) {
//     return res.status(400).json({ error: 'Password must be at least 6 characters long' });
//   }

//   // Check if user already exists
//   db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
//     if (err) {
//       return res.status(500).json({ error: 'Database error' });
//     }
    
//     if (existingUser) {
//       return res.status(409).json({ error: 'User already exists' });
//     }
    
//     // Hash password
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error hashing password' });
//       }
      
//       // Insert new user
//       db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
//         if (err) {
//           return res.status(500).json({ error: 'Error creating user' });
//         }
        
//         // Generate JWT token
//         const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
//         res.status(201).json({ 
//           message: 'User registered successfully',
//           token
//         });
//       });
//     });
//   });
// });

// module.exports = router;
