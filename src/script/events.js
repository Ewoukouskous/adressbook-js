// events.js
import { UI } from "./ui.js";
import {
    openAddModal,
    closeAddModal,
    handleAddSubmit,
    closeUpdateModal,
    handleUpdateSubmit,
    closeDeleteModal,
    handleConfirmDelete,
} from "./modals.js";
import { displayProspects } from "./table.js";

export function initEvents() {
    document.addEventListener("DOMContentLoaded", () => {
        displayProspects();

        // Add
        UI.openAddBtn.addEventListener("click", openAddModal);
        UI.closeAddBtn.addEventListener("click", closeAddModal);
        UI.addForm.addEventListener("submit", handleAddSubmit);

        // Update
        UI.closeUpdateBtn.addEventListener("click", closeUpdateModal);
        UI.updateForm.addEventListener("submit", handleUpdateSubmit);

        // Delete
        UI.closeDeleteBtn.addEventListener("click", closeDeleteModal);
        UI.confirmDeleteBtn.addEventListener("click", handleConfirmDelete);
    });
}
