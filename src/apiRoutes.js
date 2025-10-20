// IMPORTS
const express = require('express');
const router = express.Router();
const sectorsCRUD = require('./utils/sectorsCRUD.js');
const prospectsCRUD = require('./utils/prospectsCRUD.js');

// API route for the sectors data json object
router.get('/sectors', (req, res) => {

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

router.get('/prospects', (req, res) => {
    // If there is an id query param, get the sector by id
    const searchId = req.query.id;
    const sectorId = req.query.sectorId;

    if (searchId) {
        const prospectData = prospectsCRUD.getProspectById(searchId);
        if (!(prospectData instanceof Error)) {
            res.json(prospectData);
        } else {
            return res.status(prospectData.statusCode).send(prospectData.message);
        }
    } else if (sectorId) {
        const prospectsData = prospectsCRUD.getProspectsBySectorId(sectorId);
        if (!(prospectsData instanceof Error)) {
            res.json(prospectsData);
        } else {
            return res.status(prospectsData.statusCode).send(prospectsData.message);
        }
    }
    // If there is no id query param, get all prospects
    else {
        const prospectsData = prospectsCRUD.getAllProspects()
        if (!(prospectsData instanceof Error)) {
            res.json(prospectsData);
        } else {
            return res.status(prospectsData.statusCode).send(prospectsData.message);
        }
    }
});

router.post('/create-prospect', (req, res) => {
    // Generate a new prospect object
    const newProspect = {
        id: null,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        city: req.body.city
    }

    // Add sectorWatchedId as a number (because it comes as a string from the request body)
    newProspect.sectorWatchedId = parseInt(req.body.sectorWatchedId);
    if (isNaN(newProspect.sectorWatchedId)) {
        console.error('PROSPECT CREATION LOG: ERROR - Invalid sectorWatchedId provided');
        return res.status(400).send('Invalid sectorWatchedId provided');
    }

    // Sanitize and analyse the new prospect
    let sanitizedProspect = prospectsCRUD.analyseAndSanitizeProspect(newProspect);

    if (sanitizedProspect instanceof Error) {
        console.error('PROSPECT CREATION LOG: ERROR while analysing the new prospect: ' + sanitizedProspect.message)
        return res.status(sanitizedProspect.statusCode).send(sanitizedProspect.message);
    }

    // Once we are sure that the prospect is valid, we can proceed to create it

    // Assign an ID to the new prospect by getting the last prospect ID and adding 1
    newProspect.id = prospectsCRUD.getAllProspects()[prospectsCRUD.getAllProspects().length - 1].id + 1;

    // Create the new prospect
    const creationResult = prospectsCRUD.createProspect(newProspect);
    if (!(creationResult instanceof Error)) {
        console.log("PROSPECT CREATION LOG: New prospect created with ID " + newProspect.id);
        return res.status(201).json(newProspect);
    } else {
        return res.status(creationResult.statusCode).send(creationResult.message);
    }

});

router.delete('/delete-prospect', (req, res) => {

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
        return res.status(deletionResult.statusCode).send(deletionResult.message);
    }

});

router.patch('/update-prospect', (req, res) => {

    // Check that the id provided is a number
    const prospectId = parseInt(req.body.id);
    if (isNaN(prospectId)) {
        return res.status(400).send('PROSPECT UPDATE LOG: Invalid type for prospect ID');
    }

    // Proceed to update the prospect and check if the update was successful
    const updateProspect = prospectsCRUD.updateProspectById(prospectId, req.body);

    if (!(updateProspect instanceof Error)) {
        console.log(`PROSPECT UPDATE LOG: Prospect with ID ${prospectId} updated successfully.`);
        return res.status(200).json(updateProspect);
    } else {
        console.error('PROSPECT UPDATE LOG: ERROR while updating the prospect: ' + updateProspect.message)
        return res.status(updateProspect.statusCode).send(updateProspect.message);
    }

});

module.exports = router;