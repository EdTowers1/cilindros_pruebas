/**
 * Módulo de Estado - State Management
 *
 * Gestiona el estado compartido entre todos los módulos de movimientos.
 * Utiliza el patrón de closure para encapsular el estado privado y
 * proporcionar getters/setters públicos para acceso controlado.
 */

/**
 * Estado privado: datos de la fila actualmente seleccionada
 * No debe ser accedido directamente desde otros módulos
 * @private
 * @type {Object|null}
 */
let _selectedRowData = null;

/**
 * Obtiene los datos de la fila actualmente seleccionada
 *
 * @returns {Object|null} Objeto con los datos de la fila seleccionada o null si no hay selección
 *
 * @example
 * import { selectedRowData } from './state.js';
 *
 * const rowData = selectedRowData();
 * if (rowData) {
 *   console.log('Movimiento seleccionado:', rowData.docto);
 * }
 */
export const selectedRowData = () => _selectedRowData;

/**
 * Establece los datos de la fila seleccionada
 *
 * @param {Object|null} data - Datos de la fila a establecer como seleccionada, o null para limpiar
 * @returns {Object|null} Los datos establecidos
 *
 * @example
 * import { setSelectedRowData } from './state.js';
 *
 * // Establecer una selección
 * setSelectedRowData({ docto: '12345', fecha: '2025-01-01', ... });
 *
 * // Limpiar la selección
 * setSelectedRowData(null);
 */
export const setSelectedRowData = (data) => (_selectedRowData = data);
