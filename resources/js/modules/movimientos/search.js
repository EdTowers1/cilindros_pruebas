/**
 * Módulo de Búsqueda
 *
 * Gestiona la funcionalidad de búsqueda de movimientos.
 * Implementa debounce para evitar peticiones excesivas al servidor.
 */

import { debounce } from "../../utils.js";
import { setSelectedRowData } from "./state.js";

/**
 * Configura el sistema de búsqueda de movimientos
 *
 * Características:
 * - Búsqueda con debounce de 350ms para evitar sobrecarga del servidor
 * - Botón de limpiar búsqueda
 * - Limpia la selección actual al realizar nueva búsqueda
 * - Resetea a la primera página en cada búsqueda
 *
 * @param {Tabulator} table - Instancia de la tabla de movimientos
 *
 * @example
 * import { setupSearch } from './search.js';
 * setupSearch(table);
 */
export function setupSearch(table) {
    // Obtener elementos del DOM
    const searchInput = document.getElementById("movimientosSearch");
    const clearBtn = document.getElementById("movimientosClear");

    /**
     * Aplica el término de búsqueda a la tabla
     *
     * Realiza una nueva petición al servidor con el término de búsqueda,
     * resetea la paginación y limpia la selección actual.
     *
     * @param {string} term - Término de búsqueda
     */
    const applySearch = (term) => {
        // Limpiar espacios en blanco del término
        term = String(term).trim();

        // Recargar datos de la tabla con el nuevo término de búsqueda
        table.setData("/movimientos", {
            per_page: 10,
            page: 1, // Siempre volver a la primera página
            search: term,
        });

        // Limpiar selección al realizar búsqueda
        // Esto asegura que el toolbar se actualice correctamente
        setSelectedRowData(null);
    };

    // Configurar listener para el input de búsqueda
    if (searchInput) {
        searchInput.addEventListener(
            "input",
            // Usar debounce para esperar 350ms después de que el usuario deje de escribir
            // Esto reduce el número de peticiones al servidor
            debounce((e) => applySearch(e.target.value), 350)
        );
    }

    // Configurar listener para el botón de limpiar
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            // Limpiar el valor del input
            if (searchInput) searchInput.value = "";

            // Aplicar búsqueda vacía para mostrar todos los registros
            applySearch("");
        });
    }
}
