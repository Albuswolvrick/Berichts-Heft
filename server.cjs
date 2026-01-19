const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port

//generated\prisma\client.ts
const { PrismaClient } = require(path.join(__dirname,'generated', 'prisma', 'client.ts'));

// für json body parsing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Login.html'));
});




// Das MUSS am Ende bleiben:
app.use((req, res) => {
    // 404 handler
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'));
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
