const express = require('express');
const db = require('./db');
const router = express.Router();

router.get('/orders', (req, res) => {
  const rows = db.prepare('SELECT * FROM orders').all();
  res.json(rows);
});

router.post('/orders', (req, res) => {
  const { product, quantity } = req.body;
  const info = db
    .prepare('INSERT INTO orders (product, quantity) VALUES (?, ?)')
    .run(product, quantity);
  res.json({ id: info.lastInsertRowid });
});

module.exports = router;
