# Módulo de Movimientos - Estructura Modularizada

## 📁 Estructura de Archivos

```
modules/movimientos/
├── index.js              # Punto de entrada y orquestador
├── state.js              # Gestión del estado compartido
├── movimientosTable.js   # Configuración de la tabla principal
├── cilindrosTable.js     # Tabla de cilindros (detalle)
├── search.js             # Lógica de búsqueda
├── toolbar.js            # Gestión de botones de acción
├── detail.js             # Manejo de clic en filas y detalles
├── clientesModal.js      # Modal de selección de clientes
└── utils.js              # Funciones auxiliares
```

## 🔄 Flujo de Datos

```
┌─────────────┐
│  index.js   │  ← Punto de entrada
└──────┬──────┘
       │
       ├─→ createMovimientosTable() ──→ movimientosTable.js
       ├─→ setupSearch()           ──→ search.js
       ├─→ setupToolbar()          ──→ toolbar.js
       ├─→ setupRowClick()         ──→ detail.js
       ├─→ setupClientesModal()    ──→ clientesModal.js
       └─→ syncDetailHeights()     ──→ utils.js
```

## 📋 Responsabilidades por Módulo

### `index.js`
- **Responsabilidad**: Inicializar y coordinar todos los módulos
- **Exporta**: `initMovimientos()`
- **Funciones**:
  - Crea la tabla principal
  - Configura búsqueda, toolbar, eventos de clic
  - Inicializa modal de clientes
  - Maneja el resize de la ventana

### `state.js`
- **Responsabilidad**: Gestionar el estado compartido entre módulos
- **Exporta**:
  - `selectedRowData()` - Obtener fila seleccionada
  - `setSelectedRowData(data)` - Establecer fila seleccionada
- **Estado**:
  - `_selectedRowData` - Datos de la fila actualmente seleccionada

### `movimientosTable.js`
- **Responsabilidad**: Configurar la tabla principal de movimientos
- **Exporta**: `createMovimientosTable()`
- **Características**:
  - Configuración de columnas
  - Paginación remota
  - Normalización de datos de respuesta
  - Formateo de fechas

### `cilindrosTable.js`
- **Responsabilidad**: Renderizar tabla de cilindros en el detalle
- **Exporta**: `renderCilindrosTabulator(bodies)`
- **Características**:
  - Destruye instancia anterior
  - Altura responsiva
  - Muestra mensaje si no hay datos

### `search.js`
- **Responsabilidad**: Gestionar búsqueda y filtrado
- **Exporta**: `setupSearch(table)`
- **Características**:
  - Búsqueda con debounce (350ms)
  - Botón de limpiar búsqueda
  - Resetea selección al buscar

### `toolbar.js`
- **Responsabilidad**: Gestionar botones de acción (crear, editar, eliminar, refrescar)
- **Exporta**: `setupToolbar(table)`
- **Retorna**: `{ updateToolbarState }` - Función para actualizar estado de botones
- **Características**:
  - Habilita/deshabilita botones según selección
  - Maneja modo edición
  - Valida selección antes de acciones

### `detail.js`
- **Responsabilidad**: Manejar clic en filas y mostrar detalles
- **Exporta**: `setupRowClick(table, updateToolbarStateFn)`
- **Características**:
  - Sale del modo edición al cambiar de fila
  - Actualiza campos de fecha, orden, cliente
  - Carga cilindros del backend
  - Normaliza datos de cliente (codcli, nombre_tercero)
  - Notifica al toolbar para actualizar estado

### `clientesModal.js`
- **Responsabilidad**: Gestionar modal de búsqueda de clientes
- **Exporta**: `setupClientesModal()`
- **Características**:
  - Carga lista de clientes desde `/terceros`
  - Tabla con búsqueda de clientes
  - Selección por clic
  - Actualiza campos cliente e infoCliente
  - Cierre por botón o clic fuera

### `utils.js`
- **Responsabilidad**: Funciones auxiliares compartidas
- **Exporta**:
  - `syncDetailHeights()` - Ajustar alturas del panel de detalle
  - `enterEditMode()` - Entrar en modo edición
  - `exitEditMode()` - Salir del modo edición
  - `showMovimientoDetalle()` - Mostrar panel de detalle

## 🔗 Dependencias entre Módulos

```
index.js
  ↓
  ├── movimientosTable.js ──→ Tabulator
  ├── search.js ──→ utils.js (debounce), state.js
  ├── toolbar.js ──→ utils.js, state.js
  ├── detail.js ──→ cilindrosTable.js, state.js, utils.js
  ├── clientesModal.js ──→ Tabulator
  └── utils.js
```

## 🚀 Uso

```javascript
// En tabs-system.js o donde se inicialice
import { initMovimientos } from './modules/movimientos/index.js';

// Inicializar cuando el contenido del tab esté cargado
await initMovimientos();
```

## ✅ Beneficios de la Modularización

1. **Separación de Responsabilidades**: Cada archivo tiene un propósito único y claro
2. **Facilidad de Mantenimiento**: Cambios localizados en archivos específicos
3. **Reutilización**: Funciones y componentes pueden reutilizarse
4. **Testabilidad**: Más fácil probar módulos individuales
5. **Legibilidad**: Archivos más pequeños y enfocados
6. **Escalabilidad**: Fácil agregar nuevas funcionalidades

## 🔧 Mejoras Implementadas

- ✅ Corregidos imports entre módulos
- ✅ Eliminada duplicación de listener `rowClick`
- ✅ Estado compartido centralizado en `state.js`
- ✅ Limpieza de selección al buscar
- ✅ Comunicación entre toolbar y detail mediante callback
- ✅ Modal de clientes en módulo separado
- ✅ Normalización consistente de datos de cliente
- ✅ Gestión de modo edición centralizada

## 📝 Notas

- El archivo original `movimientos.js` se mantiene como referencia
- La migración es transparente para el usuario
- Todos los módulos usan ES6 modules
- Compatible con Vite y el sistema de tabs existente
