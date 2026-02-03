const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { prisma } = require('./db.js')

// Test Prisma connection
prisma.$connect()
  .then(() => console.log('✓ Prisma connected successfully'))
  .catch(err => console.error('✗ Prisma connection failed:', err.message));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key', // replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // secure in production (HTTPS), false in development
}));

// TODO: Implement user creation
app.post('/api/users', async (req, res) => {
    // Implementation needed
});

// TODO: Implement login
app.post('/api/login', async (req, res) => {
    // Implementation needed
});

// Create a new report
app.post('/api/reports', async (req, res) => {
  const { title, content, weekId } = req.body;
  // const userId = req.session.userId; // Assuming the user is logged in and userId is in the session
  const userId = 1; // hardcoded for now

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const report = await prisma.report.create({
      data: {
        title,
        content,
        userId,
        weekId,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Fängt alle get requests ab, die nicht definiert sind
app.use((req, res) => {
    // 404 handler
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));
});

// Startet den Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
