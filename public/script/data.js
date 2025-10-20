// data.js: Wraps all data-related operations, including fetching, adding, updating, and deleting prospects.
// Also handles communication with the backend API.
import {refreshData} from "./main.js";

// Load prospects and sectors data from the server
export function loadData() {
    // Fetch prospects and sectors together
    return Promise.all([
        fetch("http://localhost:8080/api/prospects").then(res => res.json()),
        fetch("http://localhost:8080/api/sectors").then(res => res.json())
    ]).then(([loadedProspects, loadedSectors]) => { // Destructure the results
        return {loadedProspects, loadedSectors};
    });
}


// Add a new prospect
export function addProspect(newProspect) {
    console.log("Sending new prospect to the API : ");
    console.log(newProspect);

    // Send the new prospect to the server (A POST, with the new prospect in the body as JSON)
    return fetch("http://localhost:8080/api/create-prospect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProspect) // Convert the prospect object to JSON string
    })
        .then(response => { // Then handle the response (check for errors)
            if (!response.ok) { // If response is not in 200-299 range, throw an error
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            // After successful addition call refreshData
            return refreshData();
        });
}

// Update an existing prospect
export function updateProspect(prospectId, updatedData) {
    console.log("Sending new prospect data to the API : ");
    console.log(updatedData);

    // Send the update prospect to the server (A PATCH, with the updated data in the body as JSON)
    return fetch("http://localhost:8080/api/update-prospect", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData) // Convert the updated data object to JSON string
    })
        .then(response => { // Then handle the response (check for errors)
            if (!response.ok) { // If response is not in 200-299 range, throw an error
                throw new Error(`HTTP Error: ${response.status} : ${response.body}`);
            }
            return response.json();
        })
        .then(() => {
            // After successfull update call refreshData
            return refreshData();
        });
}

// Delete a prospect
export function deleteProspect(prospectId) {
    console.log("Sending DELETE request to the API for the prospect id : " + prospectId);

    // Send the update prospect to the server (A DELETE, with the id in the body as JSON)
    return fetch("http://localhost:8080/api/delete-prospect", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: prospectId}) // Convert the id to JSON string
    })
        .then(response => { // Then handle the response (check for errors)
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} : ${response.body}`);
            }
        })
        .then(() => {
            // After successfull update call refreshData
            return refreshData();
        });
}
