const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key', // replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if you're using https
}));

// TODO: Implement user creation with Prisma
app.post('/api/users', (req, res) => {
    // Implementation needed
});

// TODO: Implement login with Prisma
app.post('/api/login', (req, res) => {
    // Implementation needed
});

app.post('/api/reports', async (req, res) => {
  const { title, content } = req.body;
  //const authorId = req.session.userId; // Assuming the user is logged in and userId is in the session
  const authorId = 1; //hardcoded for now

  if (!authorId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const report = await prisma.report.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Register.html'));
});



// Fängt alle get requests ab, die nicht definiert sind
app.use((req, res) => {
    // 404 handler
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));

})

// Startet den Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
