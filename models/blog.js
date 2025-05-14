// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  // videoUrl: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);



// // models/blog.js
// const mongoose = require('mongoose');

// const BlogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   excerpt: {
//     type: String,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     default: null
//     // This should store just the filename, not the full path
//   },
//   videoUrl: {
//     type: String,
//     default: null
//     // This should store just the filename, not the full path
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Blog', BlogSchema);