/**
 * Sistema de Pestañas Dinámicas - Cilindros App
 * Archivo JavaScript organizado para el manejo de tabs dinámicos
 *
 * Estructura del archivo:
 * - CONFIG: Configuración global del sistema
 * - state: Estado interno del sistema
 * - Funciones principales: init, preLoadTabs, activarTab, etc.
 * - Funciones auxiliares: createTabButton, createTabPane, loadTabContent, etc.
 * - API pública: TabSystem object con métodos públicos
 *
 * Uso:
 * - Incluir el archivo: <script src="{{ asset('js/tabs-system.js') }}"></script>
 * - Abrir módulo: abrirModulo('cilindros', 'Cilindros')
 * - Crear tab personalizado: addCustomTab('<p>Contenido</p>', 'Mi Tab', true)
 */

(function () {
    "use strict";

    // Configuración del sistema de tabs
    const CONFIG = {
        colors: [
            "#e3f2fd",
            "#fce4ec",
            "#e8f5e9",
            "#fff3e0",
            "#f3e5f5",
            "#e0f7fa",
            "#f9fbe7",
        ],
        defaultBg: "#f8f9fa",
        modules: ["cilindros", "clientes", "movimientos"],
    };

    // Estado del sistema
    let state = {
        tabCounter: 0,
        tabCache: {},
        tabList: null,
        tabContent: null,
    };

    /**
     * Inicializa el sistema de tabs cuando el DOM está listo
     */
    function init() {
        state.tabList = document.getElementById("tabList");
        state.tabContent = document.getElementById("tabContent");

        if (!state.tabList || !state.tabContent) {
            console.error("Elementos del sistema de tabs no encontrados");
            return;
        }

        console.log("Sistema de tabs inicializado:", {
            tabList: state.tabList,
            tabContent: state.tabContent,
        });

        // Pre-cargar contenido de módulos
        preLoadTabs();

        // Configurar event listeners globales
        setupGlobalListeners();
    }

    /**
     * Pre-carga el contenido de todos los módulos
     */
    function preLoadTabs() {
        CONFIG.modules.forEach(function (modulo) {
            const url = "/tab/" + modulo;
            fetch(url, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            })
                .then(function (res) {
                    if (!res.ok)
                        throw new Error(
                            "HTTP " + res.status + " - " + res.statusText
                        );
                    return res.text();
                })
                .then(function (html) {
                    state.tabCache[url] = html;
                    console.log("Pre-cargado:", modulo);
                })
                .catch(function (err) {
                    console.error("Error pre-cargando", modulo, err);
                });
        });
    }

    /**
     * Configura los event listeners globales
     */
    function setupGlobalListeners() {
        // Aviso antes de salir si hay pestañas abiertas
        window.addEventListener("beforeunload", function (e) {
            if (state.tabList.querySelectorAll(".tab-button").length > 0) {
                e.preventDefault();
                e.returnValue = "";
            }
        });
    }

    /**
     * Activa una pestaña específica
     * @param {HTMLElement} btn - El botón de la pestaña a activar
     */
    function activarTab(btn) {
        if (!btn) return;

        // Desactivar todas las pestañas
        state.tabList.querySelectorAll(".tab-button").forEach(function (b) {
            b.classList.remove(
                "border-blue-500",
                "text-blue-900",
                "shadow-md",
                "scale-110",
                "z-10"
            );
            b.classList.add(
                "border-transparent",
                "text-gray-600",
                "scale-100",
                "z-0"
            );
            b.setAttribute("aria-selected", "false");
        });

        // Ocultar todos los paneles
        state.tabContent.querySelectorAll(".tab-pane").forEach(function (p) {
            p.classList.add("hidden");
        });

        // Activar la pestaña seleccionada
        btn.classList.remove(
            "border-transparent",
            "text-gray-600",
            "scale-100",
            "z-0"
        );
        btn.classList.add(
            "border-blue-500",
            "text-blue-900",
            "shadow-md",
            "scale-110",
            "z-10"
        );
        btn.setAttribute("aria-selected", "true");

        // Mostrar el panel correspondiente
        const paneId = btn.getAttribute("data-target");
        const pane = document.getElementById(paneId);
        if (pane) pane.classList.remove("hidden");
    }

    /**
     * Crea una pestaña obteniendo contenido mediante fetch
     * @param {string} url - URL del contenido
     * @param {string} customId - ID personalizado para la pestaña
     * @param {string} title - Título de la pestaña
     * @param {boolean} makeActive - Si debe activarse automáticamente
     */
    function addFetchedTab(url, customId, title, makeActive) {
        console.log("Creando pestaña con fetch para URL:", url);

        state.tabCounter++;
        const idx = state.tabCounter;
        const tabId = customId || "tab-fet-" + idx;
        const color =
            CONFIG.colors[(idx - 1) % CONFIG.colors.length] || CONFIG.defaultBg;
        const paneId = tabId + "-pane";

        // Crear el botón de la pestaña
        const btnTab = createTabButton(tabId, paneId, color, title || "Tab");

        // Crear el panel de contenido
        const pane = createTabPane(paneId, btnTab.id);

        // Agregar al DOM
        state.tabList.appendChild(btnTab.parentElement);
        state.tabContent.appendChild(pane);

        // Cargar contenido
        loadTabContent(url, pane, makeActive ? btnTab : null);
    }

    /**
     * Crea una pestaña con contenido HTML personalizado
     * @param {string} html - Contenido HTML
     * @param {string} title - Título de la pestaña
     * @param {boolean} makeActive - Si debe activarse automáticamente
     */
    function addCustomTab(html, title, makeActive) {
        state.tabCounter++;
        const idx = state.tabCounter;
        const tabId = "tab-custom-" + idx;
        const paneId = tabId + "-pane";
        const color =
            CONFIG.colors[(idx - 1) % CONFIG.colors.length] || CONFIG.defaultBg;

        // Crear el botón de la pestaña
        const btnTab = createTabButton(
            tabId,
            paneId,
            color,
            title || "Tab " + idx
        );

        // Crear el panel de contenido
        const pane = createTabPane(paneId, btnTab.id);
        pane.innerHTML = html;

        // Agregar al DOM
        state.tabList.appendChild(btnTab.parentElement);
        state.tabContent.appendChild(pane);

        if (makeActive) activarTab(btnTab);
    }

    /**
     * Crea un botón de pestaña
     * @param {string} tabId - ID de la pestaña
     * @param {string} paneId - ID del panel
     * @param {string} color - Color de fondo
     * @param {string} title - Título de la pestaña
     * @returns {HTMLElement} El botón creado
     */
    function createTabButton(tabId, paneId, color, title) {
        // Crear elemento de lista
        const li = document.createElement("li");
        li.className = "mr-1";

        // Crear botón
        const btnTab = document.createElement("button");
        btnTab.className =
            "tab-button inline-flex items-center px-4 py-2 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-800 hover:scale-102 transition-all duration-200 ease-in-out rounded-t-md transform scale-100";
        btnTab.type = "button";
        btnTab.id = tabId + "-btn";

        // Configurar atributos ARIA
        btnTab.setAttribute("role", "tab");
        btnTab.setAttribute("aria-controls", paneId);
        btnTab.setAttribute("aria-selected", "false");
        btnTab.setAttribute("data-target", paneId);
        btnTab.setAttribute("data-color", color);

        // Aplicar estilos de color
        btnTab.style.borderLeft = "4px solid " + color;
        btnTab.style.backgroundColor = color;

        // Crear contenido del botón
        btnTab.innerHTML =
            '<span class="mr-2">' +
            title +
            '</span><span class="tab-close text-red-500 hover:text-red-700 text-lg font-bold" title="Cerrar">&times;</span>';

        // Configurar event listeners
        btnTab.addEventListener("click", function (e) {
            if (e.target.classList.contains("tab-close")) return;
            activarTab(btnTab);
        });

        btnTab
            .querySelector(".tab-close")
            .addEventListener("click", function (e) {
                e.stopPropagation();
                if (confirm('¿Deseas cerrar "' + title + '"?')) {
                    li.remove();
                    const paneToRemove = document.getElementById(paneId);
                    if (paneToRemove) paneToRemove.remove();
                    const first = state.tabList.querySelector(".tab-button");
                    if (first) activarTab(first);
                }
            });

        li.appendChild(btnTab);
        return btnTab;
    }

    /**
     * Crea un panel de pestaña
     * @param {string} paneId - ID del panel
     * @param {string} labelledBy - ID del elemento que etiqueta el panel
     * @returns {HTMLElement} El panel creado
     */
    function createTabPane(paneId, labelledBy) {
        const pane = document.createElement("div");
        pane.className = "tab-pane hidden";
        pane.id = paneId;
        pane.setAttribute("role", "tabpanel");
        pane.setAttribute("aria-labelledby", labelledBy);

        // Contenido de carga inicial
        pane.innerHTML =
            '<div class="flex justify-center items-center h-64"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>';

        return pane;
    }

    /**
     * Carga el contenido de una pestaña
     * @param {string} url - URL del contenido
     * @param {HTMLElement} pane - Panel donde cargar el contenido
     * @param {HTMLElement} btnTab - Botón a activar después de cargar
     */
    function loadTabContent(url, pane, btnTab) {
        if (state.tabCache[url]) {
            // Usar contenido del cache
            pane.innerHTML = state.tabCache[url];
            executeScripts(pane);
            if (btnTab) activarTab(btnTab);
        } else {
            // Cargar desde el servidor
            fetch(url, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            })
                .then(function (res) {
                    if (!res.ok)
                        throw new Error(
                            "HTTP " + res.status + " - " + res.statusText
                        );
                    return res.text();
                })
                .then(function (html) {
                    state.tabCache[url] = html; // Guardar en cache
                    pane.innerHTML = html;
                    executeScripts(pane);
                    if (btnTab) activarTab(btnTab);
                })
                .catch(function (err) {
                    pane.innerHTML =
                        '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-3">Error cargando módulo: ' +
                        err.message +
                        "</div>";
                    console.error("Error cargando tab:", err);
                    if (btnTab) activarTab(btnTab);
                });
        }
    }

    /**
     * Ejecuta los scripts dentro de un elemento
     * @param {HTMLElement} element - Elemento que contiene los scripts
     */
    function executeScripts(element) {
        const scripts = element.querySelectorAll("script");
        scripts.forEach(function (oldScript) {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(function (attr) {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }

    /**
     * Abre un módulo específico
     * @param {string} modulo - Nombre del módulo
     * @param {string} titulo - Título del módulo
     */
    function abrirModulo(modulo, titulo) {
        const tabId = modulo + "-tab";
        const existingTab = document.getElementById(tabId + "-btn");

        if (existingTab) {
            activarTab(existingTab);
            return;
        }

        const url = "/tab/" + modulo;
        addFetchedTab(url, tabId, titulo, true);
    }

    // API pública
    window.TabSystem = {
        addFetchedTab: addFetchedTab,
        addCustomTab: addCustomTab,
        abrirModulo: abrirModulo,
        activarTab: activarTab,
    };

    // Alias para compatibilidad
    window.addFetchedTab = addFetchedTab;
    window.addCustomTab = addCustomTab;
    window.abrirModulo = abrirModulo;

    // Inicializar cuando el DOM esté listo
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
