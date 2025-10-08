const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Log Middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Serve the HTML file
app.use(express.static(path.join(__dirname, '../template')));

// API route for the json data
const data = require('../../data/db/data.json');
app.get('/data', (req, res) => res.json(data));

app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
