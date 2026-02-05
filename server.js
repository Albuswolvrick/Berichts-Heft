const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { prisma } = require('./db.js');

// Test Prisma connection
prisma.$connect()
  .then(() => console.log('✓ Prisma connected successfully'))
  .catch(err => console.error('✗ Prisma connection failed:', err.message));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from dist

app.use(session({
    secret: 'your-secret-key', // replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // secure in production (HTTPS), false in development
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

// Register a new user
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        req.session.userId = user.id;
        res.status(201).json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login a user
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout a user
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Get current user
app.get('/api/users/me', isAuthenticated, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
});


// Create a new report
app.post('/api/reports', isAuthenticated, async (req, res) => {
  const { title, content, weekId } = req.body;
  const userId = req.session.userId;

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

// Get all reports for the current user
app.get('/api/reports', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    try {
        const reports = await prisma.report.findMany({
            where: { userId },
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Failed to get reports:', error);
        res.status(500).json({ error: 'Failed to get reports' });
    }
});

// Get a single report by ID
app.get('/api/reports/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;
    try {
        const report = await prisma.report.findUnique({
            where: { id: parseInt(id) },
        });

        if (!report || report.userId !== userId) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error('Failed to get report:', error);
        res.status(500).json({ error: 'Failed to get report' });
    }
});

// Update a report
app.put('/api/reports/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.session.userId;

    try {
        const report = await prisma.report.findUnique({
            where: { id: parseInt(id) },
        });

        if (!report || report.userId !== userId) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const updatedReport = await prisma.report.update({
            where: { id: parseInt(id) },
            data: { title, content },
        });

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error('Failed to update report:', error);
        res.status(500).json({ error: 'Failed to update report' });
    }
});

// Delete a report
app.delete('/api/reports/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    try {
        const report = await prisma.report.findUnique({
            where: { id: parseInt(id) },
        });

        if (!report || report.userId !== userId) {
            return res.status(404).json({ error: 'Report not found' });
        }

        await prisma.report.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete report:', error);
        res.status(500).json({ error: 'Failed to delete report' });
    }
});


// Serve the React app for all non-API GET requests
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Startet den Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});