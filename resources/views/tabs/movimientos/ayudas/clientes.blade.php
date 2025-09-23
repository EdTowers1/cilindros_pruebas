<!-- ...existing code... -->

<!-- Modal para buscar cliente -->
<div id="clienteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden" role="dialog"
    aria-labelledby="clienteModalTitle" aria-hidden="true">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 id="clienteModalTitle" class="text-lg font-medium text-gray-900">Seleccionar Cliente</h3>
            <div class="mt-4">
                <div id="clientesTable" class="w-full"></div>
            </div>
            <div class="flex items-center justify-end pt-4 border-t">
                <button id="cerrarClienteModal"
                    class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ...existing code... -->
