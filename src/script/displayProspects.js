// This var will be the fetch result of our db
let prospects = [
    {
        "LastName": "Dupont",
        "Name": "Marie",
        "Email": "marie.dupont@example.com",
        "Phone": "06 12 34 56 78",
        "Address": "dzbqjzqdq 25 dzroehbqzd",
        "Sectors": "Cybersécurité"
    },
];

let currentIndex = null;

// --- Affichage du tableau ---
function displayProspects() {
    const tbody = document.getElementById("prospectsBody");
    tbody.innerHTML = "";

    prospects.forEach((prospects, index) => {
        const tr = document.createElement("tr");
        tr.classList.add("hover:bg-blue-50");

        tr.innerHTML = `
      <td class="px-6 py-3">${prospects.LastName}</td>
      <td class="px-6 py-3">${prospects.Name}</td>
      <td class="px-6 py-3">${prospects.Email}</td>
      <td class="px-6 py-3">${prospects.Phone}</td>
      <td class="px-6 py-3">${prospects.Address}</td>
      <td class="px-6 py-3">${prospects.Sectors}</td>
      <td class="px-6 py-3 text-center space-x-2">
        <button class="openUpdateModal bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm" data-index="${index}">Update</button>
        <button class="openDeleteModal bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm" data-index="${index}">Delete</button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    // Add buttons feature
    document.querySelectorAll(".openUpdateModal").forEach(btn =>
        btn.addEventListener("click", e => openUpdateModal(e.target.dataset.index))
    );
    document.querySelectorAll(".openDeleteModal").forEach(btn =>
        btn.addEventListener("click", e => openDeleteModal(e.target.dataset.index))
    );
}

// Update popup
function openUpdateModal(index) {
    currentIndex = index;
    const p = prospects[index];
    document.getElementById("updateNom").value = p.LastName;
    document.getElementById("updatePrenom").value = p.Name;
    document.getElementById("updateEmail").value = p.Email;
    document.getElementById("updatePhone").value = p.Phone;
    document.getElementById("updateAddress").value = p.Address;
    document.getElementById("updateSectors").value = p.Sectors;
    document.getElementById("updateModal").classList.remove("hidden");
}

document.getElementById("closeUpdateModal").addEventListener("click", () => {
    document.getElementById("updateModal").classList.add("hidden");
});

document.getElementById("updateForm").addEventListener("submit", e => {
    e.preventDefault();
    prospects[currentIndex].LastName = document.getElementById("updateNom").value;
    prospects[currentIndex].Name = document.getElementById("updatePrenom").value;
    prospects[currentIndex].Email = document.getElementById("updateEmail").value;
    prospects[currentIndex].Phone = document.getElementById("updatePhone").value;
    prospects[currentIndex].Address = document.getElementById("updateAddress").value;
    prospects[currentIndex].Sectors = document.getElementById("updateSectors").value;
    displayProspects();
    document.getElementById("updateModal").classList.add("hidden");
});

// --- Gestion du popup Delete ---
function openDeleteModal(index) {
    currentIndex = index;
    document.getElementById("deleteModal").classList.remove("hidden");
}

document.getElementById("closeDeleteModal").addEventListener("click", () => {
    document.getElementById("deleteModal").classList.add("hidden");
});

document.getElementById("confirmDelete").addEventListener("click", () => {
    prospects.splice(currentIndex, 1);
    displayProspects();
    document.getElementById("deleteModal").classList.add("hidden");
});

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", () => {
    displayProspects();
});