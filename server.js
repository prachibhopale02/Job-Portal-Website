const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'job_portal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Register user
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;
  db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, role],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'User registered' });
    });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(401).send({ message: 'Invalid credentials' });
      res.send({ message: 'Login successful', user: results[0] });
    });
});

// Get all jobs (for admin view)
app.get('/api/jobs', (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Post job
app.post('/api/jobs', (req, res) => {
  const { title, description, employer_id } = req.body;
  db.query(
    'INSERT INTO jobs (title, description, employer_id, approved) VALUES (?, ?, ?, 0)',
    [title, description, employer_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Job submitted for approval' });
    }
  );
});

// Apply for job
app.post('/api/apply', (req, res) => {
  const { name, email, job_id, resume } = req.body;
  db.query(
    'INSERT INTO applications (job_id, user_id, resume) VALUES (?, ?, ?)',
    [job_id, 1, resume], // Simulated user_id
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Application submitted' });
    }
  );
});

// Admin approve job
app.post('/api/jobs/:id/approve', (req, res) => {
  db.query('UPDATE jobs SET approved = 1 WHERE id = ?', [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Job approved' });
    });
});

app.get('/api/user/:id', (req, res) => {
  db.query('SELECT id, username, role FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send({ message: 'User not found' });
    res.json(results[0]);
  });
});

app.get('/api/user/:id/applications', (req, res) => {
  db.query('SELECT * FROM applications WHERE user_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
