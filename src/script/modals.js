// modals.js
import { UI } from "./ui.js";
import { show, hide, clearFields } from "./utils.js";
import { addProspect, updateProspect, deleteProspect, prospects } from "./data.js";
import { displayProspects } from "./table.js";

let currentIndex = null;

// --- ADD ---
export function openAddModal() {
    clearFields(UI.addFields);
    show(UI.addModal);
}
export function closeAddModal() {
    hide(UI.addModal);
}
export function handleAddSubmit(e) {
    e.preventDefault();

    const newProspect = Object.fromEntries(
        Object.entries(UI.addFields).map(([k, el]) => [k, el.value.trim()])
    );

    if (!newProspect.LastName || !newProspect.Email) {
        alert("Last name and email are required.");
        return;
    }

    addProspect(newProspect);
    displayProspects();
    closeAddModal();
}

// --- UPDATE ---
export function openUpdateModal(index) {
    currentIndex = index;
    const p = prospects[index];
    if (!p) return;

    Object.keys(UI.updateFields).forEach(k => {
        UI.updateFields[k].value = p[k];
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

    const updatedData = Object.fromEntries(
        Object.entries(UI.updateFields).map(([k, el]) => [k, el.value.trim()])
    );

    updateProspect(currentIndex, updatedData);
    displayProspects();
    closeUpdateModal();
}

// --- DELETE ---
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
