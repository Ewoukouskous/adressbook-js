require('dotenv').config();
const readJsonFile = require("./readJsonFile.js");
const {getSectorById} = require("./sectorsCRUD");

/* Function that will analyse and sanitize a prospect object before adding it to the database
if the prospect is invalid we return an error message else we return the sanatized prospect object */
function analyseAndSanitizeProspect(prospect) {
    // Check that all fields are not null or undefined.
    for (const key in prospect) {
        if ((prospect[key] === null || prospect[key] === undefined) && key !== 'id') {
            return new Error(`Field ${key} is required`);
        }
    }

    // Check that firstName, lastName and city are strings
    if (typeof prospect.firstName !== 'string' || typeof prospect.lastName !== 'string' || typeof prospect.city !== 'string') {
        return new Error('First name, last name and city must be strings');
    }
    // Capitalize first letter of firstName, lastName and city
    prospect.firstName = prospect.firstName[0].toUpperCase() + prospect.firstName.slice(1).toLowerCase();
    prospect.lastName = prospect.lastName[0].toUpperCase() + prospect.lastName.slice(1).toLowerCase();
    prospect.city = prospect.city[0].toUpperCase() + prospect.city.slice(1).toLowerCase();

    // Check that sectorWatchedId is a number and corresponds to an existing sector
    if (getSectorById(prospect.sectorWatchedId) == null){
        return new Error('sectorWatchedId does not correspond to an existing sector');
    }

    // Check that email is a valid email
    if (verifyEmail(prospect.email) instanceof Error) {
        return new Error('Invalid email format');
    }

    // Check that email is unique
    if (verifyEmailUniqueness(prospect.email) instanceof Error) {
        return new Error('Email already exists in the database');
    }

    // Check that phone is a valid phone number (french format +33 6 or +33 7)
    if (verifyPhone(prospect.phone) instanceof Error) {
        return new Error('Invalid phone format. Use +33 6XXXXXXXX or +33 7XXXXXXXX');
    }

    // Check that phone is unique
    if (verifyPhoneUniqueness(prospect.phone) instanceof Error) {
        return new Error('Phone number already exists in the database');
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
        return new Error('Invalid email format');
    }
}

// Verify email uniqueness
function verifyEmailUniqueness(email) {
    const allProspects = getAllProspects();
    let doesExist = allProspects.find(prospect => prospect.email === email);
    if (doesExist) {
        return new Error('Email already exists in the database');
    }
}

// Verify phone format (french format, only 06 and 07 numbers)
function verifyPhone(phone) {
    // Check that phone is a valid phone number (french format +33 6 or +33 7)
    const phoneRegex = /^\+33[67]\d{8}$/;
    if (!phoneRegex.test(phone)) {
        return new Error('Invalid phone format. Use +33 6XXXXXXXX or +33 7XXXXXXXX');
    }
}

function verifyPhoneUniqueness(phone) {
    const allProspects = getAllProspects();
    let doesExist = allProspects.find(prospect => prospect.phone === phone);
    if (doesExist) {
        return new Error('Phone number already exists in the database');
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
        return null;
    }
}

function getProspectById(id) {
    // Ensure the id is a number
    const prospectId = parseInt(id);
    if (isNaN(prospectId)) {
        console.error("PROSPECT GET BY ID LOG: ERROR Prospect id is not a number:", id);
        return null;
    }

    // Read the specified prospect data
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH).prospects.find(prospect => prospect.id === prospectId);
    // Check if the prospect exists, if not return null
    if (prospectsData) {
        return prospectsData;
    } else return null;
}

function getProspectsBySectorId(sectorId) {
    // Ensure the id is a number
    const prospectSectorId = parseInt(sectorId);
    if (isNaN(prospectSectorId)) {
        console.error("PROSPECT GET BY SECTOR ID LOG: ERROR Sector id is not a number:", sectorId);
        return null;
    }

    // Read the specified prospect data
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH).prospects.filter(prospect => prospect.sectorWatchedId === prospectSectorId);
    // Check if the prospect exists, if not return null
    if (prospectsData) {
        return prospectsData;
    } else return null;
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
            return null;
        }

        // We add the new json data to the old one.
        oldJsonData.prospects.push(prospect);

        // We write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(oldJsonData, null, 2), 'utf8');
        console.log(`PROSPECT CREATION LOG: Successfully wrote data to ${filePath}`);

    } catch (err) {
        console.error(`PROSPECT CREATION LOG: Error writing JSON file at ${filePath}:`, err);
        return null;
    }
}

