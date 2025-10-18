// table.js
import { prospects } from "./data.js";
import { UI } from "./ui.js";
import { openUpdateModal, openDeleteModal } from "./modals.js";

export function displayProspects() {
    UI.tbody.innerHTML = "";

    prospects.forEach((prospect, index) => {
        const tr = document.createElement("tr");
        tr.classList.add("hover:bg-blue-50");

        const values = [
            prospect.LastName,
            prospect.Name,
            prospect.Email,
            prospect.Phone,
            prospect.Address,
            prospect.Sectors,
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.className = "px-6 py-3";
            td.textContent = value ?? "";
            tr.appendChild(td);
        });

        const tdActions = document.createElement("td");
        tdActions.className = "px-6 py-3 text-center space-x-2";

        const updateBtn = document.createElement("button");
        updateBtn.type = "button";
        updateBtn.className = "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm";
        updateBtn.textContent = "Update";
        updateBtn.addEventListener("click", () => openUpdateModal(index));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => openDeleteModal(index));

        tdActions.append(updateBtn, deleteBtn);
        tr.appendChild(tdActions);
        UI.tbody.appendChild(tr);
    });
}
