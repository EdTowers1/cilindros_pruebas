/**
 * Módulo Movimientos - Index (Orquestador Principal)
 *
 * Este archivo actúa como punto de entrada y coordinador de todos los módulos
 * relacionados con la gestión de movimientos. Inicializa y conecta todos los
 * componentes necesarios para el funcionamiento del sistema.
 */

import { createMovimientosTable } from "./movimientosTable.js";
import { setupSearch } from "./search.js";
import { setupToolbar } from "./toolbar.js";
import { setupRowClick } from "./detail.js";
import { setupClientesModal } from "./clientesModal.js";
import { setupCreateModal } from "./createModal.js";
import { syncDetailHeights } from "./utils.js";

/**
 * Inicializa el módulo completo de movimientos
 *
 * Esta función orquesta la inicialización de todos los submódulos:
 * 1. Crea la tabla principal de movimientos con Tabulator
 * 2. Configura el sistema de búsqueda con debounce
 * 3. Inicializa los botones del toolbar (crear, editar, eliminar, refrescar)
 * 4. Configura los eventos de clic en las filas para mostrar detalles
 * 5. Inicializa el modal de búsqueda de clientes
 * 6. Ajusta las alturas del panel de detalles
 * 7. Configura listener para ajustar alturas al redimensionar ventana
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * // Llamar desde tabs-system.js cuando se carga el tab de movimientos
 * import { initMovimientos } from './modules/movimientos/index.js';
 * await initMovimientos();
 */
export async function initMovimientos() {
    // 1. Crear e inicializar la tabla principal de movimientos
    const table = createMovimientosTable();

    // 2. Configurar sistema de búsqueda (input + botón clear)
    setupSearch(table);

    // 3. Configurar toolbar y obtener función para actualizar estado de botones
    const { updateToolbarState } = setupToolbar(table);

    // 4. Configurar evento de clic en filas y pasar función de actualización del toolbar
    setupRowClick(table, updateToolbarState);

    // 5. Configurar modal de búsqueda y selección de clientes
    setupClientesModal();

    // 6. Configurar modal de creación de movimientos
    setupCreateModal(table);

    // 7. Sincronizar alturas iniciales del panel de detalles
    syncDetailHeights();

    // 8. Configurar listener para ajustar alturas al redimensionar la ventana
    // Usa debounce con timer para evitar múltiples ejecuciones durante el resize
    let resizeTimer = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            syncDetailHeights();
        }, 120); // Espera 120ms después del último evento resize
    });
}
