<div class="p-4">
    {{-- <h2 class="text-2xl font-bold mb-3">Movimientos de Cilindros</h2>
    <p class="text-gray-600 mb-3">Registra y consulta los movimientos de cilindros.</p> --}}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- Left column: Table (4/12) -->
        <div class="lg:col-span-4">
            <div class="bg-white rounded-lg shadow-2xl p-3">
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

                        // Detectar selección de movimiento y renderizar cilindros
                        table.on('rowClick', function(e, row) {
                            const data = row.getData();
                            const docto = data.docto;
                            if (!docto) return;

                            const cilTable = document.getElementById('cilindros-table');
                            if (cilTable) cilTable.innerHTML = '';

                            fetch(`/movimientos/${docto}`)
                                .then(r => r.json())
                                .then(json => {
                                    const mov = Array.isArray(json) ? json[0] : json;
                                    const bodies = mov && mov.bodies ? mov.bodies : [];
                                    renderCilindrosTabulator(bodies);
                                })
                                .catch(() => {
                                    if (cilTable) cilTable.innerHTML =
                                        '<div class="text-center text-red-500 py-4">Error al cargar cilindros</div>';
                                });
                        });

                        let cilindrosTabulator = null;

                        function renderCilindrosTabulator(bodies) {
                            const cilTable = document.getElementById('cilindros-table');
                            if (!cilTable) return;
                            // Destruir instancia previa si existe
                            if (cilindrosTabulator) {
                                cilindrosTabulator.destroy();
                                cilindrosTabulator = null;
                            }
                            if (!bodies || !bodies.length) {
                                cilTable.innerHTML =
                                    '<div class="text-center text-gray-400 py-4">No hay cilindros para este movimiento</div>';
                                return;
                            }
                            cilTable.innerHTML = '';
                            // Altura responsiva: 256px (max-h-64) en móviles, 320px (max-h-80) en sm, 384px (max-h-96) en md+
                            let tableHeight = 256;
                            if (window.matchMedia('(min-width: 640px)').matches) tableHeight = 150;
                            if (window.matchMedia('(min-width: 768px)').matches) tableHeight = 180;
                            cilindrosTabulator = new Tabulator(cilTable, {
                                data: bodies,
                                layout: 'fitColumns',
                                resizableColumns: false,
                                movableColumns: false,
                                pagination: false,
                                height: tableHeight,
                                columns: [{
                                        title: 'Código',
                                        field: 'codigo_articulo',
                                        headerSort: false,
                                        hozAlign: 'left',
                                        widthGrow: 2
                                    },
                                    {
                                        title: 'Cantidad',
                                        field: 'cantidad',
                                        headerSort: false,
                                        hozAlign: 'right',
                                        widthGrow: 1
                                    },
                                    {
                                        title: 'Precio',
                                        field: 'precio_docto',
                                        headerSort: false,
                                        hozAlign: 'right',
                                        widthGrow: 1
                                    },
                                ],
                                placeholder: 'No hay cilindros para este movimiento',
                            });
                        }

                    })();
                </script>
            </div>
        </div>

        <!-- Right column: Main area (8/12) -->
        <div class="lg:col-span-8">
            <div class="bg-white rounded-lg shadow-2xl p-3">

                <form id="movimientoDetalleForm" action="" class="mt-3">
                    <div id="movimientoDetalle" class="mt-3">
                        <div id="movimientoDetalleContent">
                            <div class="border-b border-white/10">
                                <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <!-- Columna izquierda (Cliente e InfoCliente) -->
                                    <div class="space-y-6">
                                        <div>
                                            <label for="cliente" class="block text-sm font-medium">Cliente</label>
                                            <div class="mt-1 flex rounded-md shadow-sm">
                                                <!-- Input -->
                                                <input id="cliente" type="text" name="cliente"
                                                    placeholder="Ingrese el código del cliente..."
                                                    class="block w-full rounded-l-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm" />

                                                <!-- Botón -->
                                                <button type="button"
                                                    class="inline-flex items-center px-3 py-1.5 rounded-r-md border-l border-gray-300 bg-white text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    aria-label="Buscar cliente">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <circle cx="11" cy="11" r="7" stroke="#2563eb"
                                                            stroke-width="2" fill="none" />
                                                        <line x1="16.5" y1="16.5" x2="21"
                                                            y2="21" stroke="#2563eb" stroke-width="2"
                                                            stroke-linecap="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>


                                        <div>
                                            <label for="infoCliente" class="block text-sm font-medium">Información del
                                                Cliente</label>
                                            <textarea id="infoCliente" name="infoCliente" rows="5"
                                                class="mt-1 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                                        outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm resize-none"></textarea>
                                        </div>
                                    </div>

                                    <!-- Columna derecha (Orden, Fecha, Tipo de Movimiento) -->
                                    <div class="space-y-6">
                                        <div>
                                            <label for="orden" class="block text-sm font-medium">Orden #</label>
                                            <input id="orden" type="text" name="orden"
                                                class="mt-1 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                                        outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm" />
                                        </div>

                                        <div>
                                            <label for="fecha" class="block text-sm font-medium">Fecha de
                                                Movimiento</label>
                                            <input id="fecha" type="date" name="fecha"
                                                class="mt-1 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                                        outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm" />
                                        </div>

                                        <div>
                                            <label for="tipoMovimiento" class="block text-sm font-medium">Tipo de
                                                Movimiento</label>
                                            <select id="tipoMovimiento" name="tipoMovimiento"
                                                class="mt-1 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                                        outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm">
                                                <option value="">Seleccione...</option>
                                                <option value="Ingreso">Ingreso</option>
                                                <option value="Salida">Salida</option>
                                                <option value="Traslado">Traslado</option>
                                                <option value="Ajuste">Ajuste</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>


            <div class="mt-1 bg-white rounded-lg shadow-2xl p-3">
                <div id="cilindros-table" class="w-full max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto"></div>
            </div>

        </div>


    </div>
</div>
