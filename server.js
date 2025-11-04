const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./affilibot.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    network TEXT NOT NULL,
    commission REAL NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    offer_id INTEGER,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offer_id) REFERENCES offers(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  )`);

  // Insert default settings
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('min_commission', '3.50')`);
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('automation_enabled', 'true')`);
}

// API Routes

// Get dashboard stats
app.get('/api/stats', (req, res) => {
  const stats = {};

  db.get('SELECT SUM(commission) as total_earnings FROM offers WHERE status = "posted"', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    stats.totalEarnings = row.total_earnings || 0;

    db.get('SELECT COUNT(*) as count FROM offers WHERE status = "approved"', (err, row) => {
      stats.activeOffers = row.count || 0;

      db.get('SELECT COUNT(*) as count FROM posts WHERE posted_at >= datetime("now", "-7 days")', (err, row) => {
        stats.postsThisWeek = row.count || 0;

        db.get('SELECT SUM(views) as total_views FROM posts', (err, row) => {
          stats.totalViews = row.total_views || 0;
          res.json(stats);
        });
      });
    });
  });
});

// Get all offers
app.get('/api/offers', (req, res) => {
  const status = req.query.status;
  let query = 'SELECT * FROM offers ORDER BY created_at DESC';

  if (status) {
    query = 'SELECT * FROM offers WHERE status = ? ORDER BY created_at DESC';
    db.all(query, [status], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  } else {
    db.all(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  }
});

// Create new offer
app.post('/api/offers', (req, res) => {
  const { title, network, commission, category } = req.body;

  db.run(
    'INSERT INTO offers (title, network, commission, category) VALUES (?, ?, ?, ?)',
    [title, network, commission, category],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, title, network, commission, category, status: 'pending' });
    }
  );
});

// Update offer status
app.patch('/api/offers/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE offers SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, status });
    }
  );
});

// Delete offer
app.delete('/api/offers/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM offers WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Offer deleted successfully' });
  });
});

// Get all posts
app.get('/api/posts', (req, res) => {
  const query = `
    SELECT posts.*, offers.title as offer_title 
    FROM posts 
    LEFT JOIN offers ON posts.offer_id = offers.id 
    ORDER BY posts.posted_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new post
app.post('/api/posts', (req, res) => {
  const { offer_id, content, views, likes, comments } = req.body;

  db.run(
    'INSERT INTO posts (offer_id, content, views, likes, comments) VALUES (?, ?, ?, ?, ?)',
    [offer_id, content, views || 0, likes || 0, comments || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Update offer status to posted
      db.run('UPDATE offers SET status = "posted" WHERE id = ?', [offer_id]);

      res.json({ 
        id: this.lastID, 
        offer_id, 
        content, 
        views: views || 0, 
        likes: likes || 0, 
        comments: comments || 0 
      });
    }
  );
});

// Get settings
app.get('/api/settings', (req, res) => {
  db.all('SELECT * FROM settings', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });
});

// Update setting
app.put('/api/settings/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  db.run(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ key, value });
    }
  );
});

// Scrape offers (simulated)
app.post('/api/automation/scrape-offers', (req, res) => {
  // Simulate scraping affiliate networks
  const mockOffers = [
    {
      title: "Premium Fitness Tracker - 30 Day Trial",
      network: "ShareASale",
      commission: 15.50,
      category: "Health & Fitness"
    },
    {
      title: "Online Course Platform - Pro Membership",
      network: "CJ Affiliate",
      commission: 25.00,
      category: "Education"
    },
    {
      title: "Eco-Friendly Water Bottle Set",
      network: "Impact",
      commission: 8.75,
      category: "Lifestyle"
    },
    {
      title: "Digital Marketing Tools Suite",
      network: "ShareASale",
      commission: 45.00,
      category: "Business"
    },
    {
      title: "Meal Prep Subscription Service",
      network: "Rakuten",
      commission: 12.30,
      category: "Food & Drink"
    }
  ];

  // Get minimum commission setting
  db.get('SELECT value FROM settings WHERE key = "min_commission"', (err, row) => {
    const minCommission = row ? parseFloat(row.value) : 3.50;

    // Filter offers by minimum commission
    const validOffers = mockOffers.filter(offer => offer.commission >= minCommission);

    // Insert new offers
    let inserted = 0;
    validOffers.forEach(offer => {
      db.run(
        'INSERT INTO offers (title, network, commission, category) VALUES (?, ?, ?, ?)',
        [offer.title, offer.network, offer.commission, offer.category],
        function(err) {
          if (!err) inserted++;
        }
      );
    });

    setTimeout(() => {
      res.json({ 
        message: `Found ${inserted} new offers above €${minCommission}`,
        count: inserted 
      });
    }, 500);
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AffilBot server running on port ${PORT}`);
});
