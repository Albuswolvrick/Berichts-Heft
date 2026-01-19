const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port

app.use(express.json());
// für json body parsing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});




// Das MUSS am Ende bleiben:
app.get((req, res) => {
    // 404 handler
    res.status(404).send('Ressource nicht gefunden');
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
