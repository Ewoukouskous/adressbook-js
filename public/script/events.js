// events.js: Contains all event listeners and handlers
import {UI} from "./ui.js";
import {
    openAddModal,
    handleAddSubmit,
    closeUpdateModal,
    handleUpdateSubmit,
    closeDeleteModal,
    handleConfirmDelete,
} from "./modals.js";
import {displayProspects} from "./table.js";
import {sectors} from "./main.js";
import {hide} from "./utils.js";

// Populate sectors dropdown in add and update modals (called on init)
function populateSectorsDropdown() {
    const selectElement = document.getElementById("addSectors");

    // Add sectors to the dropdown
    sectors.forEach(sector => {
        const option = document.createElement("option");
        // The value is the sector id, the text is the sector name
        option.value = sector.id;
        option.textContent = sector.name;
        selectElement.appendChild(option);
    });

    // Do the same for update modal
    const updateSelectElement = document.getElementById("updateSectors");
    if (updateSelectElement) {
        // Populate sectors for update modal
        sectors.forEach(sector => {
            const option = document.createElement("option");
            option.value = sector.id;
            option.textContent = sector.name;
            updateSelectElement.appendChild(option);
        });
    }
}

// Initialize all event listeners
export function initEvents() {
    console.log("Initializing events...");
    console.log("DOMContentLoaded, displaying prospects...");

    displayProspects();

    // Add
    UI.openAddBtn.addEventListener("click", openAddModal);
    UI.closeAddBtn.addEventListener("click", () => hide(UI.addModal));
    UI.addForm.addEventListener("submit", handleAddSubmit);

    // Update
    UI.closeUpdateBtn.addEventListener("click", closeUpdateModal);
    UI.updateForm.addEventListener("submit", handleUpdateSubmit);

    // Delete
    UI.closeDeleteBtn.addEventListener("click", closeDeleteModal);
    UI.confirmDeleteBtn.addEventListener("click", handleConfirmDelete);

    populateSectorsDropdown();
}


