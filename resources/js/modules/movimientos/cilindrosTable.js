/**
 * Módulo de Tabla de Cilindros
 * 
 * Gestiona la tabla de cilindros asociados a un movimiento.
 * Muestra los detalles de cada cilindro (código, cantidad, precio).
 */

import { TabulatorFull as Tabulator } from "tabulator-tables";

/**
 * Instancia actual de la tabla de cilindros
 * Se mantiene para poder destruirla antes de crear una nueva
 * @type {Tabulator|null}
 */
let cilindrosTabulator = null;

/**
 * Renderiza la tabla de cilindros para un movimiento
 * 
 * Destruye la tabla anterior si existe y crea una nueva con los datos proporcionados.
 * Si no hay cilindros, muestra un mensaje informativo.
 * La altura de la tabla es responsiva según el ancho de pantalla.
 * 
 * @param {Array<Object>} bodies - Array de cilindros (bodies del movimiento)
 * @param {string} bodies[].codigo_articulo - Código del cilindro
 * @param {number} bodies[].cantidad - Cantidad de cilindros
 * @param {number} bodies[].precio_docto - Precio del cilindro
 * 
 * @example
 * import { renderCilindrosTabulator } from './cilindrosTable.js';
 * 
 * const cilindros = [
 *   { codigo_articulo: 'CIL001', cantidad: 5, precio_docto: 1500 },
 *   { codigo_articulo: 'CIL002', cantidad: 3, precio_docto: 2000 }
 * ];
 * renderCilindrosTabulator(cilindros);
 */
export function renderCilindrosTabulator(bodies) {
    // Obtener el elemento contenedor de la tabla
    const cilTable = document.getElementById("cilindros-table");
    if (!cilTable) return; // Salir si no existe el elemento

    // Destruir la instancia anterior de Tabulator si existe
    // Esto previene memory leaks y conflictos
    if (cilindrosTabulator) {
        try {
            cilindrosTabulator.destroy();
        } catch {}
        cilindrosTabulator = null;
    }

    // Si no hay cilindros, mostrar mensaje informativo
    if (!bodies || !bodies.length) {
        cilTable.innerHTML =
            '<div class="text-center text-gray-400 py-4">No hay cilindros para este movimiento</div>';
        return;
    }

    // Limpiar contenido anterior
    cilTable.innerHTML = "";
    
    // Calcular altura responsiva: 184px en pantallas medianas+, 150px en móviles
    const height = window.matchMedia("(min-width: 768px)").matches ? 184 : 150;

    // Crear nueva instancia de Tabulator con la configuración de cilindros
    cilindrosTabulator = new Tabulator(cilTable, {
        data: bodies, // Datos de cilindros pasados como parámetro
        layout: "fitColumns", // Ajustar columnas al ancho disponible
        resizableColumns: false, // No permitir redimensionar columnas
        movableColumns: false, // No permitir mover columnas
        pagination: false, // Sin paginación (mostrar todos los cilindros)
        height, // Altura calculada según el tamaño de pantalla
        columns: [
            // Columna de código de artículo (cilindro)
            { 
                title: "Código", 
                field: "codigo_articulo", 
                headerSort: false, // No permitir ordenar
                hozAlign: "left", // Alinear a la izquierda
                widthGrow: 2 // Ocupa el doble de espacio que las otras columnas
            },
            // Columna de cantidad
            { 
                title: "Cantidad", 
                field: "cantidad", 
                headerSort: false, 
                hozAlign: "right", // Alinear a la derecha (mejor para números)
                widthGrow: 1 
            },
            // Columna de precio
            { 
                title: "Precio", 
                field: "precio_docto", 
                headerSort: false, 
                hozAlign: "right", 
                widthGrow: 1 
            },
        ],
        placeholder: "No hay cilindros para este movimiento",
    });
}
