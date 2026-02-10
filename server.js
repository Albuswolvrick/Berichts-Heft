const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { prisma } = require('./db.js');
const SQLiteStore = require('connect-sqlite3')(session);
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-jwt-secret'; // Replace with a strong secret

// Test Prisma connection
prisma.$connect()
  .then(() => console.log('✓ Prisma connected successfully'))
  .catch(err => console.error('✗ Prisma connection failed:', err.message));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from dist


app.use(session({
    store: new SQLiteStore({
      db: 'sessions.db',
      dir: './'
    }),
    secret: 'your-secret-key', // replace with a real secret key when exist

    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // secure in production (HTTPS), false in development
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    } 
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

// Middleware to check for admin/manager/moderator roles
function isAdmin(req, res, next) {
    if (!req.user || !['ADMIN', 'MANAGER', 'MODERATOR'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}

// Register a new user
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? 'ADMIN' : 'TRAINEE';

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name: username,
                email,
                passwordHash: hashedPassword,
                role,
            },
        });
        // why do i Use tokens and no Cockies
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1w' });
        req.session.token = token;
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
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

        if (user && await bcrypt.compare(password, user.passwordHash)) {
            const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1w' });
            req.session.token = token;
            res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
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
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Get all users (for admins)
app.get('/api/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to get users:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Create a new user (for admins)
app.post('/api/users', isAuthenticated, isAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;
     if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role, // Make sure role is passed and handled
            },
        });
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error('Failed to create user:', error);
        if (error.code === 'P2002') { // Unique constraint violation (e.g., email already exists)
            return res.status(409).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update a user (for admins)
app.put('/api/users/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Failed to update user:', error);
        if (error.code === 'P2025') { // Record to update not found
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Update a user's password (for admins)
app.put('/api/users/:id/password', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                passwordHash: hashedPassword,
            },
        });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Failed to update password:', error);
        if (error.code === 'P2025') { // Record to update not found
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Delete a user (for admins)
app.delete('/api/users/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete user:', error);
        if (error.code === 'P2025') { // Record to delete not found
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


// Create a new report
app.post('/api/reports', isAuthenticated, async (req, res) => {
    const { title, content, reportType, weekId, trainingYear, reportNumber, weekStart, weekEnd, department, activities, instructions, school } = req.body;
    const userId = req.user.id;
  
    // Basic validation
    if (!title || !content || !reportType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const reportData = {
        title,
        content,
        reportType,
        userId,
      };
  
      if (reportType === 'WEEK') {
        reportData.weekId = weekId ? parseInt(weekId) : null;
        reportData.trainingYear = trainingYear;
        reportData.reportNumber = reportNumber;
        reportData.weekStart = weekStart ? new Date(weekStart) : null;
        reportData.weekEnd = weekEnd ? new Date(weekEnd) : null;
        reportData.department = department;
        reportData.activities = activities;
        reportData.instructions = instructions;
        reportData.school = school;
      }
  
      const report = await prisma.report.create({
        data: reportData,
      });
      res.status(201).json(report);
    } catch (error) {
      console.error('Failed to create report:', error);
      res.status(500).json({ error: 'Failed to create report' });
    }
  });

// Get all reports for the current user
app.get('/api/reports', isAuthenticated, async (req, res) => {
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const { title, content, status, trainingYear, reportNumber, weekStart, weekEnd, department, activities, instructions, school } = req.body;
    const userId = req.user.id;

    try {
        const report = await prisma.report.findUnique({
            where: { id: parseInt(id) },
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        if (report.userId !== userId && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'You are not authorized to edit this report' });
        }
        
        const dataToUpdate = {
            title,
            content,
            status,
        };

        if (report.reportType === 'WEEK') {
            dataToUpdate.trainingYear = trainingYear;
            dataToUpdate.reportNumber = reportNumber;
            dataToUpdate.weekStart = weekStart ? new Date(weekStart) : null;
            dataToUpdate.weekEnd = weekEnd ? new Date(weekEnd) : null;
            dataToUpdate.department = department;
            dataToUpdate.activities = activities;
            dataToUpdate.instructions = instructions;
            dataToUpdate.school = school;
        }


        const updatedReport = await prisma.report.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
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
    const userId = req.user.id;

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
