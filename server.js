require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { prisma } = require('./db.js');
const SQLiteStore = require('connect-sqlite3')(session);
const { isAuthenticated } = require('./middleware/auth');
const dailyReportsRouter = require('./routes/dailyReports');
const weeklyReportsRouter = require('./routes/weeklyReports');
const monthlyReportsRouter = require('./routes/monthlyReports');
const yearlyReportsRouter = require('./routes/yearlyReports');

// Check for session secret
if (!process.env.SESSION_SECRET) {
    console.error('✗ SESSION_SECRET is not set in the environment variables.');
    process.exit(1);
}

// Test Prisma connection
prisma.$connect()
  .then(() => console.log('✓ Prisma connected successfully'))
  .catch(err => {
      console.error('✗ Prisma connection failed:', err.message);
      process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from dist
app.use(express.static(path.join(__dirname, 'view')));



app.use(session({
    store: new SQLiteStore({
      db: 'sessions.db',
      dir: './'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // secure in production (HTTPS), false in development
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    } 
}));

// Middleware to check for specific roles
function hasRole(roles) {
    return function(req, res, next) {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    }
}

// Register a new user
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? 'ADMIN' : 'TRAINEE';

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role,
            },
        });

        req.session.user = { id: user.id, name: user.name, role: user.role };
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Registration failed:', error);
        if (error.code === 'P2002') { // Unique constraint violation (e.g., email already exists)
            return res.status(409).json({ error: 'Email already in use' });
        }
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
            req.session.user = { id: user.id, name: user.name, role: user.role };
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
app.get('/api/users', isAuthenticated, hasRole(['ADMIN']), async (req, res) => {
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
app.post('/api/users', isAuthenticated, hasRole(['ADMIN']), async (req, res) => {
    const { name, email, password, role } = req.body;
     if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role,
            },
        });
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Failed to create user:', error);
        if (error.code === 'P2002') { // Unique constraint violation (e.g., email already exists)
            return res.status(409).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update a user (for admins)
app.put('/api/users/:id', isAuthenticated, hasRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (req.user.id === parseInt(id) && req.user.role === 'ADMIN' && role !== 'ADMIN') {
        return res.status(400).json({ error: 'Admins cannot change their own role.' });
    }

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
app.put('/api/users/:id/password', isAuthenticated, hasRole(['ADMIN']), async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

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
app.delete('/api/users/:id', isAuthenticated, hasRole(['ADMIN']), async (req, res) => {
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

// Report routes
app.use('/api/daily-reports', dailyReportsRouter);
app.use('/api/weekly-reports', weeklyReportsRouter);
app.use('/api/monthly-reports', monthlyReportsRouter);
app.use('/api/yearly-reports', yearlyReportsRouter);



// Serve the React app for all non-API GET requests
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Startet den Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
