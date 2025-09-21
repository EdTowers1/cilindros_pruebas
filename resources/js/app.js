import './bootstrap';

import Alpine from 'alpinejs';

import TabSystem from './tabs-system.js';
import 'tabulator-tables/dist/css/tabulator_simple.min.css';

window.Alpine = Alpine;

window.TabSystem = TabSystem;

// Alias para compatibilidad
window.addFetchedTab = TabSystem.addFetchedTab;
window.addCustomTab = TabSystem.addCustomTab;
window.abrirModulo = TabSystem.abrirModulo;

Alpine.start();

// Inicializar el sistema de tabs
TabSystem.init();
