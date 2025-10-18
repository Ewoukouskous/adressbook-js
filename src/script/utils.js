// utils.js
export const show = el => el.classList.remove("hidden");
export const hide = el => el.classList.add("hidden");
export const clearFields = fields =>
    Object.values(fields).forEach(f => (f.value = ""));
