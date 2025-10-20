require('dotenv').config();
const readJsonFile = require("./readJsonFile.js");
const {createError} = require("./createError.js");
const {getSectorById} = require("./sectorsCRUD");

/* Function that will analyse and sanitize a prospect object before adding it to the database
if the prospect is invalid we return an error message else we return the sanatized prospect object */
function analyseAndSanitizeProspect(prospect) {
    // Check that all fields are not null or undefined.
    for (const key in prospect) {
        if ((prospect[key] === null || prospect[key] === undefined) && key !== 'id') {
            return createError(400, `Field ${key} is required`);
        }
    }

    // Check that firstName, lastName and city are strings
    if (typeof prospect.firstName !== 'string' || typeof prospect.lastName !== 'string' || typeof prospect.city !== 'string') {
        return createError(400, 'First name, last name and city must be strings');
    }
    // Capitalize first letter of firstName, lastName and city
    prospect.firstName = prospect.firstName[0].toUpperCase() + prospect.firstName.slice(1).toLowerCase();
    prospect.lastName = prospect.lastName[0].toUpperCase() + prospect.lastName.slice(1).toLowerCase();
    prospect.city = prospect.city[0].toUpperCase() + prospect.city.slice(1).toLowerCase();

    // Check that sectorWatchedId is a number and corresponds to an existing sector
    if (getSectorById(prospect.sectorWatchedId) == null){
        return createError(404, 'sectorWatchedId does not correspond to an existing sector');
    }

    // Check that email is a valid email
    if (verifyEmail(prospect.email) instanceof Error) {
        return createError(400, 'Invalid email format');
    }

    // Check that email is unique
    if (verifyEmailUniqueness(prospect.email) instanceof Error) {
        return createError(400, 'Email already exists in the database');
    }

    // Check that phone is a valid phone number (french format +33 6 or +33 7)
    if (verifyPhone(prospect.phone) instanceof Error) {
        return createError(400, 'Invalid phone format. Use +33 6XXXXXXXX or +33 7XXXXXXXX');
    }

    // Check that phone is unique
    if (verifyPhoneUniqueness(prospect.phone) instanceof Error) {
        return createError(400, 'Phone number already exists in the database');
    }
}

function sanitizeFirstName(firstName) {
    // Capitalize first letter of firstName
    return firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
}

function sanitizeLastName(lastName) {
    // Capitalize first letter of lastName
    return lastName[0].toUpperCase() + lastName.slice(1).toLowerCase();
}

function sanitizeCity(city) {
    // Capitalize first letter of city
    return city[0].toUpperCase() + city.slice(1).toLowerCase();
}

// Verify email format
function verifyEmail(email) {
    // Check that email is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return createError(400, 'Invalid email format');
    }
}

// Verify email uniqueness
function verifyEmailUniqueness(email) {
    const allProspects = getAllProspects();
    let doesExist = allProspects.find(prospect => prospect.email === email);
    if (doesExist) {
        return createError(400, 'Email already exists in the database');
    }
}

// Verify phone format (french format, only 06 and 07 numbers)
function verifyPhone(phone) {
    // Check that phone is a valid phone number (french format +33 6 or +33 7)
    const phoneRegex = /^\+33[67]\d{8}$/;
    if (!phoneRegex.test(phone)) {
        return createError(400, 'Invalid phone format. Use +33 6XXXXXXXX or +33 7XXXXXXXX');
    }
}

function verifyPhoneUniqueness(phone) {
    const allProspects = getAllProspects();
    let doesExist = allProspects.find(prospect => prospect.phone === phone);
    if (doesExist) {
        return createError(400, 'Phone number already exists in the database');
    }
}


/* ==================================================
                     GETS CRUDS
===================================================== */

// Function to get all the prospects from the JSON database
function getAllProspects() {
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH);
    if (prospectsData) {
        return prospectsData.prospects;
    } else {
        console.error("PROSPECT GET ALL LOG: ERROR Prospects data not found");
        return createProspect(404, 'Prospects data not found');
    }
}

