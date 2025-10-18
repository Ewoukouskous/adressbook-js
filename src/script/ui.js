// ui.js
export const UI = {
    tbody: document.getElementById("prospectsBody"),

    // Add modal
    addModal: document.getElementById("addModal"),
    openAddBtn: document.getElementById("openAddModal"),
    closeAddBtn: document.getElementById("closeAddModal"),
    addForm: document.getElementById("addForm"),
    addFields: {
        LastName: document.getElementById("addLastName"),
        Name: document.getElementById("addFirstName"),
        Email: document.getElementById("addEmail"),
        Phone: document.getElementById("addPhone"),
        Address: document.getElementById("addAddress"),
        Sectors: document.getElementById("addSectors"),
    },

    // Update modal
    updateModal: document.getElementById("updateModal"),
    closeUpdateBtn: document.getElementById("closeUpdateModal"),
    updateForm: document.getElementById("updateForm"),
    updateFields: {
        LastName: document.getElementById("updateLastName"),
        Name: document.getElementById("updateFirstName"),
        Email: document.getElementById("updateEmail"),
        Phone: document.getElementById("updatePhone"),
        Address: document.getElementById("updateAddress"),
        Sectors: document.getElementById("updateSectors"),
    },

    // Delete modal
    deleteModal: document.getElementById("deleteModal"),
    closeDeleteBtn: document.getElementById("closeDeleteModal"),
    confirmDeleteBtn: document.getElementById("confirmDelete"),
};
