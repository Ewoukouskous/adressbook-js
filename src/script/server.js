// Automatically load the .env file
require('dotenv').config();

// IMPORTS
const express = require('express');
const path = require('path');
const sectorsCRUD = require('../utils/sectorsCRUD.js');
const prospectsCRUD = require('../utils/prospectsCRUD.js');

// VARIABLES
const app = express();
// If there's no env var, we use the 8080 port
const port = process.env.PORT || 8080;
const dataDb = 'data/db/data.json';

// Middleware to parse JSON bodies
app.use(express.json());

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
const {createProspect, getAllProspects, updateProspectById} = require("../utils/prospectsCRUD");
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

app.get('/api/prospects', (req, res) => {
    // If there is an id query param, get the sector by id
    const searchId = req.query.id;
    const sectorId = req.query.sectorId;

    if (searchId) {
        const prospectData = prospectsCRUD.getProspectById(searchId);
        if (prospectData) {
            res.json(prospectData);
        } else {
            return res.status(404).send('Prospect not found');
        }
    } else if (sectorId) {
        const prospectsData = prospectsCRUD.getProspectsBySectorId(sectorId);
        if (prospectsData) {
            res.json(prospectsData);
        } else {
            return res.status(404).send('No prospects found for the given sectorWatchedId');
        }
    }
    // If there is no id query param, get all prospects
    else {
        const prospectsData = prospectsCRUD.getAllProspects()
        if (prospectsData) {
            res.json(prospectsData);
        } else {
            return res.status(404).send('Prospects data not found');
        }
    }
});

app.post('/api/create-prospect', (req, res) => {
    // Generate a new prospect object
    const newProspect = {
        id: null,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        sectorWatchedId: req.body.sectorWatchedId,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city
    }

    // Sanitize and analyse the new prospect
    let sanitizedProspect = prospectsCRUD.analyseAndSanitizeProspect(newProspect);

    if (sanitizedProspect instanceof Error) {
        console.error('PROSPECT CREATION LOG: ERROR while analysing the new prospect: ' + sanitizedProspect.message)
        return res.status(400).send(sanitizedProspect.message);
    }

    // Once we are sure that the prospect is valid, we can proceed to create it

    // Assign an ID to the new prospect by getting the last prospect ID and adding 1
    newProspect.id = getAllProspects()[getAllProspects().length - 1].id + 1;

    // Create the new prospect
    const creationResult = createProspect(newProspect);
    if (creationResult === null) {
        return res.status(500).send('Error creating prospect');
    } else {
        console.log("PROSPECT CREATION LOG: New prospect created with ID " + newProspect.id);
        return res.status(201).json(newProspect);
    }

});

app.delete('/api/delete-prospect', (req, res) => {

    // Check that the id provided is a number
    const prospectId = parseInt(req.body.id);
    if (isNaN(prospectId)) {
        return res.status(400).send('PROSPECT DELETION LOG: Invalid type for prospect ID');
    }

    // Proceed to delete the prospect and check if the deletion was successful
    const deletionResult = prospectsCRUD.deleteProspectById(prospectId);
    if (deletionResult === true) {
        console.log(`PROSPECT DELETION LOG: Prospect with ID ${prospectId} deleted successfully.`);
        return res.status(200).send(`Prospect with ID ${prospectId} deleted successfully.`);
    } else {
        return res.status(500).send(deletionResult.message);
    }

});

app.patch('/api/update-prospect', (req, res) => {

    // Check that the id provided is a number
    const prospectId = parseInt(req.body.id);
    if (isNaN(prospectId)) {
        return res.status(400).send('PROSPECT UPDATE LOG: Invalid type for prospect ID');
    }

    // Proceed to update the prospect and check if the update was successful
    const updateProspect = updateProspectById(prospectId, req.body);

    if (updateProspect instanceof Error) {
        console.error('PROSPECT UPDATE LOG: ERROR while updating the prospect: ' + updateProspect.message)
        return res.status(500).send(updateProspect.message);
    } else {
        console.log(`PROSPECT UPDATE LOG: Prospect with ID ${prospectId} updated successfully.`);
        return res.status(200).json(updateProspect);
    }

});



app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});
