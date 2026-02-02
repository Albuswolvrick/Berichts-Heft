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
// app.post('/api/users', (req, res) => {
//     // Implementation needed
// });

// TODO: Implement login with Prisma
// app.post('/api/login', (req, res) => {
//     // Implementation needed
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

<<<<<<< HEAD
// Das MUSS am Ende bleiben:
=======
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Register.html'));
});




// Fängt alle get requests ab, die nicht definiert sind
>>>>>>> cb1346998608fa4fa698d0711bf8b922fd6f57db
app.use((req, res) => {
    // 404 handler
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));
    
})

<<<<<<< HEAD
=======
// Startet den Server
>>>>>>> cb1346998608fa4fa698d0711bf8b922fd6f57db
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