function getProspectById(id) {
    // Ensure the id is a number
    const prospectId = parseInt(id);
    if (isNaN(prospectId)) {
        console.error("PROSPECT GET BY ID LOG: ERROR Prospect id is not a number:", id);
        return createError(400, 'Prospect id is not a number');
    }

    // Read the specified prospect data
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH).prospects.find(prospect => prospect.id === prospectId);
    // Check if the prospect exists, if not return null
    if (prospectsData) {
        return prospectsData;
    } else {
        console.error(`PROSPECT GET BY ID LOG: ERROR Prospect with id ${id} not found`);
        return createError(404, `Prospect with id ${id} not found`);
    }
}

function getProspectsBySectorId(sectorId) {
    // Ensure the id is a number
    const prospectSectorId = parseInt(sectorId);
    if (isNaN(prospectSectorId)) {
        console.error("PROSPECT GET BY SECTOR ID LOG: ERROR Sector id is not a number:", sectorId);
        return createError(400, 'Sector id is not a number');
    }

    // Read the specified prospect data
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH).prospects.filter(prospect => prospect.sectorWatchedId === prospectSectorId);
    // Check if the prospect exists, if not return null
    if (prospectsData) {
        return prospectsData;
    } else return createError(404, `Prospect with id ${prospectSectorId} not found`);
}

/* ==================================================
===================================================== */

function createProspect(prospect) {
    const fs = require('fs');
    const filePath = process.env.PROSPECTS_DB_PATH;
    try {
        // We start by getting the full JSON file
        const oldJsonData = readJsonFile(filePath);
        // If there is no old data, we return null
        if (!oldJsonData) {
            console.error('PROSPECT CREATION LOG: ERROR Prospects data not found');
            return createError(500, 'Prospects JSON data not found');
        }

        // We add the new json data to the old one.
        oldJsonData.prospects.push(prospect);

        // We write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(oldJsonData, null, 2), 'utf8');
        console.log(`PROSPECT CREATION LOG: Successfully wrote data to ${filePath}`);

    } catch (err) {
        console.error(`PROSPECT CREATION LOG: Error writing JSON file at ${filePath}:`, err);
        return createError(500, 'Error writing JSON file');
    }
}

function deleteProspectById(id) {
    const fs = require('fs');
    const filePath = process.env.PROSPECTS_DB_PATH;
    const prospectId = parseInt(id);

    if (isNaN(prospectId)) {
        console.error("PROSPECT DELETION LOG: ERROR Prospect id is not a number:", id);
        return createError(400, 'Prospect id is not a number');
    }

    try {
        // We start by getting the full JSON file
        const oldJsonData = readJsonFile(filePath);
        // If there is no old data, we return an error
        if (!oldJsonData) {
            console.error('PROSPECT DELETION LOG: ERROR Prospects data not found');
            return createError(404, 'Prospects data not found');
        }

        // We remove the new json data to the old one.
        let prospectIndex = oldJsonData.prospects.findIndex(prospect => prospect.id === id);
        oldJsonData.prospects.splice(prospectIndex, 1);

        // If the prospect index is not found 'findIndex' returns -1
        if (prospectIndex === -1) {
            console.error(`PROSPECT DELETION LOG: ERROR Prospect with id ${id} not found`);
            return createError(404, 'Prospect with id ${id} not found');
        }

        // We write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(oldJsonData, null, 2), 'utf8');
        console.log(`PROSPECT DELETION LOG: Successfully wrote data to ${filePath}`);
        return true;

    } catch (err) {
        console.error(`PROSPECT DELETION LOG: Error writing JSON file at ${filePath}:`, err);
        return createError(500, 'Error writing JSON file');
    }
}

