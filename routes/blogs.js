// routes/blogs.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();;
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images and videos only
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  }
});

// Admin Create Post
router.post('/', adminMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ error: 'Title, excerpt and content are required' });
    }
    
    // Handle file uploads
    let image = null;
    let videoUrl = null;
    
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        image = `/uploads/${req.files.image[0].filename}`;
      }
      
      if (req.files.video && req.files.video.length > 0) {
        videoUrl = `/uploads/${req.files.video[0].filename}`;
      }
    }
    
    const blog = new Blog({
      title,
      excerpt,
      content,
      image,
      videoUrl,
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating blog post' });
  }
});
router.use('/uploads', (req, res, next) => {
  express.static(uploadsPath, {
    fallthrough: false // Don't call next() if file not found
  })(req, res, (err) => {
    if (err) {
      console.error('Static file error:', err);
      res.status(404).send('File not found');
    }
  });
});
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);
router.use('/uploads', express.static(uploadsPath));
// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching blog post' });
  }
});

// Update blog post (admin only)
router.put('/:id', adminMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    const blogUpdate = { title, excerpt, content };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        blogUpdate.image = `/uploads/${req.files.image[0].filename}`;
      }
      
      if (req.files.video && req.files.video.length > 0) {
        blogUpdate.videoUrl = `/uploads/${req.files.video[0].filename}`;
      }
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogUpdate,
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating blog post' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Delete associated files
    if (blog.image) {
      const imagePath = path.join(__dirname, '..', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (blog.videoUrl) {
      const videoPath = path.join(__dirname, '..', blog.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

module.exports = router;