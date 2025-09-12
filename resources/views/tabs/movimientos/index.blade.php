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

                        // Initialize Tabulator (columns mapped to MovimientoCilindro attributes)
                        const table = new Tabulator('#movimientos-table', {
                            layout: 'fitColumns',
                            resizableColumns: false,
                            movableColumns: false,
                            ajaxURL: '/movimientos',
                            ajaxConfig: 'GET',
                            ajaxParams: {
                                per_page: 10
                            },
                            pagination: 'remote',
                            paginationSize: 10,
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
                                return response.data;
                            },
                            // Sorting disabled globally
                            columns: [{
                                    title: 'ID',
                                    field: 'id',
                                    width: 70,
                                    hozAlign: 'left',
                                    resizable: false,
                                    headerSort: false
                                },
                                {
                                    title: 'Cliente',
                                    field: 'cliente.nombre',
                                    widthGrow: 2,
                                    resizable: false,
                                    headerSort: false
                                },
                                {
                                    title: 'Fecha',
                                    field: 'fecha',
                                    width: 140,
                                    resizable: false,
                                    headerSort: false
                                }
                            ],
                        });

                        // Handle button clicks inside Tabulator
                        document.getElementById('movimientos-table').addEventListener('click', function(e) {
                            const btn = e.target.closest('.ver-detalle-btn');
                            if (btn) {
                                const id = btn.getAttribute('data-id');
                                loadDetalle(id);
                            }
                        });

                        async function loadDetalle(id) {
                            try {
                                const res = await fetch(`/movimientos/${id}`, {
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'Accept': 'application/json'
                                    }
                                });
                                if (!res.ok) throw new Error('Error al obtener detalle');
                                const m = await res.json();
                                renderDetalle(m);
                            } catch (e) {
                                console.error(e);
                            }
                        }

                        function renderDetalle(m) {
                            if (!detalle) return;
                            detalle.innerHTML = `
                                <div class="p-3">
                                    <h4 class="font-semibold">Movimiento #${m.id}</h4>
                                    <p class="text-sm text-gray-600">Tipo: ${m.tipo} — Fecha: ${m.fecha}</p>
                                    <p class="mt-2">Cliente: ${m.cliente ? m.cliente.nombre : ''}</p>
                                    <div class="mt-3">
                                        <h5 class="font-medium">Cilindros</h5>
                                        <ul class="list-disc pl-5 mt-2 text-sm">
                                            ${ (m.cilindros && m.cilindros.length) ? m.cilindros.map(c=>`<li>${c.codigo || c.id} — Cant: ${c.pivot ? c.pivot.cantidad : (c.cantidad||'-')}</li>`).join('') : '<li class="text-gray-500">Sin cilindros</li>' }
                                        </ul>
                                    </div>
                                    <div class="mt-3 text-sm text-gray-700">${m.observaciones || ''}</div>
                                </div>
                            `;
                        }

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
