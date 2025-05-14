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
// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  date: { type: Date, default: Date.now },
});

// ✅ Fix: Model already exist karta ho to use karo, warna naya banao
module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
