// modals.js: Is the module handling the add, update, and delete modals for prospects.
import {UI} from "./ui.js";
import {show, hide, clearFields} from "./utils.js";
import {addProspect, updateProspect, deleteProspect} from "./data.js";
import {prospects} from "./main.js";
import {displayProspects} from "./table.js";

let currentProspectId = null; // To track the prospect being updated or deleted

// Validation functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    return /^[67]\d{8}$/.test(cleaned);
}

// Show error message
function showError(input, message) {
    input.classList.add("border-red-500");
    input.setCustomValidity(message);
    input.reportValidity();
}

// Clear error message
function clearError(input) {
    input.classList.remove("border-red-500");
    input.setCustomValidity("");
}

// Handler to clear errors on input
function handleInputClear(e) {
    clearError(e.target);
}

// Add modal
export function openAddModal() {
    clearFields(UI.addFields);

    // Clear errors on input - attach listener to each field
    Object.values(UI.addFields).forEach(field => {
        field.removeEventListener('input', handleInputClear);
        field.addEventListener('input', handleInputClear);
    });

    show(UI.addModal);
}

// Handle Add Submit (with validation)
export function handleAddSubmit(e) {
    e.preventDefault();

    // Clear possibles previous errors
    Object.values(UI.addFields).forEach(clearError);

    // Gather form data
    const newProspect = Object.fromEntries(
        Object.entries(UI.addFields).map(([key, el]) => [key, el.value.trim()])
    );

    // Validation flag
    let isValid = true;

    // Check required fields
    if (!newProspect.lastName) {
        showError(UI.addFields.lastName, "Last name is required.");
        isValid = false;
    }

    if (!newProspect.firstName) {
        showError(UI.addFields.firstName, "First name is required.");
        isValid = false;
    }

    if (!validateEmail(newProspect.email)) {
        showError(UI.addFields.email, "Please enter a valid email address.");
        isValid = false;
    }

    if (!validatePhone(newProspect.phone)) {
        showError(UI.addFields.phone, "Phone number format is invalid.");
        isValid = false;
    }

    if (!newProspect.sectorWatchedId) {
        showError(UI.addFields.sectorWatchedId, "Sector is required.");
        isValid = false;
    }

    // --- Stop if any validation fails ---
    if (!isValid) return;

    // Add +33 prefix to phone number
    newProspect.phone = "+33" + newProspect.phone.replace(/\s/g, '');

    // Call the addProspect function, which returns a promise then handle success and error
    addProspect(newProspect).then(data => {
        console.log("Prospect added:", data);
        displayProspects();
        hide(UI.addModal);
    }).catch(error => {
        console.error("Error adding prospect:", error);
        alert(error.message);
    });

}

// Update Modal: Populate the form with existing prospect data
export function openUpdateModal(prospectId) {
    // Set the current prospect ID
    currentProspectId = prospectId;

    // Find the prospect to update
    const p = prospects.find(pr => pr.id === prospectId);
    if (!p) return;

    // Populate the form fields
    Object.keys(UI.updateFields).forEach(key => {
        UI.updateFields[key].value = p[key] ?? "";
    });

    // Clear the phone field to remove +33 for editing
    UI.updateFields.phone.value = p.phone.startsWith("+33") ? p.phone.replace("+33", "") : "";

    // Clear errors on input - attach listener to each field
    Object.values(UI.updateFields).forEach(field => {
        field.removeEventListener('input', handleInputClear);
        field.addEventListener('input', handleInputClear);
    });

    show(UI.updateModal);
}

export function closeUpdateModal() {
    hide(UI.updateModal);
    currentProspectId = null;
}

// Handle Update Submit (with validation and change detection)
export function handleUpdateSubmit(e) {
    e.preventDefault();
    if (currentProspectId === null) return;

    // Find the original prospect data
    const originalProspect = prospects.find(pr => pr.id === currentProspectId);
    if (!originalProspect) return; // Prospect not found

    // Clear possibles previous errors
    Object.values(UI.updateFields).forEach(clearError);

    // Prepare updated data object
    const updatedData = {id: originalProspect.id};
    let hasChanges = false;

    // Check each field for changes
    for (const [key, field] of Object.entries(UI.updateFields)) {
        const value = field.value.trim();

        // Spécial case for the phone field
        if (key === 'phone') {
            // Add +33 prefix for comparison and remove spaces
            const formattedPhone = "+33" + value.replace(/\s/g, '');
            if (formattedPhone !== originalProspect.phone) {
                updatedData[key] = formattedPhone;
                hasChanges = true;
            }
        }
        // For other fields
        else if (value !== (originalProspect[key] || "")) {
            updatedData[key] = value;
            hasChanges = true;
        }
    }

    let isValid = true;

    // Validation only on changed fields
    if ('lastName' in updatedData) {
        const value = updatedData.lastName || "";
        if (!value) {
            showError(UI.updateFields.lastName, "Last name is required.");
            isValid = false;
        }
    }

    if ('firstName' in updatedData) {
        const value = updatedData.firstName || "";
        if (!value) {
            showError(UI.updateFields.firstName, "First name is required.");
            isValid = false;
        }
    }

    if ('email' in updatedData) {
        if (!validateEmail(updatedData.email)) {
            showError(UI.updateFields.email, "Please enter a valid email address.");
            isValid = false;
        }
    }

    if ('phone' in updatedData) {
        const phoneToValidate = updatedData.phone.replace("+33", "");
        if (!validatePhone(phoneToValidate)) {
            showError(UI.updateFields.phone, "Phone number format is invalid.");
            isValid = false;
        } else {
            // Reformat phone number with +33 prefix
            updatedData.phone = "+33" + phoneToValidate;
        }
    }

    if ('sectorWatchedId' in updatedData) {
        const value = updatedData.sectorWatchedId || "";
        if (!value) {
            showError(UI.updateFields.sectorWatchedId, "Sector is required.");
            isValid = false;
        }
    }

    if (!isValid) return;

    // If there are changes, proceed to update
    if (hasChanges) {
        console.log("Changes detected, updating only modified fields:", updatedData);
        updateProspect(currentProspectId, updatedData)
            .then(() => {
                displayProspects();
                closeUpdateModal();
            })
            .catch((error) => {
                console.error("Error updating prospect:", error);
                alert(error.message);
            });
    } else {
        console.log("No changes detected, skipping update.");
        closeUpdateModal();
    }
}

// Delete Modal
export function openDeleteModal(prospectId) {
    currentProspectId = prospectId;
    show(UI.deleteModal);
}

export function closeDeleteModal() {
    hide(UI.deleteModal);
    currentProspectId = null;
}

// Handle Confirm Delete
export function handleConfirmDelete() {
    if (currentProspectId === null) return;
    deleteProspect(currentProspectId)
        .then(() => {
            displayProspects();
            closeDeleteModal();
        })
        .catch((error) => {
            console.error("Error deleting prospect:", error);
            alert(error.message);
        });
}