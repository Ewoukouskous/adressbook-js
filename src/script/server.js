// Automatically load the .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();

// If there's no env var, we use the 8080 port
const port = process.env.PORT || 8080;

// Log Middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Serve the HTML file
app.use(express.static(path.join(__dirname, '../pages')));

// API route for the json data
const data = require('../../data/db/data.json');
app.get('/data', (req, res) => res.json(data));

app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
