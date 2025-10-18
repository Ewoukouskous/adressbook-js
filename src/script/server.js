// Automatically load the .env file
require('dotenv').config();

const express = require('express');
const path = require('path');

// VARIABLES
const app = express();
// If there's no env var, we use the 8080 port
const port = process.env.PORT || 8080;
const dataDb = 'data/db/data.json';


// Log Middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Serve dashboard.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/dashboard.html'));
});

// Serve statics files
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/script', express.static(path.join(__dirname, '../script')));


// API route for the json data
const data = require('../../data/db/data.json');
app.get('/data', (req, res) => res.json(data));


// API route for the sectors data json object
app.get('/api/sectors', (req, res) => {

    // If there is an id query param, get the sector by id
    const searchId = req.query.id;
    if (searchId) {
        const sectorData = sectorsCRUD.getSectorById(searchId);
        if (sectorData) {
            res.json(sectorData);
        } else {
            res.status(404).send('Sector not found');
        }
        // If there is no id query param, get all sectors
    } else {
        const sectorsData = sectorsCRUD.getAllSectors()
        if (sectorsData) {
            res.json(sectorsData);
        } else {
            res.status(404).send('Sectors data not found');
        }
    }
    return null
});

app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
