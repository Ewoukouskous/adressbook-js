// modals.js
import { UI } from "./ui.js";
import { show, hide, clearFields } from "./utils.js";
import { addProspect, updateProspect, deleteProspect, prospects } from "./data.js";
import { displayProspects } from "./table.js";

let currentIndex = null;

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    return /^(\+?\d{1,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/.test(phone)
        && cleaned.length >= 10
        && cleaned.length <= 15;
}

function showError(input, message) {
    input.classList.add("border-red-500");
    input.setCustomValidity(message);
    input.reportValidity();
}

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

export function closeAddModal() {
    hide(UI.addModal);
}

export function handleAddSubmit(e) {
    e.preventDefault();

    Object.values(UI.addFields).forEach(clearError);

    const newProspect = Object.fromEntries(
        Object.entries(UI.addFields).map(([key, el]) => [key, el.value.trim()])
    );

    // Validation flag
    let isValid = true;

    if (!newProspect.LastName) {
        showError(UI.addFields.LastName, "Last name is required.");
        isValid = false;
    }

    if (!newProspect.Name) {
        showError(UI.addFields.Name, "First name is required.");
        isValid = false;
    }

    if (!validateEmail(newProspect.Email)) {
        showError(UI.addFields.Email, "Please enter a valid email address.");
        isValid = false;
    }

    if (!validatePhone(newProspect.Phone)) {
        showError(UI.addFields.Phone, "Phone number format is invalid.");
        isValid = false;
    }

    if (!newProspect.Sectors) {
        showError(UI.addFields.Sectors, "Sector is required.");
        isValid = false;
    }

    // --- Stop if any validation fails ---
    if (!isValid) return;

    addProspect(newProspect);
    displayProspects();
    closeAddModal();
}

// Update Modal
export function openUpdateModal(index) {
    currentIndex = index;
    const p = prospects[index];
    if (!p) return;

    Object.keys(UI.updateFields).forEach(key => {
        UI.updateFields[key].value = p[key] ?? "";
    });

    Object.values(UI.updateFields).forEach(field => {
        field.removeEventListener('input', handleInputClear);
        field.addEventListener('input', handleInputClear);
    });

    show(UI.updateModal);
}

export function closeUpdateModal() {
    hide(UI.updateModal);
    currentIndex = null;
}

export function handleUpdateSubmit(e) {
    e.preventDefault();
    if (currentIndex === null) return;

    Object.values(UI.updateFields).forEach(clearError);

    const updatedData = Object.fromEntries(
        Object.entries(UI.updateFields).map(([key, el]) => [key, el.value.trim()])
    );

    let isValid = true;

    if (!updatedData.LastName) {
        showError(UI.updateFields.LastName, "Last name is required.");
        isValid = false;
    }

    if (!updatedData.Name) {
        showError(UI.updateFields.Name, "First name is required.");
        isValid = false;
    }

    if (!validateEmail(updatedData.Email)) {
        showError(UI.updateFields.Email, "Please enter a valid email address.");
        isValid = false;
    }

    if (!validatePhone(updatedData.Phone)) {
        showError(UI.updateFields.Phone, "Phone number format is invalid.");
        isValid = false;
    }

    if (!updatedData.Sectors) {
        showError(UI.updateFields.Sectors, "Sector is required.");
        isValid = false;
    }

    if (!isValid) return;

    updateProspect(currentIndex, updatedData);
    displayProspects();
    closeUpdateModal();
}

// Delete Modal
export function openDeleteModal(index) {
    currentIndex = index;
    show(UI.deleteModal);
}

export function closeDeleteModal() {
    hide(UI.deleteModal);
    currentIndex = null;
}

export function handleConfirmDelete() {
    if (currentIndex === null) return;
    deleteProspect(currentIndex);
    displayProspects();
    closeDeleteModal();
}