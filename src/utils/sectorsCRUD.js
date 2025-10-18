require('dotenv').config();
const readJsonFile = require("./readJsonFile.js");


// Function that get all sectors from the api
function getAllSectors() {
    const sectorsData = readJsonFile(process.env.SECTORS_DB_PATH);
    if (sectorsData) {
        return sectorsData.sectors;
    } else {
        console.error("Sectors data not found");
        return null;
    }
}

// Function that get a sector by his ID from the api
function getSectorById(id) {
    // Ensure the id is a number
    const sectorId = parseInt(id);
    if (isNaN(sectorId)) {
        console.error("Invalid sector ID:", id);
        return null;
    }

    // Read the specified sector data
    const sectorsData = readJsonFile(process.env.SECTORS_DB_PATH).sectors.find(sector => sector.id === sectorId);
    // Check if the sector exists, if not return null
    if (sectorsData) {
        return sectorsData;
    } else return null;
}

module.exports = {getAllSectors, getSectorById};