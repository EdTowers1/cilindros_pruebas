/**
 * Módulo de Utilidades
 *
 * Funciones auxiliares compartidas entre los diferentes módulos.
 * Gestiona el modo de edición, visualización de detalles y ajustes de UI.
 */

/**
 * Sincroniza las alturas del panel de detalles
 *
 * Establece una altura mínima para el placeholder para evitar saltos visuales
 * cuando se muestra el contenido real del detalle.
 *
 * @example
 * import { syncDetailHeights } from './utils.js';
 * syncDetailHeights();
 */
export function syncDetailHeights() {
    const placeholder = document.getElementById("movimientoPlaceholder");
    if (placeholder) placeholder.style.minHeight = "365px";
}

/**
 * Activa el modo de edición del movimiento
 *
 * Muestra solo el campo de cilindro (el campo de cliente NO se muestra en modo edición).
 * Marca los wrappers con data-was-hidden para poder restaurarlos después.
 *
 * Acciones:
 * 1. Busca el wrapper oculto del campo cilindro
 * 2. Lo marca con data-was-hidden="true" para restaurarlo después
 * 3. Remueve la clase "hidden" para mostrarlo
 * 4. NO muestra el campo de cliente (permanece oculto)
 * 5. Enfoca el campo cilindro
 *
 * @example
 * import { enterEditMode } from './utils.js';
 * enterEditMode();
 */
export function enterEditMode() {
    /**
     * Muestra un wrapper oculto y lo marca para restaurarlo después
     *
     * @param {string} id - ID del elemento a buscar
     * @returns {HTMLElement|null} El elemento encontrado o null
     */
    const toggleWrapper = (id) => {
        const el = document.getElementById(id);
        const wrapper = el?.closest(".hidden"); // Buscar wrapper padre oculto
        if (wrapper) {
            // Marcar que estaba oculto para poder restaurarlo
            wrapper.dataset.wasHidden = "true";
            // Mostrar el wrapper
            wrapper.classList.remove("hidden");
        }
        return el;
    };

    // Solo mostrar campo de cilindro y enfocarlo
    // El campo de cliente NO se muestra en modo edición
    toggleWrapper("cilindro")?.focus();
}

/**
 * Desactiva el modo de edición del movimiento
 *
 * Oculta los campos que fueron mostrados por enterEditMode() y
 * restaura los campos a solo lectura.
 *
 * Acciones:
 * 1. Busca todos los elementos marcados con data-was-hidden="true"
 * 2. Les agrega la clase "hidden" para ocultarlos
 * 3. Remueve el atributo data-was-hidden
 * 4. Pone el campo cliente en modo solo lectura
 * 5. Quita el foco del campo cilindro
 *
 * @example
 * import { exitEditMode } from './utils.js';
 * exitEditMode();
 */
export function exitEditMode() {
    // Buscar y ocultar todos los wrappers que fueron mostrados
    document.querySelectorAll('[data-was-hidden="true"]').forEach((el) => {
        el.classList.add("hidden"); // Ocultar
        el.removeAttribute("data-was-hidden"); // Limpiar marca
    });

    // Poner campo de cliente en modo solo lectura
    const clienteEl = document.getElementById("cliente");
    if (clienteEl) clienteEl.readOnly = true;

    // Quitar foco del campo cilindro
    document.getElementById("cilindro")?.blur();
}

/**
 * Muestra el panel de detalles del movimiento
 *
 * Oculta el placeholder y muestra el formulario con los detalles del movimiento
 * y la tabla de cilindros. También oculta los textos de ayuda del panel derecho.
 *
 * Acciones:
 * 1. Muestra el formulario de detalles del movimiento
 * 2. Muestra el contenedor de la tabla de cilindros
 * 3. Oculta el placeholder inicial
 * 4. Oculta los títulos y textos de ayuda del panel
 * 5. Sincroniza las alturas para evitar saltos visuales
 *
 * @example
 * import { showMovimientoDetalle } from './utils.js';
 * showMovimientoDetalle();
 */
export function showMovimientoDetalle() {
    // Mostrar el formulario de detalles
    document.getElementById("movimientoDetalle")?.classList.remove("hidden");

    // Mostrar el contenedor de cilindros
    document.getElementById("cilindrosContainer")?.classList.remove("hidden");

    // Ocultar el placeholder
    document.getElementById("movimientoPlaceholder")?.classList.add("hidden");

    // Ocultar títulos y textos de ayuda del panel derecho
    const rightPanel = document.querySelector(".lg\\:col-span-8 > .bg-white");
    rightPanel?.querySelector("h3")?.classList.add("hidden");
    rightPanel?.querySelector("p")?.classList.add("hidden");

    // Ajustar alturas para mantener consistencia visual
    syncDetailHeights();
}
