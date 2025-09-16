(function () {
    // Self-invoking module to avoid polluting global scope
    async function ensureTabulator() {
        if (window.Tabulator) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src =
                "https://unpkg.com/tabulator-tables@5.5.4/dist/js/tabulator.min.js";
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load Tabulator"));
            document.head.appendChild(s);
        });
    }

    function ensureLuxon() {
        return new Promise((resolve) => {
            if (window.luxon) return resolve();
            const start = Date.now();
            const iv = setInterval(() => {
                if (window.luxon) {
                    clearInterval(iv);
                    resolve();
                }
                if (Date.now() - start > 3000) {
                    clearInterval(iv);
                    resolve();
                }
            }, 50);
        });
    }

    // Main initializer
    async function initMovimientos() {
        try {
            await ensureLuxon();
            await ensureTabulator();
        } catch (e) {
            console.error("No se pudo cargar Tabulator o Luxon:", e);
            return;
        }

        const defaultPerPage = 10;
        const movimientosTableHeight = 400;

        function syncDetailHeights() {
            const placeholder = document.getElementById(
                "movimientoPlaceholder"
            );
            if (placeholder) placeholder.style.minHeight = 365 + "px";
        }

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
            ajaxRequesting: function (url, params) {
                return true;
            },
            ajaxError: function (xhr, textStatus, errorThrown) {
                console.error(
                    "Error al cargar datos:",
                    textStatus,
                    errorThrown
                );
            },
        });

        table.setPageSize = function (size) {
            this.setData("/movimientos", {
                per_page: size,
                page: 1,
            });
        };

        // Search input handling (debounced) - updates remote params and reloads page 1
        function debounce(fn, wait) {
            let t = null;
            return function () {
                const args = arguments;
                clearTimeout(t);
                t = setTimeout(function () {
                    fn.apply(null, args);
                }, wait);
            };
        }

        function applySearchTerm(term) {
            term = term ? String(term).trim() : "";
            table.setData("/movimientos", {
                per_page: defaultPerPage,
                page: 1,
                search: term,
            });
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

            const placeholder = document.getElementById(
                "movimientoPlaceholder"
            );
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
            table.deselectRow();
            row.select();

            const data = row.getData();
            const docto = data.docto;
            if (!docto) return;

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
            if (window.matchMedia("(min-width: 640px)").matches)
                tableHeight = 150;
            if (window.matchMedia("(min-width: 768px)").matches)
                tableHeight = 184;
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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMovimientos);
    } else {
        initMovimientos();
    }
})();
