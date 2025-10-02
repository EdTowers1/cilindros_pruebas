/**
 * Módulo de Toolbar
 *
 * Gestiona los botones de acción del toolbar de movimientos:
 * - Crear nuevo movimiento
 * - Editar movimiento seleccionado
 * - Eliminar movimiento seleccionado
 * - Refrescar lista de movimientos
 */

import { enterEditMode, showMovimientoDetalle } from "./utils.js";
import { selectedRowData } from "./state.js";

/**
 * Configura el toolbar de movimientos
 *
 * Inicializa los botones de acción y gestiona su estado (habilitado/deshabilitado)
 * según si hay una fila seleccionada.
 *
 * @param {Tabulator} table - Instancia de la tabla de movimientos
 * @returns {Object} Objeto con la función updateToolbarState para uso externo
 * @returns {Function} returns.updateToolbarState - Función para actualizar estado de botones
 *
 * @example
 * import { setupToolbar } from './toolbar.js';
 * const { updateToolbarState } = setupToolbar(table);
 * // Luego puedes llamar updateToolbarState() desde otros módulos
 */
export function setupToolbar(table) {
    // Obtener referencias a los botones del toolbar
    const btnCreate = document.getElementById("movimientosCreate");
    const btnEdit = document.getElementById("movimientosEdit");
    const btnDelete = document.getElementById("movimientosDelete");
    const btnRefresh = document.getElementById("movimientosRefresh");

    /**
     * Actualiza el estado (habilitado/deshabilitado) de los botones del toolbar
     *
     * Los botones de editar y eliminar solo se habilitan si hay una fila seleccionada.
     * El botón de crear siempre está habilitado.
     */
    const updateToolbarState = () => {
        const has = !!selectedRowData(); // Verificar si hay selección
        if (btnEdit) btnEdit.disabled = !has;
        if (btnDelete) btnDelete.disabled = !has;
    };

    // Exportar función para uso externo (desde detail.js)
    setupToolbar.updateToolbarState = updateToolbarState;

    /**
     * Botón Crear: Abre modal/formulario para crear un nuevo movimiento
     * Siempre está habilitado
     *
     * Nota: El modal se maneja en createModal.js, aquí no se necesita código
     * ya que el botón tiene el ID correcto para ser capturado por ese módulo
     */
    // btnCreate manejado por createModal.js

    /**
     * Botón Editar: Activa el modo de edición para el movimiento seleccionado
     *
     * Acciones:
     * 1. Valida que haya un movimiento seleccionado
     * 2. Entra en modo edición (muestra solo campo de cilindro)
     * 3. Muestra el panel de detalles
     *
     * Nota: El campo de cliente NO se muestra ni se edita en modo edición
     */
    btnEdit?.addEventListener("click", () => {
        if (!selectedRowData()) return alert("Seleccione un movimiento");

        // Activar modo de edición (solo muestra campo de cilindro)
        enterEditMode();

        // Asegurar que el panel de detalles esté visible
        try {
            showMovimientoDetalle();
        } catch {}
    });

    /**
     * Botón Eliminar: Elimina el movimiento seleccionado
     *
     * Acciones:
     * 1. Valida que haya un movimiento seleccionado
     * 2. Pide confirmación al usuario
     * 3. Envía petición DELETE al backend (por implementar)
     */
    btnDelete?.addEventListener("click", () => {
        if (!selectedRowData()) return alert("Seleccione un movimiento");
        if (!confirm(`¿Eliminar movimiento ${selectedRowData().docto}?`))
            return;
        // TODO: Implementar petición DELETE al backend
        alert(`Eliminar ${selectedRowData().docto} (implementar)`);
    });

    /**
     * Botón Refrescar: Recarga los datos de la tabla desde el servidor
     * Mantiene los parámetros de búsqueda y paginación actuales
     */
    btnRefresh?.addEventListener("click", () => {
        table.setData("/movimientos");
    });

    // Inicializar el estado del toolbar (deshabilitar editar/eliminar si no hay selección)
    updateToolbarState();

    // Retornar objeto con la función de actualización para uso externo
    return { updateToolbarState };
}
