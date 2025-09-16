<div class="p-4">

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

                <div class="mb-2">
                    <div class="flex items-center gap-2">
                        <input id="movimientosSearch" type="text" placeholder="Buscar movimientos..."
                            class="block w-full rounded-md bg-white/5 px-2 py-1 text-sm placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500" />
                        <button id="movimientosClear" type="button"
                            class="inline-flex items-center px-2 py-1 rounded-md bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 text-sm">
                            Limpiar
                        </button>
                    </div>
                </div>

                <div id="movimientos-table" class="w-full"></div>

                <!-- Load external movimientos script (Tabulator and Luxon handled inside) -->
                <script src="{{ asset('js/movimientos.js') }}" defer></script>
            </div>
        </div>

        <!-- Right column: Main area (8/12) -->
        <div class="lg:col-span-8">
            <div class="bg-white rounded-lg shadow-2xl p-3">
                <h3 class="text-lg font-semibold mb-2">Panel de Detalles</h3>
                <p class="text-gray-600">Aquí puedes mostrar detalles del movimiento seleccionado, formularios para
                    crear/editar movimientos o gráficos de resumen.</p>

                <!-- Placeholder shown before a movement is selected -->
                <div id="movimientoPlaceholder"
                    class="mt-3 rounded-md p-3 text-center text-gray-700 bg-white/6 border-2 border-dashed border-gray-400 divide-y divide-gray-300 shadow-sm">
                    <div class="font-semibold py-3">Área de detalles</div>
                    <div class="text-sm py-3">Seleccione un movimiento para ver sus detalles.</div>
                </div>

                <form id="movimientoDetalleForm" action="" class="mt-3">
                    <div id="movimientoDetalle" class="mt-3 hidden">
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
                                            <textarea id="infoCliente" name="infoCliente" readonly rows="5"
                                                class="mt-1 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                                        outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm resize-none"></textarea>
                                        </div>
                                    </div>

                                    <!-- Columna derecha (Orden, Fecha, Tipo de Movimiento) -->
                                    <div class="space-y-6">
                                        <div>
                                            <label for="orden" class="block text-sm font-medium">Orden #</label>
                                            <input id="orden" type="text" name="orden" readonly
                                                class="mt-1 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base
                                                outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500
                                                focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm" />
                                        </div>

                                        <div>
                                            <label for="fecha" class="block text-sm font-medium">Fecha de
                                                Movimiento</label>
                                            <input id="fecha" type="date" name="fecha" readonly
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


            <div id="cilindrosContainer" class="mt-0.5 bg-white rounded-lg shadow-2xl p-3 hidden">
                <div id="cilindros-table" class="w-full"></div>
            </div>

        </div>


    </div>
</div>
