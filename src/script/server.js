// IMPORTS
const express = require('express');
const path = require('path');

// VARIABLES
const app = express();
const port = process.env.PORT || 8080;
const dataDb = '../../data/db/data.json';

// Log Middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Serve the HTML file
app.use(express.static(path.join(__dirname, '../template')));

// API route for the json data
app.get('/data', (req, res) => res.json(dataDb));

app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
