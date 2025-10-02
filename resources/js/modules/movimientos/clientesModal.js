/**
 * Módulo de Modal de Clientes
 *
 * Gestiona el modal de búsqueda y selección de clientes.
 * Muestra una tabla con todos los clientes disponibles y permite
 * seleccionar uno para autocompletar los campos del formulario.
 */

import { TabulatorFull as Tabulator } from "tabulator-tables";

/**
 * Instancia actual de la tabla de clientes
 * Se mantiene para poder destruirla antes de crear una nueva
 * @type {Tabulator|null}
 */
let clientesTabulator = null;

/**
 * Configura el modal de búsqueda de clientes
 *
 * Inicializa los event listeners para:
 * - Abrir modal y cargar lista de clientes
 * - Seleccionar un cliente de la lista
 * - Cerrar el modal
 *
 * @example
 * import { setupClientesModal } from './clientesModal.js';
 * setupClientesModal();
 */
export function setupClientesModal() {
    // Obtener referencias a los elementos del modal
    const buscarClienteBtn = document.getElementById("buscarClienteBtn");
    const clienteModal = document.getElementById("clienteModal");
    const cerrarClienteModal = document.getElementById("cerrarClienteModal");

    // Verificar que todos los elementos existan
    if (!buscarClienteBtn || !clienteModal || !cerrarClienteModal) {
        return; // Salir si falta algún elemento
    }

    /**
     * Event handler para abrir el modal de clientes
     *
     * Acciones:
     * 1. Muestra el modal
     * 2. Carga la lista de clientes desde el servidor
     * 3. Crea una tabla Tabulator con los clientes
     * 4. Configura la selección por clic
     */
    buscarClienteBtn.addEventListener("click", async () => {
        // Mostrar el modal
        clienteModal.classList.remove("hidden");

        try {
            // Cargar lista de clientes desde el servidor
            const response = await fetch("/terceros");
            const data = await response.json();
            // La respuesta puede venir en data.data o directamente en data
            const clientes = data.data || data;

            // Destruir tabla anterior si existe para evitar duplicados
            if (clientesTabulator) {
                try {
                    clientesTabulator.destroy();
                } catch (e) {
                    console.error("Error al destruir tabla anterior:", e);
                }
                clientesTabulator = null;
            }

            // Crear nueva tabla de clientes con Tabulator
            clientesTabulator = new Tabulator("#clientesTable", {
                data: clientes, // Datos de clientes cargados
                layout: "fitColumns", // Ajustar columnas al ancho disponible
                resizableColumns: false,
                movableColumns: false,
                pagination: false, // Mostrar todos los clientes sin paginación
                height: 300, // Altura fija del modal
                selectable: 1, // Permitir seleccionar una fila a la vez
                columns: [
                    {
                        title: "Código",
                        field: "codcli", // Código del cliente
                        headerSort: false,
                        hozAlign: "left",
                        widthGrow: 1, // Columna más estrecha
                    },
                    {
                        title: "Nombre",
                        field: "Nombre_tercero", // Nombre del cliente
                        headerSort: false,
                        hozAlign: "left",
                        widthGrow: 3, // Columna más ancha (3x)
                    },
                ],
                placeholder: "No hay clientes para mostrar",
            });

            /**
             * Event handler para clic en una fila de la tabla
             *
             * Al hacer clic en un cliente:
             * 1. Obtiene los datos del cliente
             * 2. Llena el campo de código de cliente
             * 3. Llena el campo de información del cliente
             * 4. Cierra el modal
             */
            clientesTabulator.on("rowClick", function (e, row) {
                const rowData = row.getData();

                // Verificar si estamos en contexto de creación
                if (window.createModalContext) {
                    // Llamar al handler del modal de creación
                    if (
                        typeof window.handleCreateClienteSelection ===
                        "function"
                    ) {
                        window.handleCreateClienteSelection({
                            codcli: rowData.codcli,
                            nit: rowData.codcli,
                            nombre: rowData.Nombre_tercero,
                            direccion: rowData.direccion || "",
                        });
                    }
                    window.createModalContext = false; // Reset flag
                } else {
                    // Contexto de edición (comportamiento original)
                    const clienteEl = document.getElementById("cliente");
                    const infoClienteEl =
                        document.getElementById("infoCliente");

                    // Llenar campo de código de cliente
                    if (clienteEl) {
                        clienteEl.value = rowData.codcli || "";
                    }

                    // Llenar campo de información del cliente (formato multilínea)
                    if (infoClienteEl) {
                        let info = "";
                        if (rowData.codcli) info += "Código: " + rowData.codcli;
                        if (rowData.Nombre_tercero) {
                            if (info) info += "\n"; // Salto de línea si ya hay código
                            info += "Cliente: " + rowData.Nombre_tercero;
                        }
                        infoClienteEl.value = info;
                    }
                }

                // Cerrar el modal automáticamente después de seleccionar
                clienteModal.classList.add("hidden");
            });
        } catch (error) {
            // Manejar errores en la carga de clientes
            console.error("Error cargando clientes:", error);
            alert(
                "Error al cargar la lista de clientes. Por favor, intente nuevamente."
            );
        }
    });

    /**
     * Event handler para el botón de cerrar modal
     * Oculta el modal sin seleccionar ningún cliente
     */
    cerrarClienteModal.addEventListener("click", () => {
        clienteModal.classList.add("hidden");
    });

    /**
     * Event handler para cerrar modal al hacer clic fuera de él
     *
     * Mejora la UX permitiendo cerrar el modal haciendo clic en el overlay oscuro.
     * Solo cierra si el clic es directamente en el modal (overlay),
     * no en su contenido interno.
     */
    clienteModal.addEventListener("click", (e) => {
        if (e.target === clienteModal) {
            clienteModal.classList.add("hidden");
        }
    });
}
