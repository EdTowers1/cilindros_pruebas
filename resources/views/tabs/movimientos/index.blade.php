<div class="p-4">
    {{-- <h2 class="text-2xl font-bold mb-3">Movimientos de Cilindros</h2>
    <p class="text-gray-600 mb-3">Registra y consulta los movimientos de cilindros.</p> --}}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- Left column: Table (4/12) -->
        <div class="lg:col-span-4">
            <div class="bg-white rounded-lg shadow p-3">
                <h3 class="text-lg font-semibold mb-2">Historial de Movimientos</h3>

                <!-- Tabulator CSS (simple theme) -->
                <link href="https://unpkg.com/tabulator-tables@5.5.4/dist/css/tabulator_simple.min.css" rel="stylesheet">

                <!-- Luxon (date/time utilities) - required by Tabulator when using date formatters -->
                <script>
                    if (!window.luxon) {
                        const sLux = document.createElement('script');
                        sLux.src = 'https://cdn.jsdelivr.net/npm/luxon@3/build/global/luxon.min.js';
                        sLux.async = false;
                        document.head.appendChild(sLux);
                    }
                </script>

                <div id="movimientos-table" class="w-full"></div>

                <script>
                    (async function() {
                        const detalle = document.getElementById('movimientoDetalle');

                        function ensureTabulator() {
                            if (window.Tabulator) return Promise.resolve();
                            return new Promise((resolve, reject) => {
                                const s = document.createElement('script');
                                s.src = 'https://unpkg.com/tabulator-tables@5.5.4/dist/js/tabulator.min.js';
                                s.async = true;
                                s.onload = () => resolve();
                                s.onerror = () => reject(new Error('Failed to load Tabulator'));
                                document.head.appendChild(s);
                            });
                        }

                        // Ensure Luxon is available before Tabulator initializes
                        function ensureLuxon() {
                            if (window.luxon || window.luxon === undefined && window.luxon === undefined) {
                                // If script tag was appended above, wait until global is present
                            }
                            return new Promise((resolve) => {
                                if (window.luxon) return resolve();
                                // Poll for luxon global for a short time
                                const start = Date.now();
                                const iv = setInterval(() => {
                                    if (window.luxon) {
                                        clearInterval(iv);
                                        resolve();
                                    }
                                    if (Date.now() - start > 3000) { // 3s timeout
                                        clearInterval(iv);
                                        resolve
                                            (); // still resolve so Tabulator can try to initialize (it may fallback)
                                    }
                                }, 50);
                            });
                        }

                        try {
                            await ensureLuxon();
                            await ensureTabulator();
                        } catch (e) {
                            console.error('No se pudo cargar Tabulator o Luxon:', e);
                            return;
                        }

                        // Default page size
                        const defaultPerPage = 10;

                        // Initialize Tabulator (columns mapped to MovimientoCilindro attributes)
                        const table = new Tabulator('#movimientos-table', {
                            layout: 'fitColumns',
                            resizableColumns: false,
                            movableColumns: false,

                            // remote data
                            ajaxURL: '/movimientos',
                            ajaxConfig: 'GET',
                            ajaxParams: {
                                per_page: defaultPerPage
                            },
                            pagination: 'remote',
                            paginationSize: defaultPerPage,
                            paginationDataSent: {
                                'page': 'page',
                                'per_page': 'per_page'
                            },
                            paginationDataReceived: {
                                data: 'data',
                                last_page: 'last_page',
                                total: 'total',
                                current_page: 'current_page',
                            },
                            ajaxResponse: function(url, params, response) {
                                return response.data || [];
                            },

                            placeholder: 'No hay movimientos para mostrar',

                            // Sorting disabled globally
                            columns: [{
                                    title: 'Código',
                                    field: 'docto',
                                    width: 70,
                                    hozAlign: 'left',
                                    resizable: false,
                                    headerSort: false
                                },
                                {
                                    title: 'Cliente',
                                    field: 'tercero.Nombre_tercero',
                                    width: 300,
                                    resizable: false,
                                    headerSort: false
                                },
                                {
                                    title: 'Fecha',
                                    field: 'fecha',
                                    widthGrow: 2,
                                    minWidth: 90, // asegurar espacio mínimo para 'YYYY-MM-DD'
                                    resizable: false,
                                    headerSort: false,
                                    formatter: function(cell) {
                                        const v = cell.getValue();
                                        if (!v) return '';
                                        // compact regex: capture YYYY-MM-DD at start of string
                                        // handles: "2025-09-12T00:00:", "2025-09-12", and Date objects (via toISOString)
                                        try {
                                            // if it's a Date object, convert to ISO string
                                            const s = v instanceof Date ? v.toISOString() : String(v);
                                            const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
                                            return m ? m[1] : '';
                                        } catch (e) {
                                            return '';
                                        }
                                    }
                                }
                            ],

                            // optional: show loading overlay while requesting
                            ajaxRequesting: function(url, params) {
                                // can be used to attach a loading indicator
                                return true;
                            },

                            // optional: handle ajax errors
                            ajaxError: function(xhr, textStatus, errorThrown) {
                                console.error('Error al cargar datos:', textStatus, errorThrown);
                            },
                        });

                        table.setPageSize = function(size) {
                            this.setData('/movimientos', {
                                per_page: size,
                                page: 1
                            });
                        };

                        // (Detalle functions removed as requested)

                    })();
                </script>
            </div>
        </div>

        <!-- Right column: Main area (8/12) -->
        <div class="lg:col-span-8">
            <div class="bg-white rounded-lg shadow p-3 min-h-[320px]">
                <h3 class="text-lg font-semibold mb-2">Panel de Acciones / Detalles</h3>
                <p class="text-gray-600">Aquí puedes mostrar detalles del movimiento seleccionado, formularios para
                    crear/editar movimientos o gráficos de resumen.</p>

                <!-- Placeholder: detalle del movimiento -->
                <div id="movimientoDetalle" class="mt-3">
                    <div class="border-dashed border-2 border-gray-200 rounded p-4 text-center text-gray-500">
                        Selecciona un movimiento en la tabla para ver los detalles aquí.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
