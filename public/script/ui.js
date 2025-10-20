// ui.js: Contains references to all relevant UI elements

export const UI = {
    tbody: document.getElementById("prospectsBody"),

    // Add modal
    addModal: document.getElementById("addModal"),
    openAddBtn: document.getElementById("openAddModal"),
    closeAddBtn: document.getElementById("closeAddModal"),
    addForm: document.getElementById("addForm"),
    addFields: {
        lastName: document.getElementById("addLastName"),
        firstName: document.getElementById("addFirstName"),
        email: document.getElementById("addEmail"),
        phone: document.getElementById("addPhone"),
        city: document.getElementById("addCity"),
        sectorWatchedId: document.getElementById("addSectors"),
    },

    // Update modal
    updateModal: document.getElementById("updateModal"),
    closeUpdateBtn: document.getElementById("closeUpdateModal"),
    updateForm: document.getElementById("updateForm"),
    updateFields: {
        lastName: document.getElementById("updateLastName"),
        firstName: document.getElementById("updateFirstName"),
        email: document.getElementById("updateEmail"),
        phone: document.getElementById("updatePhone"),
        city: document.getElementById("updateCity"),
        sectorWatchedId: document.getElementById("updateSectors"),
    },

    // Delete modal
    deleteModal: document.getElementById("deleteModal"),
    closeDeleteBtn: document.getElementById("closeDeleteModal"),
    confirmDeleteBtn: document.getElementById("confirmDelete"),
};
