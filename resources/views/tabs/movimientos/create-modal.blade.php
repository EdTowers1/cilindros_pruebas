{{-- Modal de Creación de Movimiento --}}
<div id="createMovimientoModal" class="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
    role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <!-- Center modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <form id="createMovimientoForm">
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white" id="modal-title">
                            <i class="fa-solid fa-plus mr-2"></i>
                            Crear Nuevo Movimiento
                        </h3>
                        <button type="button" id="closeCreateModalBtn"
                            class="text-white hover:text-gray-200 focus:outline-none">
                            <i class="fa-solid fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="bg-white px-4 py-3 max-h-[70vh] overflow-y-auto">
                    <!-- Información General -->
                    <div class="mb-4">


                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Cliente -->
                            <div>
                                <label for="createCliente" class="block text-sm font-medium text-gray-700 mb-1">
                                    Cliente <span class="text-red-500">*</span>
                                </label>
                                <div class="flex gap-2">
                                    <input type="text" id="createCliente" name="codcli" required readonly
                                        placeholder="Código del cliente"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50" />
                                    <button type="button" id="createBuscarClienteBtn"
                                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <i class="fa-solid fa-search"></i>
                                    </button>
                                </div>
                                <p class="mt-1 text-xs text-gray-500">Haga clic en buscar para seleccionar un cliente
                                </p>
                            </div>

                            <!-- Información del Cliente (solo lectura) -->
                            <div>
                                <label for="createInfoCliente" class="block text-sm font-medium text-gray-700 mb-1">
                                    Información del Cliente
                                </label>
                                <textarea id="createInfoCliente" readonly rows="3"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 resize-none"
                                    placeholder="La información del cliente se mostrará aquí"></textarea>
                            </div>

                            <!-- Orden y Fecha (compartidos en dos columnas) -->
                            <div class="grid grid-cols-2 gap-2">
                                <!-- Orden / Número de Movimiento (izquierda) -->
                                <div>
                                    <label for="createOrden" class="block text-sm font-medium text-gray-700 mb-1">
                                        Orden <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" id="createOrden" name="orden" required readonly
                                        placeholder="Auto"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50" />
                                </div>

                                <!-- Fecha (derecha) -->
                                <div>
                                    <label for="createFecha" class="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha <span class="text-red-500">*</span>
                                    </label>
                                    <input type="date" id="createFecha" name="fecha" required readonly
                                        aria-readonly="true" placeholder="Auto"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 pointer-events-none" />
                                </div>
                            </div>

                            <!-- Observaciones -->
                            <div>
                                <label for="createObservaciones" class="block text-sm font-medium text-gray-700 mb-1">
                                    Observaciones
                                </label>
                                <textarea id="createObservaciones" name="observaciones" rows="3"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
                                    placeholder="Ingrese observaciones adicionales (opcional)"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Cilindros -->
                    <div class="mb-3">
                        <div class="flex items-center justify-between mb-3 border-b pb-2">
                            <h4 class="text-md font-semibold text-gray-700">
                                <i class="fa-solid fa-box mr-2 text-blue-600"></i>
                                Cilindros
                            </h4>
                            <button type="button" id="addCilindroBtn"
                                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                <i class="fa-solid fa-plus mr-1"></i>
                                Agregar Cilindro
                            </button>
                        </div>

                        <!-- Tabla de Cilindros -->
                        <div class="border border-gray-200 rounded-md overflow-hidden">
                            <div class="max-h-40 overflow-y-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código
                                            </th>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Detalle
                                            </th>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cantidad
                                            </th>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Costo
                                            </th>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bodega
                                            </th>
                                            <th scope="col"
                                                class="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="cilindrosTableBody" class="bg-white divide-y divide-gray-200">
                                        <tr id="noCilindrosRow">
                                            <td colspan="7" class="px-3 py-6 text-center text-sm text-gray-500">
                                                <i class="fa-solid fa-box-open text-4xl mb-2 text-gray-300"></i>
                                                <p>No hay cilindros agregados</p>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse gap-3">
                    <button type="submit" id="saveMovimientoBtn"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-save mr-2"></i>
                        Guardar Movimiento
                    </button>
                    <button type="button" id="cancelCreateModalBtn"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                        <i class="fa-solid fa-times mr-2"></i>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
