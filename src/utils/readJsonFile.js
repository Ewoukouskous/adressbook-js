function readJsonFile(filePath) {
    const fs = require('fs');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading or parsing JSON file at ${filePath}:`, err);
        return null;
    }
}

module.exports = readJsonFile;