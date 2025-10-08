// IMPORTS
const express = require('express');
const path = require('path');
const readJsonFile = require('../utils/readJsonFile');

// VARIABLES
const app = express();
const port = process.env.PORT || 8080;
const dataDb = 'data/db/data.json';
const sectorsDb = 'data/db/sectors.json';

// Log Middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Serve the HTML file
app.use(express.static(path.join(__dirname, '../template')));

// API route for the json data
app.get('/data', (req, res) => res.json(dataDb));


app.get('/sectors', (req, res) => {
    let jsonResponse = readJsonFile(sectorsDb);
    if (jsonResponse) {
        res.send(jsonResponse);
    } else {
        res.status(404).send('Sectors data not found');
    }
});

app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
