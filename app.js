// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const feedbackRoutes = require('./routes/feedback');
const contactRoutes = require('./routes/contact');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({origin:["http://localhost:3000",]}));

// Serve static files (e.g., images, videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);

app.post('/welcome', (req, res) => {
  res.json({ message: 'Welcome to the Blog App API!' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    // const PORT = process.env.PORT || 5000;
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });
    
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
module.exports = app;



// app.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config();

// const authRoutes = require('./routes/auth');
// const blogRoutes = require('./routes/blogs');
// const feedbackRoutes = require('./routes/feedback');
// const contactRoutes = require('./routes/contact');

// const app = express();

// // CORS setup
// app.use(cors({
//   origin: ['http://localhost:3000'],
 
// }));

// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/contact', contactRoutes);

// app.post('/welcome', (req, res) => {
//   res.json({ message: 'Welcome to the Blog App API!' });
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   });

// // 👇 Export for Vercel Serverless
// module.exports = app;

// // If running locally
// if (require.main === module) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }
