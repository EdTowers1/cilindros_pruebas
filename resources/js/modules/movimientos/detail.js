/**
 * Módulo de Detalles
 *
 * Gestiona la visualización de detalles cuando se hace clic en una fila.
 * Carga y muestra información del movimiento y sus cilindros asociados.
 */

import { renderCilindrosTabulator } from "./cilindrosTable.js";
import { setSelectedRowData } from "./state.js";
import { showMovimientoDetalle, exitEditMode } from "./utils.js";

/**
 * Configura el evento de clic en las filas de la tabla
 *
 * Cuando se hace clic en una fila:
 * 1. Sale del modo edición si estaba activo
 * 2. Actualiza la selección
 * 3. Carga los datos del movimiento en el formulario
 * 4. Obtiene y muestra los cilindros asociados
 * 5. Actualiza el estado del toolbar
 *
 * @param {Tabulator} table - Instancia de la tabla de movimientos
 * @param {Function} updateToolbarStateFn - Función para actualizar estado del toolbar
 *
 * @example
 * import { setupRowClick } from './detail.js';
 * setupRowClick(table, updateToolbarState);
 */
export function setupRowClick(table, updateToolbarStateFn) {
    /**
     * Event handler para el clic en una fila
     *
     * @param {Event} e - Evento de clic
     * @param {Object} row - Objeto fila de Tabulator
     */
    table.on("rowClick", (e, row) => {
        // 1. Salir del modo edición si estaba activo
        // Esto oculta campos de edición y restaura el estado de solo lectura
        exitEditMode();

        // 2. Deseleccionar todas las filas y seleccionar solo la actual
        table.deselectRow();
        row.select();

        // Obtener los datos de la fila
        const data = row.getData();
        const docto = data.docto; // Número de documento del movimiento
        if (!docto) return; // Salir si no hay documento

        // 3. Guardar los datos en el estado compartido
        setSelectedRowData(data);

        // 4. Actualizar el estado del toolbar (habilitar/deshabilitar botones)
        if (updateToolbarStateFn) {
            updateToolbarStateFn();
        }

        // 5. Cargar fecha del movimiento
        // Extrae solo la parte de fecha (YYYY-MM-DD) usando regex
        const fechaEl = document.getElementById("fecha");
        if (fechaEl) {
            const fecha = (data.fecha || "").toString().match(/^(\d{4}-\d{2}-\d{2})/);
            fechaEl.value = fecha ? fecha[1] : "";
        }

        // 6. Cargar número de orden (documento)
        const ordenEl = document.getElementById("orden");
        if (ordenEl) ordenEl.value = data.docto || "";

        // 7. Cargar información del cliente con normalización de datos
        // Busca los datos del cliente en múltiples ubicaciones posibles
        // ya que la estructura puede variar según la respuesta del servidor
        const infoClienteEl = document.getElementById("infoCliente");
        if (infoClienteEl) {
            // Buscar código de cliente en diferentes ubicaciones
            const codcli = data.codcli || (data.tercero && data.tercero.codcli) || data.nit_tercero || '';

            // Buscar nombre de cliente en diferentes ubicaciones
            const nombreCliente = data.nombre_tercero || (data.tercero && (data.tercero.Nombre_tercero || data.tercero.nombre_tercero)) || data.nomcomer || '';

            // Construir string de información formateada
            let infoCliente = '';
            if (codcli) infoCliente += 'Código: ' + codcli;
            if (nombreCliente) {
                if (infoCliente) infoCliente += '\n'; // Agregar salto de línea si ya hay código
                infoCliente += 'Cliente: ' + nombreCliente;
            }
            infoClienteEl.value = infoCliente.trim();
        }

        // 8. Cargar cilindros asociados al movimiento desde el backend
        // Hace una petición GET a /movimientos/{docto} para obtener el detalle completo
        fetch(`/movimientos/${docto}`)
            .then((r) => r.json())
            .then((json) => {
                // La respuesta puede venir como array o como objeto
                // Extraer el array de bodies (cilindros) de forma segura
                const bodies = Array.isArray(json) ? json[0]?.bodies || [] : json?.bodies || [];

                // Renderizar la tabla de cilindros
                renderCilindrosTabulator(bodies);
            })
            .catch(() => {
                // En caso de error, mostrar mensaje en lugar de la tabla
                const cilTable = document.getElementById("cilindros-table");
                if (cilTable)
                    cilTable.innerHTML =
                        '<div class="text-center text-red-500 py-4">Error al cargar cilindros</div>';
            });

        // 9. Mostrar el panel de detalles (ocultar placeholder, mostrar formulario)
        showMovimientoDetalle();
    });
}
