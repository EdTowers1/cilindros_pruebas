/**
 * Módulo de Modal de Creación de Movimiento
 *
 * Gestiona el modal para crear nuevos movimientos de cilindros:
 * - Apertura y cierre del modal
 * - Selección de cliente
 * - Agregar/Eliminar cilindros
 * - Validación y envío del formulario
 */

import { showToast } from "../../utils.js";

// Estado del modal de creación
let cilindrosData = [];
let clienteSeleccionado = null;

/**
 * Configurar el modal de creación de movimientos
 *
 * Inicializa todos los eventos del modal:
 * - Botón crear (abre modal)
 * - Botones cerrar/cancelar (cierra modal)
 * - Botón buscar cliente (abre modal de clientes)
 * - Botón agregar cilindro
 * - Submit del formulario
 *
 * @param {Tabulator} table - Instancia de la tabla de movimientos para refrescar después de crear
 *
 * @example
 * import { setupCreateModal } from './createModal.js';
 * setupCreateModal(table);
 */
export function setupCreateModal(table) {
    // Referencias a elementos del DOM
    const modal = document.getElementById("createMovimientoModal");
    const btnCreate = document.getElementById("movimientosCreate");
    const btnClose = document.getElementById("closeCreateModalBtn");
    const btnCancel = document.getElementById("cancelCreateModalBtn");
    const btnBuscarCliente = document.getElementById("createBuscarClienteBtn");
    const btnAddCilindro = document.getElementById("addCilindroBtn");
    const form = document.getElementById("createMovimientoForm");

    /**
     * Cargar consecutivo y fecha desde el servidor
     */
    const loadConsecutivo = async () => {
        try {
            const response = await fetch("/movimientos/consecutivo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener el consecutivo");
            }

            const result = await response.json();

            if (result.success) {
                // Establecer el consecutivo en el campo de orden
                const ordenInput = document.getElementById("createOrden");
                if (ordenInput) {
                    ordenInput.value = result.data.consecutivo;
                }

                // Establecer la fecha actual
                const fechaInput = document.getElementById("createFecha");
                if (fechaInput) {
                    fechaInput.value = result.data.fecha;
                }
            } else {
                showToast("Error al obtener el consecutivo", "error");
            }
        } catch (error) {
            console.error("Error al cargar consecutivo:", error);
            showToast("Error al cargar el número de orden", "error");
        }
    };

    /**
     * Abrir el modal de creación
     */
    const openModal = async () => {
        resetForm();
        modal?.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Prevenir scroll del body

        // Cargar el consecutivo al abrir el modal
        await loadConsecutivo();
    };

    /**
     * Cerrar el modal de creación
     */
    const closeModal = () => {
        modal?.classList.add("hidden");
        document.body.style.overflow = "auto"; // Restaurar scroll del body
        resetForm();
    };

    /**
     * Resetear el formulario a su estado inicial
     */
    const resetForm = () => {
        form?.reset();
        cilindrosData = [];
        clienteSeleccionado = null;
        renderCilindrosTable();
        document.getElementById("createInfoCliente").value = "";
        document.getElementById("createCliente").value = "";
        document.getElementById("createOrden").value = "";
        document.getElementById("createFecha").value = "";
    };

    /**
     * Renderizar la tabla de cilindros
     */
    const renderCilindrosTable = () => {
        const tbody = document.getElementById("cilindrosTableBody");
        const noRowsMsg = document.getElementById("noCilindrosRow");

        if (cilindrosData.length === 0) {
            noRowsMsg?.classList.remove("hidden");
            return;
        }

        noRowsMsg?.classList.add("hidden");

        const rows = cilindrosData
            .map(
                (cilindro, index) => `
            <tr class="hover:bg-gray-50">
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${cilindro.codigo_articulo}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${cilindro.detalle}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${cilindro.cantidad}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    $${parseFloat(cilindro.precio_docto).toFixed(2)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    $${parseFloat(cilindro.costo_promedio).toFixed(2)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    ${cilindro.bodega}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
                    <button type="button" onclick="window.removeCilindro(${index})"
                        class="text-red-600 hover:text-red-900">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
            )
            .join("");

        tbody.innerHTML = rows;
    };

    /**
     * Eliminar un cilindro de la lista
     */
    window.removeCilindro = (index) => {
        cilindrosData.splice(index, 1);
        renderCilindrosTable();
    };

    /**
     * Agregar un cilindro a la lista
     */
    const addCilindro = () => {
        // Por ahora, agregar un cilindro de ejemplo
        // TODO: Implementar modal de selección de cilindros
        const cilindro = {
            codigo_articulo: prompt("Código del artículo:") || "1017",
            detalle: prompt("Detalle:") || "CILINDRO",
            cantidad: parseFloat(prompt("Cantidad:") || "1"),
            precio_docto: parseFloat(prompt("Precio:") || "1800"),
            costo_promedio: parseFloat(prompt("Costo promedio:") || "1200"),
            bodega: prompt("Bodega:") || "1",
        };

        cilindrosData.push(cilindro);
        renderCilindrosTable();
    };

    /**
     * Manejar la selección de cliente desde el modal de clientes
     */
    window.handleCreateClienteSelection = (cliente) => {
        clienteSeleccionado = cliente;
        document.getElementById("createCliente").value = cliente.codcli;
        document.getElementById("createInfoCliente").value =
            `NIT: ${cliente.nit}\n` +
            `Nombre: ${cliente.nombre}\n` +
            `Dirección: ${cliente.direccion || "N/A"}`;
    };

    /**
     * Validar el formulario antes de enviar
     */
    const validateForm = () => {
        if (!clienteSeleccionado) {
            showToast("error", "Debe seleccionar un cliente");
            return false;
        }

        if (cilindrosData.length === 0) {
            showToast("error", "Debe agregar al menos un cilindro");
            return false;
        }

        const fecha = document.getElementById("createFecha").value;
        if (!fecha) {
            showToast("error", "Debe ingresar una fecha");
            return false;
        }

        return true;
    };

    /**
     * Enviar el formulario para crear el movimiento
     */
    const submitForm = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const saveBtn = document.getElementById("saveMovimientoBtn");
        saveBtn.disabled = true;
        saveBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Guardando...';

        try {
            const formData = {
                fecha: document.getElementById("createFecha").value,
                codcli: clienteSeleccionado.codcli,
                observaciones: document.getElementById("createObservaciones")
                    .value,
                cilindros: cilindrosData,
            };

            const response = await fetch("/movimientos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    )?.content,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showToast(
                    "success",
                    result.message || "Movimiento creado exitosamente"
                );
                closeModal();
                table.replaceData(); // Refrescar la tabla
            } else {
                throw new Error(
                    result.message || "Error al crear el movimiento"
                );
            }
        } catch (error) {
            console.error("Error al crear movimiento:", error);
            showToast("error", error.message || "Error al crear el movimiento");
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML =
                '<i class="fa-solid fa-save mr-2"></i>Guardar Movimiento';
        }
    };

    // Event Listeners
    btnCreate?.addEventListener("click", openModal);
    btnClose?.addEventListener("click", closeModal);
    btnCancel?.addEventListener("click", closeModal);
    btnAddCilindro?.addEventListener("click", addCilindro);
    form?.addEventListener("submit", submitForm);

    // Buscar cliente (reutilizar modal existente)
    btnBuscarCliente?.addEventListener("click", () => {
        // Abrir el modal de clientes existente
        document.getElementById("clientesModal")?.classList.remove("hidden");

        // Guardar el contexto de creación para que el modal sepa de dónde viene
        window.createModalContext = true;
    });

    // Cerrar modal con ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
            closeModal();
        }
    });
}
