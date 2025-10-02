# Documentación de Funciones - Módulo Movimientos

Esta documentación detalla todas las funciones utilizadas en la estructura modularizada del módulo de movimientos, explicando qué hace cada una y cómo se relacionan entre sí.

---

## 📂 **index.js** - Orquestador Principal

### `initMovimientos()`
**Tipo:** `async function`
**Parámetros:** Ninguno
**Retorna:** `Promise<void>`

**Propósito:** Punto de entrada del módulo. Orquesta la inicialización de todos los componentes.

**Acciones:**
1. ✅ Crea la tabla principal de movimientos con Tabulator
2. ✅ Configura el sistema de búsqueda con debounce
3. ✅ Inicializa los botones del toolbar (crear, editar, eliminar, refrescar)
4. ✅ Configura los eventos de clic en las filas para mostrar detalles
5. ✅ Inicializa el modal de búsqueda de clientes
6. ✅ Ajusta las alturas del panel de detalles
7. ✅ Configura listener para ajustar alturas al redimensionar ventana

**Uso:**
```javascript
import { initMovimientos } from './modules/movimientos/index.js';
await initMovimientos();
```

---

## 📊 **state.js** - Gestión de Estado

### `selectedRowData()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `Object|null`

**Propósito:** Obtiene los datos de la fila actualmente seleccionada.

**Uso:**
```javascript
import { selectedRowData } from './state.js';
const rowData = selectedRowData();
if (rowData) {
  console.log('Movimiento seleccionado:', rowData.docto);
}
```

### `setSelectedRowData(data)`
**Tipo:** `function`
**Parámetros:**
- `data` (Object|null) - Datos de la fila a establecer, o null para limpiar

**Retorna:** `Object|null`

**Propósito:** Establece los datos de la fila seleccionada en el estado compartido.

**Uso:**
```javascript
import { setSelectedRowData } from './state.js';

// Establecer selección
setSelectedRowData({ docto: '12345', fecha: '2025-01-01', ... });

// Limpiar selección
setSelectedRowData(null);
```

---

## 🗂️ **movimientosTable.js** - Tabla Principal

### `createMovimientosTable()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `Tabulator` (instancia)

**Propósito:** Crea y configura la tabla principal de movimientos usando Tabulator.

**Características:**
- ✅ Paginación remota desde el servidor
- ✅ Columnas: Código, Cliente, Fecha
- ✅ Normalización automática de datos de terceros
- ✅ Formato de fechas (YYYY-MM-DD)
- ✅ Selección de una fila a la vez
- ✅ Manejo de errores AJAX

**Configuración destacada:**
```javascript
// Normalización de datos en ajaxResponse
ajaxResponse: function (url, params, response) {
    const rows = response.data || [];
    return rows.map((r) => {
        // Normaliza nombre_tercero y codcli
        r.nombre_tercero = r.nombre_tercero ||
                          (r.tercero?.Nombre_tercero) ||
                          r.nomcomer || '';
        r.codcli = r.codcli ||
                  (r.tercero?.codcli) ||
                  r.nit_tercero || '';
        return r;
    });
}
```

**Uso:**
```javascript
import { createMovimientosTable } from './movimientosTable.js';
const table = createMovimientosTable();
```

---

## 🔍 **search.js** - Sistema de Búsqueda

### `setupSearch(table)`
**Tipo:** `function`
**Parámetros:**
- `table` (Tabulator) - Instancia de la tabla de movimientos

**Retorna:** `void`

**Propósito:** Configura el sistema de búsqueda de movimientos.

**Características:**
- ✅ Búsqueda con debounce de 350ms
- ✅ Botón de limpiar búsqueda
- ✅ Limpia la selección al buscar
- ✅ Resetea a primera página

**Función interna: `applySearch(term)`**
- Limpia espacios del término
- Recarga datos con nuevo término
- Resetea a página 1
- Limpia selección actual

**Uso:**
```javascript
import { setupSearch } from './search.js';
setupSearch(table);
```

---

## 🛠️ **toolbar.js** - Botones de Acción

### `setupToolbar(table)`
**Tipo:** `function`
**Parámetros:**
- `table` (Tabulator) - Instancia de la tabla de movimientos

**Retorna:** `Object { updateToolbarState }`

**Propósito:** Configura el toolbar de movimientos y gestiona el estado de los botones.

**Botones gestionados:**
1. **Crear** - Siempre habilitado
2. **Editar** - Habilitado solo con selección
3. **Eliminar** - Habilitado solo con selección
4. **Refrescar** - Siempre habilitado

**Función retornada: `updateToolbarState()`**
- Habilita/deshabilita botones según selección
- Llamada desde otros módulos (detail.js)

**Botón Editar - Acciones:**
1. Valida selección
2. Carga código de cliente
3. Entra en modo edición
4. Muestra panel de detalles

