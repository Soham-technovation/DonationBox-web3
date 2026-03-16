const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./donationbox.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publicKey TEXT UNIQUE,
    name TEXT,
    avatar TEXT,
    location TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donorKey TEXT,
    amount REAL,
    message TEXT,
    txHash TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT,
    lat REAL,
    lng REAL,
    totalAmount REAL DEFAULT 0
  )`);
}

// API Routes

// Profiles
app.get('/api/profiles', (req, res) => {
  db.all('SELECT * FROM profiles', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/profiles', (req, res) => {
  const { publicKey, name, avatar, location } = req.body;
  db.run('INSERT OR REPLACE INTO profiles (publicKey, name, avatar, location) VALUES (?, ?, ?, ?)',
    [publicKey, name, avatar, location], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.get('/api/profiles/:publicKey', (req, res) => {
  db.get('SELECT * FROM profiles WHERE publicKey = ?', [req.params.publicKey], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Donations
app.get('/api/donations', (req, res) => {
  db.all('SELECT * FROM donations ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/donations', (req, res) => {
  const { donorKey, amount, message, txHash } = req.body;
  db.run('INSERT INTO donations (donorKey, amount, message, txHash) VALUES (?, ?, ?, ?)',
    [donorKey, amount, message, txHash], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Locations
app.get('/api/locations', (req, res) => {
  db.all('SELECT * FROM locations ORDER BY totalAmount DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/locations', (req, res) => {
  const { country, lat, lng, amount } = req.body;
  db.run('INSERT OR REPLACE INTO locations (country, lat, lng, totalAmount) VALUES (?, ?, ?, COALESCE((SELECT totalAmount FROM locations WHERE country = ?) + ?, ?))',
    [country, lat, lng, country, amount, amount], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  db.all(`
    SELECT donorKey, SUM(amount) as totalAmount, COUNT(*) as donationCount
    FROM donations
    GROUP BY donorKey
    ORDER BY totalAmount DESC
    LIMIT 10
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
