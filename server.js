const express = require('express');
const app = express();
const path = require('path');
const port = 3000; //test port

app.use(express.json());




// Das MUSS am Ende bleiben:
app.get((req, res) => {
    // 404 handler
    res.status(404).send('Ressource nicht gefunden');
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