function deleteProspectById(id) {
    const fs = require('fs');
    const filePath = process.env.PROSPECTS_DB_PATH;
    const prospectId = parseInt(id);

    if (isNaN(prospectId)) {
        console.error("PROSPECT DELETION LOG: ERROR Prospect id is not a number:", id);
        return new Error('PROSPECT DELETION LOG: Prospect id is not a number');
    }

    try {
        // We start by getting the full JSON file
        const oldJsonData = readJsonFile(filePath);
        // If there is no old data, we return an error
        if (!oldJsonData) {
            console.error('PROSPECT DELETION LOG: ERROR Prospects data not found');
            return new Error('PROSPECT DELETION LOG: Prospects data not found');
        }

        // We remove the new json data to the old one.
        let prospectIndex = oldJsonData.prospects.findIndex(prospect => prospect.id === id);
        oldJsonData.prospects.splice(prospectIndex, 1);

        // If the prospect index is not found 'findIndex' returns -1
        if (prospectIndex === -1) {
            console.error(`PROSPECT DELETION LOG: ERROR Prospect with id ${id} not found`);
            return new Error(`PROSPECT DELETION LOG: Prospect with id ${id} not found`);
        }

        // We write the updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(oldJsonData, null, 2), 'utf8');
        console.log(`PROSPECT DELETION LOG: Successfully wrote data to ${filePath}`);
        return true;

    } catch (err) {
        console.error(`PROSPECT DELETION LOG: Error writing JSON file at ${filePath}:`, err);
        return new Error(`PROSPECT DELETION LOG: Error writing JSON file at ${filePath}: ${err.message}`);
    }
}

function updateProspectById(prospectId, prospectData) {
    const fs = require('fs');
    const filePath = process.env.PROSPECTS_DB_PATH;
    const fieldsUpdatable = ['firstName', 'lastName', 'sectorWatchedId', 'email', 'phone', 'city'];

    if (isNaN(prospectId)) {
        console.error("PROSPECT UPDATE LOG: ERROR Prospect id is not a number:", prospectId);
        return new Error('PROSPECT UPDATE LOG: Prospect id is not a number');
    }

    // We start by getting the full JSON file
    const oldJsonData = readJsonFile(filePath);
    // If there is no old data, we return an error
    if (!oldJsonData) {
        console.error('PROSPECT UPDATE LOG: ERROR Prospects data not found');
        return new Error('PROSPECT UPDATE LOG: Prospects data not found');
    }

    // We start by getting the prospect data to update
    let prospectToUpdate = oldJsonData.prospects.find(prospect => prospect.id === prospectId);
    if (!prospectToUpdate) {
        console.error(`PROSPECT UPDATE LOG: ERROR Prospect with id ${prospectId} not found`);
        return new Error(`PROSPECT UPDATE LOG: Prospect with id ${prospectId} not found`);
    }

    for (const field of fieldsUpdatable) {
        if (prospectData.hasOwnProperty(field)) {

            if (prospectData[field] === prospectToUpdate[field]) {
                return new Error (`Field ${field} is the same as the current value`);
            }

            // If the current field is not 'sectorWatchedId', we check that it's a string and do other sanitizations
            if (field !== 'sectorWatchedId') {
                if (typeof prospectData[field] !== 'string') {
                    return new Error(`Field ${field} must be a string`);
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
                            return new Error('Invalid email format');
                        }
                        if (verifyEmailUniqueness(prospectData[field]) instanceof Error) {
                            return new Error('Email already exists in the database');
                        }
                        prospectToUpdate[field] = prospectData[field];
                        continue;
                    case 'phone':
                        if (verifyPhone(prospectData[field]) instanceof Error) {
                            return new Error('Invalid phone format. Use +33 6XXXXXXXX or +33 7XXXXXXXX');
                        }
                        if (verifyPhoneUniqueness(prospectData[field]) instanceof Error) {
                            return new Error('Phone number already exists in the database');
                        }
                        prospectToUpdate[field] = prospectData[field];
                        continue;
                    case 'city':
                        prospectToUpdate[field] = sanitizeCity(prospectData[field]);
                }
            } else {
                // Check that sectorWatchedId corresponds to an existing sector
                if (getSectorById(prospectData[field]) == null){
                    return new Error('sectorWatchedId does not correspond to an existing sector');
                }
                prospectToUpdate[field] = prospectData[field];
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
        return new Error(`PROSPECT UPDATE LOG: Error writing JSON file at ${filePath}: ${err.message}`);
    }
}


module.exports = {getAllProspects, getProspectById, getProspectsBySectorId, createProspect, deleteProspectById, updateProspectById, analyseAndSanitizeProspect};