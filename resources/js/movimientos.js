// Movimientos module adapted for Vite (ESM)
// - Uses Tabulator from npm package
// - Exported initializer to be called when the tab content is inserted

import { TabulatorFull as Tabulator } from "tabulator-tables";
import { debounce } from "./utils.js";

export async function initMovimientos() {
    const defaultPerPage = 10;
    const movimientosTableHeight = 358;

    function syncDetailHeights() {
        const placeholder = document.getElementById("movimientoPlaceholder");
        if (placeholder) placeholder.style.minHeight = 365 + "px";
    }

    const tableEl = document.getElementById("movimientos-table");
    if (!tableEl) return; // nothing to init

    const table = new Tabulator("#movimientos-table", {
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
        ajaxResponse: function (url, params, response) {
            return response.data || [];
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
                field: "tercero.Nombre_tercero",
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
                formatter: function (cell) {
                    const v = cell.getValue();
                    if (!v) return "";
                    try {
                        const s =
                            v instanceof Date ? v.toISOString() : String(v);
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

    // helper to change page size
    table.setPageSize = function (size) {
        this.setData("/movimientos", {
            per_page: size,
            page: 1,
        });
    };

    // debounce helper (imported)

    function updateToolbarState() {
        const hasSelection = !!selectedRowData;
        if (btnEdit) btnEdit.disabled = !hasSelection;
        if (btnDelete) btnDelete.disabled = !hasSelection;
    }

    function applySearchTerm(term) {
        term = term ? String(term).trim() : "";
        table.setData("/movimientos", {
            per_page: defaultPerPage,
            page: 1,
            search: term,
        });
        // clear selection state when reloading
        selectedRowData = null;
        updateToolbarState();
    }

    const searchInput = document.getElementById("movimientosSearch");
    const clearBtn = document.getElementById("movimientosClear");
    if (searchInput) {
        searchInput.addEventListener(
            "input",
            debounce(function (ev) {
                applySearchTerm(ev.target.value);
            }, 350)
        );
    }
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            applySearchTerm("");
        });
    }

    // Toolbar buttons
    const btnCreate = document.getElementById("movimientosCreate");
    const btnEdit = document.getElementById("movimientosEdit");
    const btnDelete = document.getElementById("movimientosDelete");
    const btnRefresh = document.getElementById("movimientosRefresh");

    let selectedRowData = null;
    let editMode = false;

    function enterEditMode() {
        editMode = true;
        // mark and show cliente wrapper
        const clienteEl = document.getElementById("cliente");
        if (clienteEl) {
            const hiddenWrapper = clienteEl.closest(".hidden");
            if (hiddenWrapper) {
                hiddenWrapper.dataset.wasHidden = "true";
                hiddenWrapper.classList.remove("hidden");
            }
            clienteEl.readOnly = false;
        }
        // mark and show cilindro wrapper
        const cilEl = document.getElementById("cilindro");
        if (cilEl) {
            const hiddenWrapper = cilEl.closest(".hidden");
            if (hiddenWrapper) {
                hiddenWrapper.dataset.wasHidden = "true";
                hiddenWrapper.classList.remove("hidden");
            }
            try {
                cilEl.focus();
            } catch (e) {}
        }
    }

    function exitEditMode() {
        editMode = false;
        // hide any wrappers we previously un-hidden
        try {
            document
                .querySelectorAll('[data-was-hidden="true"]')
                .forEach(function (el) {
                    el.classList.add("hidden");
                    el.removeAttribute("data-was-hidden");
                });
        } catch (e) {}
        // set cliente back to readonly
        const clienteEl2 = document.getElementById("cliente");
        if (clienteEl2) clienteEl2.readOnly = true;
        const cilEl2 = document.getElementById("cilindro");
        if (cilEl2)
            try {
                cilEl2.blur();
            } catch (e) {}
    }

    if (btnRefresh) {
        btnRefresh.addEventListener("click", function () {
            // reload current page
            table.setData("/movimientos", {
                per_page: defaultPerPage,
                page: 1,
                search: searchInput ? searchInput.value : "",
            });
        });
    }

    if (btnCreate) {
        btnCreate.addEventListener("click", function () {
            // Placeholder: show create UI/modal
            alert("Crear movimiento (implementa modal/form aquí)");
        });
    }

    if (btnEdit) {
        btnEdit.addEventListener("click", function () {
            if (!selectedRowData)
                return alert("Seleccione un movimiento primero");

            // populate cliente input before entering edit mode
            const clienteEl = document.getElementById("cliente");
            if (clienteEl) {
                try {
                    clienteEl.value =
                        selectedRowData?.tercero?.codcli ??
                        selectedRowData?.codcli ??
                        "";
                } catch (e) {}
            }

            // enter edit mode (shows the wrappers and focuses cilindro)
            enterEditMode();

            // Ensure detail panel is visible
            try {
                showMovimientoDetalle();
            } catch (e) {}
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener("click", function () {
            if (!selectedRowData)
                return alert("Seleccione un movimiento primero");
            if (
                !confirm("¿Eliminar movimiento " + selectedRowData.docto + " ?")
            )
                return;
            // Placeholder for delete action (call backend DELETE endpoint)
            alert(
                "Eliminar movimiento: " +
                    selectedRowData.docto +
                    " (implementar)"
            );
        });
    }

    syncDetailHeights();

    let _resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(() => {
            syncDetailHeights();
        }, 120);
    });

    function showMovimientoDetalle() {
        const cont = document.getElementById("movimientoDetalle");
        if (cont) cont.classList.remove("hidden");
        const cilCont = document.getElementById("cilindrosContainer");
        if (cilCont) cilCont.classList.remove("hidden");

        const placeholder = document.getElementById("movimientoPlaceholder");
        if (placeholder) placeholder.classList.add("hidden");

        try {
            const rightPanel = placeholder
                ? placeholder.closest(".bg-white")
                : document.querySelector(".lg\\:col-span-8 > .bg-white");
            if (rightPanel) {
                const hdr = rightPanel.querySelector("h3");
                const lead = rightPanel.querySelector("p");
                if (hdr) hdr.classList.add("hidden");
                if (lead) lead.classList.add("hidden");
            }
        } catch (e) {}

        if (typeof syncDetailHeights === "function") syncDetailHeights();
    }

    table.on("rowClick", function (e, row) {
        // Ensure we exit edit mode when selecting a different row
        try {
            exitEditMode();
        } catch (e) {}

        // Always select the clicked row (do not toggle off when clicking again)
        try {
            table.deselectRow();
        } catch (e) {}
        try {
            row.select();
        } catch (e) {}

        const data = row.getData();
        const docto = data.docto;
        if (!docto) return;

        // store selection for toolbar actions
        selectedRowData = row.getData();
        updateToolbarState();

        const cilTable = document.getElementById("cilindros-table");
        if (cilTable) cilTable.innerHTML = "";

        if (data.fecha) {
            let fecha = data.fecha;
            if (typeof fecha === "string") {
                const m = fecha.match(/^(\d{4}-\d{2}-\d{2})/);
                fecha = m ? m[1] : fecha;
            }
            const fechaEl = document.getElementById("fecha");
            if (fechaEl) fechaEl.value = fecha;
        } else {
            const fechaEl = document.getElementById("fecha");
            if (fechaEl) fechaEl.value = "";
        }

        const ordenEl = document.getElementById("orden");
        if (ordenEl) ordenEl.value = data.docto || "";

        let infoCliente = "";
        if (data.tercero) {
            if (data.tercero.codcli)
                infoCliente += "Código: " + data.tercero.codcli;
            if (data.tercero.Nombre_tercero) {
                if (infoCliente) infoCliente += "\n";
                infoCliente += "Cliente: " + data.tercero.Nombre_tercero;
            }
        }
        const infoClienteEl = document.getElementById("infoCliente");
        if (infoClienteEl) infoClienteEl.value = infoCliente.trim();

        fetch(`/movimientos/${docto}`)
            .then((r) => r.json())
            .then((json) => {
                const mov = Array.isArray(json) ? json[0] : json;
                const bodies = mov && mov.bodies ? mov.bodies : [];
                renderCilindrosTabulator(bodies);
            })
            .catch(() => {
                if (cilTable)
                    cilTable.innerHTML =
                        '<div class="text-center text-red-500 py-4">Error al cargar cilindros</div>';
            });

        showMovimientoDetalle();
    });

    let cilindrosTabulator = null;

    function renderCilindrosTabulator(bodies) {
        const cilTable = document.getElementById("cilindros-table");
        if (!cilTable) return;
        if (cilindrosTabulator) {
            try {
                cilindrosTabulator.destroy();
            } catch (e) {}
            cilindrosTabulator = null;
        }
        if (!bodies || !bodies.length) {
            cilTable.innerHTML =
                '<div class="text-center text-gray-400 py-4">No hay cilindros para este movimiento</div>';
            return;
        }
        cilTable.innerHTML = "";
        let tableHeight = 256;
        if (window.matchMedia("(min-width: 640px)").matches) tableHeight = 150;
        if (window.matchMedia("(min-width: 768px)").matches) tableHeight = 184;
        cilindrosTabulator = new Tabulator(cilTable, {
            data: bodies,
            layout: "fitColumns",
            resizableColumns: false,
            movableColumns: false,
            pagination: false,
            height: tableHeight,
            columns: [
                {
                    title: "Código",
                    field: "codigo_articulo",
                    headerSort: false,
                    hozAlign: "left",
                    widthGrow: 2,
                },
                {
                    title: "Cantidad",
                    field: "cantidad",
                    headerSort: false,
                    hozAlign: "right",
                    widthGrow: 1,
                },
                {
                    title: "Precio",
                    field: "precio_docto",
                    headerSort: false,
                    hozAlign: "right",
                    widthGrow: 1,
                },
            ],
            placeholder: "No hay cilindros para este movimiento",
        });
    }

    // Modal de clientes
    let clientesTabulator = null;
    const buscarClienteBtn = document.getElementById("buscarClienteBtn");
    const clienteModal = document.getElementById("clienteModal");
    const cerrarClienteModal = document.getElementById("cerrarClienteModal");

    if (buscarClienteBtn && clienteModal && cerrarClienteModal) {
        buscarClienteBtn.addEventListener("click", async () => {
            clienteModal.classList.remove("hidden");
            try {
                const response = await fetch("/terceros");
                const data = await response.json();
                const clientes = data.data; // Asumiendo que viene en data

                if (clientesTabulator) {
                    clientesTabulator.destroy();
                }

                clientesTabulator = new Tabulator("#clientesTable", {
                    data: clientes,
                    layout: "fitColumns",
                    resizableColumns: false,
                    movableColumns: false,
                    pagination: false,
                    height: 300,
                    columns: [
                        {
                            title: "Código",
                            field: "codcli",
                            headerSort: false,
                            hozAlign: "left",
                        },
                        {
                            title: "Nombre",
                            field: "Nombre_tercero",
                            headerSort: false,
                            hozAlign: "left",
                        },
                    ],
                    placeholder: "No hay clientes para mostrar",
                });

                clientesTabulator.on("cellClick", function (e, cell) {
                    if (e.target.classList.contains("seleccionarCliente")) {
                        const rowData = cell.getRow().getData();
                        document.getElementById("cliente").value =
                            rowData.codcli;
                        document.getElementById("infoCliente").value =
                            rowData.Nombre_tercero;
                        clienteModal.classList.add("hidden");
                    }
                });
            } catch (error) {
                console.error("Error cargando clientes:", error);
            }
        });

        cerrarClienteModal.addEventListener("click", () => {
            clienteModal.classList.add("hidden");
        });
    }
}

// named export used by tabs-system.js
