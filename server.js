const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key', // replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if you're using https
}));

// TODO: Implement user creation
app.post('/api/users', (req, res) => {
    // Implementation needed
});

// TODO: Implement login
app.post('/api/login', (req, res) => {
    // Implementation needed
});

// TODO: Implement reports
app.post('/api/reports', async (req, res) => {
  // Implementation needed
  res.status(501).json({ error: 'Not implemented yet' });
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
