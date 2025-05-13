
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));
app.use(express.json());

// SQLite Database
const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Initialize Database Tables
const initializeDatabase = () => {
  // Create blogs table
  db.run(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating blogs table:', err);
      return;
    }
    console.log('Blogs table created or already exists');
    
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        return;
      }
      console.log('Users table created or already exists');
      
      // Create contacts table
      db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('Error creating contacts table:', err);
          return;
        }
        console.log('Contacts table created or already exists');
        
        // Seed default user
        db.get('SELECT * FROM users WHERE email = ?', ['admin@example.com'], (err, row) => {
          if (err) {
            console.error('Error checking for user:', err);
            return;
          }
          if (!row) {
            bcrypt.hash('password123', 10, (err, hash) => {
              if (err) {
                console.error('Error hashing password:', err);
                return;
              }
              db.run('INSERT INTO users (email, password) VALUES (?, ?)', ['admin@example.com', hash], (err) => {
                if (err) {
                  console.error('Error seeding user:', err);
                  return;
                }
                console.log('Default user seeded: admin@example.com');
              });
            });
          } else {
            console.log('Default user already exists');
          }
        });

        // Seed mock blogs
        const mockBlogs = [
          { title: 'Blog 1', excerpt: 'Excerpt 1', content: 'Content 1', image: 'https://via.placeholder.com/400', date: new Date().toISOString() },
          { title: 'Blog 2', excerpt: 'Excerpt 2', content: 'Content 2', image: 'https://via.placeholder.com/400', date: new Date().toISOString() },
        ];
        mockBlogs.forEach((blog) => {
          db.run('INSERT OR IGNORE INTO blogs (title, excerpt, content, image, date) VALUES (?, ?, ?, ?, ?)', [
            blog.title,
            blog.excerpt,
            blog.content,
            blog.image,
            blog.date,
          ], (err) => {
            if (err) {
              console.error('Error seeding blog:', err);
              return;
            }
            console.log(`Seeded blog: ${blog.title}`);
          });
        });
      });
    });
  });
};

// Run database initialization
initializeDatabase();

app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;