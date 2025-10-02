/**
 * Módulo de Tabla de Movimientos
 *
 * Configura y crea la tabla principal de movimientos usando Tabulator.
 * Gestiona la paginación remota, formato de datos y columnas.
 */

import { TabulatorFull as Tabulator } from "tabulator-tables";

/**
 * Número de registros por página por defecto
 * @constant {number}
 */
const defaultPerPage = 10;

/**
 * Altura fija de la tabla de movimientos en píxeles
 * @constant {number}
 */
const movimientosTableHeight = 358;

/**
 * Crea y configura la tabla principal de movimientos
 *
 * Características:
 * - Paginación remota desde el servidor
 * - Columnas: Código, Cliente, Fecha
 * - Normalización automática de datos de terceros
 * - Formato de fechas (solo YYYY-MM-DD)
 * - Selección de una fila a la vez
 * - Manejo de errores AJAX
 *
 * @returns {Tabulator} Instancia de Tabulator configurada
 *
 * @example
 * import { createMovimientosTable } from './movimientosTable.js';
 * const table = createMovimientosTable();
 * // La tabla se renderiza automáticamente en #movimientos-table
 */
export function createMovimientosTable() {
    return new Tabulator("#movimientos-table", {
        layout: "fitColumns",
        resizableColumns: false,
        movableColumns: false,
        selectable: 1,
        height: movimientosTableHeight,
        ajaxURL: "/movimientos",
        ajaxConfig: "GET",
        ajaxParams: {
            per_page: defaultPerPage,
            search: "",
        },
        pagination: "remote",
        paginationSize: defaultPerPage,
        paginationDataSent: {
            page: "page",
            per_page: "per_page",
        },
        paginationDataReceived: {
            data: "data",
            last_page: "last_page",
            total: "total",
            current_page: "current_page",
        },
        /**
         * Procesa la respuesta del servidor antes de mostrarla en la tabla
         *
         * Normaliza los datos de terceros para asegurar que siempre existan
         * las propiedades nombre_tercero y codcli, sin importar la estructura
         * de la respuesta del servidor.
         *
         * @param {string} url - URL de la petición AJAX
         * @param {Object} params - Parámetros enviados en la petición
         * @param {Object} response - Respuesta del servidor
         * @param {Array} response.data - Array de movimientos
         * @returns {Array} Array de movimientos con datos normalizados
         */
        ajaxResponse: function (url, params, response) {
            const rows = response.data || [];
            return rows.map((r) => {
                // Normalizar nombre_tercero buscando en múltiples ubicaciones posibles
                // Prioridad: r.nombre_tercero > r.tercero.Nombre_tercero > r.tercero.nombre_tercero > r.nomcomer
                r.nombre_tercero = r.nombre_tercero || (r.tercero && (r.tercero.Nombre_tercero || r.tercero.nombre_tercero)) || r.nomcomer || '';

                // Normalizar codcli buscando en múltiples ubicaciones posibles
                // Prioridad: r.codcli > r.tercero.codcli > r.nit_tercero
                r.codcli = r.codcli || (r.tercero && r.tercero.codcli) || r.nit_tercero || '';

                return r;
            });
        },
        placeholder: "No hay movimientos para mostrar",
        columns: [
            {
                title: "Código",
                field: "docto",
                width: 70,
                hozAlign: "left",
                resizable: false,
                headerSort: false,
            },
            {
                title: "Cliente",
                field: "nombre_tercero",
                width: 300,
                resizable: false,
                headerSort: false,
            },
            {
                title: "Fecha",
                field: "fecha",
                widthGrow: 2,
                minWidth: 90,
                resizable: false,
                headerSort: false,
                /**
                 * Formatea la fecha para mostrar solo YYYY-MM-DD
                 *
                 * Convierte diferentes formatos de fecha (Date, string, timestamp)
                 * a formato ISO y extrae solo la parte de la fecha.
                 *
                 * @param {Object} cell - Objeto celda de Tabulator
                 * @returns {string} Fecha en formato YYYY-MM-DD o string vacío
                 */
                formatter: function (cell) {
                    const v = cell.getValue();
                    if (!v) return "";
                    try {
                        // Convertir a string ISO si es Date, o usar el valor como string
                        const s = v instanceof Date ? v.toISOString() : String(v);

                        // Extraer solo la parte de fecha (YYYY-MM-DD) usando regex
                        const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
                        return m ? m[1] : "";
                    } catch (e) {
                        return "";
                    }
                },
            },
        ],
        ajaxRequesting: function () {
            return true;
        },
        ajaxError: function (xhr, textStatus, errorThrown) {
            console.error("Error al cargar datos:", textStatus, errorThrown);
        },
    });
}
