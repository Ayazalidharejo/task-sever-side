// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// // Import routes
// const authRoutes = require('./routes/auth');
// const blogRoutes = require('./routes/blogs');
// const feedbackRoutes = require('./routes/feedback');
// const contactRoutes = require('./routes/contact');

// // Load environment variables
// dotenv.config();

// // Initialize express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Serve static files (e.g., images, videos)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/contact', contactRoutes);


// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
    
//     // Start server
//     // const PORT = process.env.PORT || 5000;
//     // app.listen(PORT, () => {
//     //   console.log(`Server is running on port ${PORT}`);
//     // });
    
//   })
//   .catch(err => {
//     console.error('Failed to connect to MongoDB:', err);
//     process.exit(1);
//   });
//   module export app;




const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const serverless = require('serverless-http'); // For Vercel

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://your-vercel-domain.vercel.app' // Replace with your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Serve static files (for local development only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const feedbackRoutes = require('./routes/feedback');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);

// Welcome route
app.get('/api/welcome', (req, res) => {
  res.json({ message: 'Welcome to the Blog App API!' });
});

// MongoDB connection
let isDbConnected = false;

async function connectToDatabase() {
  if (!isDbConnected) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isDbConnected = true;
    console.log('MongoDB connected');
  }
}

connectToDatabase();

// ----------- VERCEL (serverless) SUPPORT -----------
module.exports = {
  handler: serverless(app), // Vercel serverless entry point
  app // for local development
};

// ----------- LOCAL DEVELOPMENT SUPPORT -----------
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
