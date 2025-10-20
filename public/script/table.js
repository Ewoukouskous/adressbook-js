// table.js: Is the module responsible for displaying the prospects in the HTML table.
import { UI } from "./ui.js";
import { openUpdateModal, openDeleteModal } from "./modals.js";
import { prospects, sectors } from "./main.js";

// Function to display prospects in the table
export function displayProspects() {

    UI.tbody.innerHTML = "";
    // Iterate over prospects and create table rows
    prospects.forEach((prospect) => {
        // Create table row
        const tr = document.createElement("tr");
        tr.classList.add("hover:bg-blue-50");

        // Create table cells for each prospect attribute
        const values = [
            prospect.id,
            prospect.lastName,
            prospect.firstName,
            prospect.email,
            prospect.phone,
            prospect.city,
            prospect.sectorWatchedId,
        ];

        // Populate table cells
        values.forEach((value, index) => {
            if (index === 0) return // We skip id column

            // Create table cell
            const td = document.createElement("td");
            td.className = "px-6 py-3";

            if (index === 6) {// sectorWatchedId column
                // Find sector name by id
                td.textContent = sectors.find(sector => sector.id === value).name;
            } else {td.textContent = value ?? "Unknown Sector";}
            tr.appendChild(td);
        });

        // Actions cell (Update/Delete)
        const tdActions = document.createElement("td");
        tdActions.className = "px-6 py-3 text-center space-x-2";

        const updateBtn = document.createElement("button");
        updateBtn.type = "button";
        updateBtn.className = "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm";
        updateBtn.textContent = "Update";
        updateBtn.addEventListener("click", () => openUpdateModal(prospect.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => openDeleteModal(prospect.id));

        tdActions.append(updateBtn, deleteBtn);
        tr.appendChild(tdActions);
        UI.tbody.appendChild(tr);
    });
}
