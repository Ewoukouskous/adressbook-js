const toggleModal = (id, show) => {
    document.getElementById(id).classList.toggle('hidden', !show);
};

document.getElementById('openAddModal').onclick = () => toggleModal('addModal', true);
document.getElementById('closeAddModal').onclick = () => toggleModal('addModal', false);

document.getElementById('openUpdateModal').onclick = () => toggleModal('updateModal', true);
document.getElementById('closeUpdateModal').onclick = () => toggleModal('updateModal', false);

document.getElementById('openDeleteModal').onclick = () => toggleModal('deleteModal', true);
document.getElementById('closeDeleteModal').onclick = () => toggleModal('deleteModal', false);