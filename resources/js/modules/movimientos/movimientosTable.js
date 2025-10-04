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
        height: movimientosTableHeight, // Aumentado para dar espacio a la paginación
        ajaxURL: "/movimientos",
        ajaxConfig: "GET",
        ajaxParams: {
            per_page: defaultPerPage,
            search: "",
        },
        pagination: true, // Cambiado a true para asegurar que se active la paginación
        paginationMode: "remote", // Modo remoto explícito
        paginationSize: defaultPerPage,
        // paginationSizeSelector: [10, 15, 20, 50], // Selector de tamaño de página
        paginationButtonCount: 3, // Cantidad de botones de página visibles
        // paginationCounter: "rows", // Muestra "x-y de z registros"
        paginationDataSent: {
            page: "page",
            size: "per_page", // Asegúrate que esto coincida con lo que espera tu backend
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
         * @returns {Object} Objeto con datos formateados para Tabulator
         */
        ajaxResponse: function (url, params, response) {
            // Verificar que la respuesta sea un objeto y contenga data
            if (!response || typeof response !== 'object') {
                console.error("Respuesta de servidor inválida:", response);
                return { data: [] }; // Devolver array vacío como fallback
            }

            // Verificar que data exista y sea un array
            const rows = Array.isArray(response.data) ? response.data : [];

            // Procesar los datos si existen
            const processedRows = rows.map((r) => {
                // Normalizar nombre_tercero
                r.nombre_tercero = r.nombre_tercero ||
                    (r.tercero && (r.tercero.Nombre_tercero || r.tercero.nombre_tercero)) ||
                    r.nomcomer || '';

                // Normalizar codcli
                r.codcli = r.codcli ||
                    (r.tercero && r.tercero.codcli) ||
                    r.nit_tercero || '';

                return r;
            });

            // Devolver el objeto completo con los datos procesados
            return {
                data: processedRows,
                last_page: response.last_page || 1,
                total: response.total || rows.length,
                current_page: response.current_page || 1
            };
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
        ajaxRequesting: function (url, params) {
            console.log("Solicitando datos:", url, params);
            return true;
        },
        ajaxError: function (xhr, textStatus, errorThrown) {
            console.error("Error en solicitud AJAX:", textStatus, errorThrown);
            return false; // Prevenir que Tabulator muestre su error nativo
        },
    });
}