**Uso:**
```javascript
import { setupToolbar } from './toolbar.js';
const { updateToolbarState } = setupToolbar(table);
// Luego puedes llamar updateToolbarState() cuando cambies la selección
```

---

## 📋 **detail.js** - Panel de Detalles

### `setupRowClick(table, updateToolbarStateFn)`
**Tipo:** `function`
**Parámetros:**
- `table` (Tabulator) - Instancia de la tabla de movimientos
- `updateToolbarStateFn` (Function) - Función para actualizar toolbar

**Retorna:** `void`

**Propósito:** Configura el evento de clic en filas para mostrar detalles.

**Flujo al hacer clic en una fila:**
1. ✅ Sale del modo edición
2. ✅ Actualiza la selección
3. ✅ Carga fecha del movimiento
4. ✅ Carga número de orden
5. ✅ Carga información del cliente (normalizada)
6. ✅ Obtiene cilindros del backend
7. ✅ Renderiza tabla de cilindros
8. ✅ Muestra panel de detalles
9. ✅ Actualiza estado del toolbar

**Normalización de datos de cliente:**
```javascript
// Busca en múltiples ubicaciones
const codcli = data.codcli ||
              (data.tercero?.codcli) ||
              data.nit_tercero || '';

const nombreCliente = data.nombre_tercero ||
                     (data.tercero?.Nombre_tercero) ||
                     data.nomcomer || '';
```

**Uso:**
```javascript
import { setupRowClick } from './detail.js';
setupRowClick(table, updateToolbarState);
```

---

## 🔧 **cilindrosTable.js** - Tabla de Cilindros

### `renderCilindrosTabulator(bodies)`
**Tipo:** `function`
**Parámetros:**
- `bodies` (Array<Object>) - Array de cilindros del movimiento
  - `codigo_articulo` (string) - Código del cilindro
  - `cantidad` (number) - Cantidad
  - `precio_docto` (number) - Precio

**Retorna:** `void`

**Propósito:** Renderiza la tabla de cilindros para un movimiento seleccionado.

**Características:**
- ✅ Destruye tabla anterior (previene memory leaks)
- ✅ Altura responsiva (184px desktop, 150px móvil)
- ✅ Columnas: Código, Cantidad, Precio
- ✅ Sin paginación (muestra todos)
- ✅ Mensaje si no hay cilindros

**Uso:**
```javascript
import { renderCilindrosTabulator } from './cilindrosTable.js';

const cilindros = [
  { codigo_articulo: 'CIL001', cantidad: 5, precio_docto: 1500 },
  { codigo_articulo: 'CIL002', cantidad: 3, precio_docto: 2000 }
];
renderCilindrosTabulator(cilindros);
```

---

## 🔨 **utils.js** - Funciones Auxiliares

### `syncDetailHeights()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `void`

**Propósito:** Sincroniza las alturas del panel de detalles.

**Acción:** Establece `minHeight: 365px` en el placeholder para evitar saltos visuales.

**Uso:**
```javascript
import { syncDetailHeights } from './utils.js';
syncDetailHeights();
```

---

### `enterEditMode()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `void`

**Propósito:** Activa el modo de edición del movimiento.

**Acciones:**
1. ✅ Busca wrappers ocultos de campos cliente y cilindro
2. ✅ Los marca con `data-was-hidden="true"`
3. ✅ Remueve clase "hidden" para mostrarlos
4. ✅ Hace campo cliente editable
5. ✅ Enfoca campo cilindro

**Función interna: `toggleWrapper(id)`**
- Busca wrapper padre oculto
- Lo marca para restauración
- Lo muestra

**Uso:**
```javascript
import { enterEditMode } from './utils.js';
enterEditMode();
```

---

### `exitEditMode()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `void`

**Propósito:** Desactiva el modo de edición.

**Acciones:**
1. ✅ Busca elementos con `data-was-hidden="true"`
2. ✅ Les agrega clase "hidden"
3. ✅ Remueve atributo `data-was-hidden`
4. ✅ Campo cliente a solo lectura
5. ✅ Quita foco de campo cilindro

**Uso:**
```javascript
import { exitEditMode } from './utils.js';
exitEditMode();
```

---

### `showMovimientoDetalle()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `void`

**Propósito:** Muestra el panel de detalles del movimiento.

**Acciones:**
1. ✅ Muestra formulario de detalles
2. ✅ Muestra contenedor de cilindros
3. ✅ Oculta placeholder
4. ✅ Oculta títulos de ayuda
5. ✅ Sincroniza alturas

**Uso:**
```javascript
import { showMovimientoDetalle } from './utils.js';
showMovimientoDetalle();
```

---

## 👥 **clientesModal.js** - Modal de Clientes

### `setupClientesModal()`
**Tipo:** `function`
**Parámetros:** Ninguno
**Retorna:** `void`

**Propósito:** Configura el modal de búsqueda y selección de clientes.

