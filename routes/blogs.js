const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const router = express.Router();
const db = new sqlite3.Database('database.sqlite');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  db.all('SELECT * FROM blogs ORDER BY date DESC LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    db.get('SELECT COUNT(*) as count FROM blogs', (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ blogs: rows, hasMore: offset + rows.length < result.count });
    });
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Blog not found' });
    res.json(row);
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { title, excerpt, content, image } = req.body;
  if (!title || !excerpt || !content || !image) return res.status(400).json({ error: 'All fields required' });
  db.run(
    'INSERT INTO blogs (title, excerpt, content, image, date) VALUES (?, ?, ?, ?, ?)',
    [title, excerpt, content, image, new Date().toISOString()],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: this.lastID });
    }
  );
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title, excerpt, content, image } = req.body;
  if (!title || !excerpt || !content || !image) return res.status(400).json({ error: 'All fields required' });
  db.run(
    'UPDATE blogs SET title = ?, excerpt = ?, content = ?, image = ? WHERE id = ?',
    [title, excerpt, content, image, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Blog updated' });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM blogs WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Blog deleted' });
  });
});

module.exports = router;
