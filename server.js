const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Database connection
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root', // replace with your database user
    password: '', // replace with your database password
    database: 'your_database_name' // replace with your database name
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MariaDB database!');
    connection.release();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key', // replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if you're using https
}));

app.post('/api/users', (req, res) => {
    const { username, password, role } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send('Error hashing password.');
        }

        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role], (err, result) => {
            if (err) {
                return res.status(500).send('Error creating user.');
            }
            res.status(201).send('User created successfully');
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        if (results.length === 0) {
            return res.status(404).send('No user found.');
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Error comparing passwords.');
            }
            if (!isMatch) {
                return res.status(401).send('Invalid password.');
            }

            req.session.user = user;
            res.status(200).send('Login successful');
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Das MUSS am Ende bleiben:
app.use((req, res) => {
    // 404 handler
    res.status(404).send('Ressource nicht gefunden');
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