**Características:**
- ✅ Carga lista de clientes desde `/terceros`
- ✅ Tabla Tabulator con columnas: Código, Nombre
- ✅ Selección por clic
- ✅ Autocompletar campos del formulario
- ✅ Cierre por botón o clic fuera

**Flujo al abrir modal:**
1. Muestra el modal
2. Carga clientes desde servidor
3. Destruye tabla anterior si existe
4. Crea nueva tabla Tabulator
5. Configura evento de selección

**Flujo al seleccionar cliente:**
1. Obtiene datos del cliente
2. Llena campo de código
3. Llena campo de información
4. Cierra modal automáticamente

**Eventos configurados:**
- **rowClick** - Selecciona cliente y cierra modal
- **cerrarClienteModal click** - Cierra sin seleccionar
- **clienteModal click (overlay)** - Cierra si clic fuera del contenido

**Uso:**
```javascript
import { setupClientesModal } from './clientesModal.js';
setupClientesModal();
```

---

## 🔄 Flujo de Datos Entre Funciones

```
┌─────────────────────────────────────────┐
│ initMovimientos()                       │ ← Punto de entrada
└──────────────┬──────────────────────────┘
               │
               ├─→ createMovimientosTable() → Tabla principal
               │   └─→ ajaxResponse() → Normaliza datos
               │
               ├─→ setupSearch(table)
               │   ├─→ applySearch() → Recarga datos
               │   └─→ setSelectedRowData(null) → Limpia estado
               │
               ├─→ setupToolbar(table)
               │   ├─→ updateToolbarState() → Habilita/deshabilita botones
               │   ├─→ enterEditMode() → Modo edición
               │   └─→ showMovimientoDetalle() → Muestra panel
               │
               ├─→ setupRowClick(table, updateToolbarState)
               │   ├─→ exitEditMode() → Sale de edición
               │   ├─→ setSelectedRowData(data) → Guarda selección
               │   ├─→ fetch(/movimientos/{docto}) → Obtiene cilindros
               │   ├─→ renderCilindrosTabulator() → Tabla cilindros
               │   ├─→ showMovimientoDetalle() → Muestra detalles
               │   └─→ updateToolbarStateFn() → Actualiza toolbar
               │
               ├─→ setupClientesModal()
               │   ├─→ fetch(/terceros) → Carga clientes
               │   └─→ Tabulator → Tabla modal
               │
               └─→ syncDetailHeights() → Ajusta alturas
```

---

## 📦 Dependencias Entre Módulos

```
index.js
  ↓
  ├── movimientosTable.js (Tabulator)
  ├── search.js → utils.js (debounce), state.js
  ├── toolbar.js → utils.js, state.js
  ├── detail.js → cilindrosTable.js, state.js, utils.js
  ├── clientesModal.js (Tabulator)
  └── utils.js
```

---

## 🎯 Resumen de Responsabilidades

| Módulo | Responsabilidad Principal | Funciones Exportadas |
|--------|---------------------------|---------------------|
| **index.js** | Orquestación | `initMovimientos()` |
| **state.js** | Estado compartido | `selectedRowData()`, `setSelectedRowData()` |
| **movimientosTable.js** | Tabla principal | `createMovimientosTable()` |
| **cilindrosTable.js** | Tabla cilindros | `renderCilindrosTabulator()` |
| **search.js** | Búsqueda | `setupSearch()` |
| **toolbar.js** | Botones acción | `setupToolbar()` |
| **detail.js** | Panel detalles | `setupRowClick()` |
| **clientesModal.js** | Modal clientes | `setupClientesModal()` |
| **utils.js** | Utilidades | `syncDetailHeights()`, `enterEditMode()`, `exitEditMode()`, `showMovimientoDetalle()` |

---

## 🔐 Variables Privadas

### state.js
- `_selectedRowData` - Datos de fila seleccionada (privada)

### cilindrosTable.js
- `cilindrosTabulator` - Instancia de tabla cilindros (privada)

### clientesModal.js
- `clientesTabulator` - Instancia de tabla clientes (privada)

---

## 📚 Convenciones Utilizadas

1. **JSDoc** - Documentación estándar de JavaScript
2. **Nombres descriptivos** - Funciones y variables autoexplicativas
3. **Comentarios inline** - Explicaciones paso a paso
4. **Modularidad** - Una responsabilidad por módulo
5. **Encapsulación** - Variables privadas con closure
6. **Exports nombrados** - Facilita tree-shaking

---

## 🚀 Próximos Pasos

Para mejorar aún más la documentación:

1. ✅ Agregar ejemplos de uso completos
2. ✅ Documentar tipos con TypeScript (opcional)
3. ✅ Crear tests unitarios
4. ✅ Agregar diagramas de secuencia
5. ✅ Documentar APIs del backend

---

**Fecha de última actualización:** Octubre 1, 2025
**Versión:** 1.0.0
**Autor:** Sistema Modularizado de Movimientos
