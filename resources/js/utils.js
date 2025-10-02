// Small utilities shared across modules

/**
 * Debounce helper
 * @param {Function} fn
 * @param {number} wait
 */
export function debounce(fn, wait) {
    let t = null;
    return function () {
        const args = arguments;
        clearTimeout(t);
        t = setTimeout(function () {
            fn.apply(null, args);
        }, wait);
    };
}

/**
 * Show toast notification
 * @param {string} type - "success", "error", "warning", "info"
 * @param {string} message - Message to display
 */
export function showToast(type, message) {
    // Crear elemento toast
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-opacity duration-300 ${
        type === "success"
            ? "bg-green-600"
            : type === "error"
            ? "bg-red-600"
            : type === "warning"
            ? "bg-yellow-600"
            : "bg-blue-600"
    }`;

    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fa-solid ${
                type === "success"
                    ? "fa-check-circle"
                    : type === "error"
                    ? "fa-exclamation-circle"
                    : type === "warning"
                    ? "fa-exclamation-triangle"
                    : "fa-info-circle"
            }"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export default { debounce, showToast };
