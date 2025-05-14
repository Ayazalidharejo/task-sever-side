// // models/Feedback.js
// const mongoose = require('mongoose');

// const feedbackSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   message: { type: String, required: true },
//   rating: { type: Number, min: 1, max: 5, required: true },
//   date: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Feedback', feedbackSchema);



// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessKey: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);