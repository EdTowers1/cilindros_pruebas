<x-app-layout>
    {{-- <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot> --}}

    <div class="py-4">
        <div class="max-w-7xl mx-auto sm:px-4 lg:px-6">
            <div class="overflow-hidden shadow-sm sm:rounded-lg">
                <!-- Tab Navigation -->
                <div class="border-b border-gray-200">
                    <ul id="tabList" class="flex flex-wrap -mb-px" role="tablist">
                        <!-- Tabs will be added here dynamically -->
                    </ul>
                </div>

                <!-- Tab Content -->
                <div id="tabContent" class="p-4 bg-gray-50 min-h-96">
                    <!-- Tab panes will be added here dynamically -->
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/tabs-system.js') }}"></script>
</x-app-layout>
