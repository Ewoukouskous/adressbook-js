// main.js
import { initEvents } from "./events.js";
import { loadData } from "./data.js";

export let { prospects, sectors } = []; // Initialize as empty arrays

// Function to refresh data from the server (called after add, update, delete)
export function refreshData() {
    // Load the data from the server
    return loadData().then(({ loadedProspects, loadedSectors }) => {
        // Add the new data
        prospects = loadedProspects;
        sectors = loadedSectors;
        return { prospects, sectors };
    });
}

// On DOMContentLoaded, refresh data and initialize events
document.addEventListener("DOMContentLoaded", () => {
    refreshData()
        .then(() => {
            initEvents();
        })
        .catch((error) => {
            console.error("Error loading data:", error);
        });
});