function updateProspectById(prospectId, prospectData) {
    const fs = require('fs');
    const filePath = process.env.PROSPECTS_DB_PATH;
    const fieldsUpdatable = ['firstName', 'lastName', 'sectorWatchedId', 'email', 'phone', 'city'];

    if (isNaN(prospectId)) {
        console.error("PROSPECT UPDATE LOG: ERROR Prospect id is not a number:", prospectId);
        return createError(404, 'Prospect id is not a number');
    }

    // We start by getting the full JSON file
    const oldJsonData = readJsonFile(filePath);
    // If there is no old data, we return an error
    if (!oldJsonData) {
        console.error('PROSPECT UPDATE LOG: ERROR Prospects data not found');
        return createError(500, 'Prospects JSON data not found');
    }

    // We start by getting the prospect data to update
    let prospectToUpdate = oldJsonData.prospects.find(prospect => prospect.id === prospectId);
    if (!prospectToUpdate) {
        console.error(`PROSPECT UPDATE LOG: ERROR Prospect with id ${prospectId} not found`);
        return createError(404, `Prospect with id ${prospectId} not found`);
    }

    for (const field of fieldsUpdatable) {
        if (prospectData.hasOwnProperty(field)) {

            if (prospectData[field] === prospectToUpdate[field]) {
                return createError(400, `Field ${field} is the same as the current value`);
            }

            // If the current field is not 'sectorWatchedId', we check that it's a string and do other sanitizations
            if (field !== 'sectorWatchedId') {
                if (typeof prospectData[field] !== 'string') {
                    return createError(400, `Field ${field} is the same as the current value`);
                }

                // Perform any necessary validation or sanitization here
                switch (field) {
                    case 'firstName':
                        prospectToUpdate[field] = sanitizeFirstName(prospectData[field]);
                        continue;
                    case 'lastName':
                        prospectToUpdate[field] = sanitizeLastName(prospectData[field]);
                        continue;
                    case 'email':
                        if (verifyEmail(prospectData[field]) instanceof Error) {
                            return createError(400, 'Invalid email format');
                        }
                        if (verifyEmailUniqueness(prospectData[field]) instanceof Error) {
                            return createError(400, 'Email already exists in the database');
                        }
                        prospectToUpdate[field] = prospectData[field];
                        continue;
                    case 'phone':
                        if (verifyPhone(prospectData[field]) instanceof Error) {
                            return createError(400, 'Invalid phone format. Use +33 6XXXXXXXX or +33 7XXXXXXXX');
                        }
                        if (verifyPhoneUniqueness(prospectData[field]) instanceof Error) {
                            return createError(400, `Phone number already exists in the database`);
                        }
                        prospectToUpdate[field] = prospectData[field];
                        continue;
                    case 'city':
                        prospectToUpdate[field] = sanitizeCity(prospectData[field]);
                }
            } else {
                // Check that sectorWatchedId corresponds to an existing sector
                if (getSectorById(prospectData[field]) == null){
                    return createError(404, 'sectorWatchedId does not correspond to an existing sector');
                }
                // Parse it to an integer (it comes as a string from the request body)
                prospectToUpdate[field] = parseInt(prospectData[field]);
            }
        }
    }

    // We write the updated prospect back to the database
    try {

        // We remove the old prospect data to replace it by the new.
        let prospectIndex = oldJsonData.prospects.findIndex(prospect => prospect.id === prospectId);
        oldJsonData.prospects[prospectIndex] = prospectToUpdate;

        // We write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(oldJsonData, null, 2), 'utf8');
        console.log(`PROSPECT UPDATE LOG: Successfully wrote data to ${filePath}`);
        return prospectToUpdate;

    } catch (err) {
        console.error(`PROSPECT UPDATE LOG: Error writing JSON file at ${filePath}:`, err);
        return createError(500, 'Error writing JSON file for update');
    }
}


module.exports = {getAllProspects, getProspectById, getProspectsBySectorId, createProspect, deleteProspectById, updateProspectById, analyseAndSanitizeProspect};