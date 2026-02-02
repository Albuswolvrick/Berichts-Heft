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

// Das MUSS am Ende bleiben:
app.use((req, res) => {
    // 404 handler
    res.status(404).send('Ressource nicht gefunden');
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
