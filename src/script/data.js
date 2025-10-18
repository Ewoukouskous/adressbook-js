// data.js
export const prospects = [
    {
        LastName: "Dupont",
        Name: "Marie",
        Email: "marie.dupont@example.com",
        Phone: "06 12 34 56 78",
        Address: "dzbqjzqdq 25 dzroehbqzd",
        Sectors: "Cybersecurity",
    },
];

// Add a new prospect
export function addProspect(newProspect) {
    prospects.push(newProspect);
}

// Update an existing prospect
export function updateProspect(index, updatedData) {
    if (prospects[index]) {
        prospects[index] = { ...prospects[index], ...updatedData };
    }
}

// Delete a prospect
export function deleteProspect(index) {
    prospects.splice(index, 1);
}
