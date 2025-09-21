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

export default { debounce };
