require('dotenv').config();
const readJsonFile = require("./readJsonFile.js");

/* ==================================================
                     GETS CRUDS
===================================================== */
// Function to get all the prospects from the JSON database
function getAllProspects() {
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH);
    if (prospectsData) {
        return prospectsData.prospects;
    } else {
        console.error("Prospects data not found");
        return null;
    }
}

function getProspectById(id) {
    // Ensure the id is a number
    const prospectId = parseInt(id);
    if (isNaN(prospectId)) {
        console.error("Prospect id is not a number:", id);
        return null;
    }

    // Read the specified prospect data
    const prospectsData = readJsonFile(process.env.PROSPECTS_DB_PATH).prospects[prospectId];
    // Check if the prospect exists, if not return null
    if (prospectsData) {
        console.log(prospectsData);
        return prospectsData;
    } else return null;
}

/* ==================================================
===================================================== */

function createProspect(prospect) {

}

module.exports = {getAllProspects, getProspectById};