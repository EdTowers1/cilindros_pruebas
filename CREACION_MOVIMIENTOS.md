# Sistema de Creación de Movimientos - Documentación

## 📋 Archivos Creados

### **1. Vista del Modal**

**Archivo:** `resources/views/tabs/movimientos/create-modal.blade.php`

Modal completo con:

-   ✅ Formulario de información general (cliente, fecha, observaciones)
-   ✅ Sección de cilindros con tabla dinámica
-   ✅ Botones de acción (guardar, cancelar)
-   ✅ Diseño responsive con Tailwind CSS
-   ✅ Iconos FontAwesome

### **2. Módulo JavaScript**

**Archivo:** `resources/js/modules/movimientos/createModal.js`

Funcionalidades:

-   ✅ Gestión de apertura/cierre del modal
-   ✅ Validación de formulario
-   ✅ Manejo de lista de cilindros (agregar/eliminar)
-   ✅ Integración con modal de clientes existente
-   ✅ Envío de datos al backend via API
-   ✅ Notificaciones toast para feedback
-   ✅ Cierre con tecla ESC

### **3. Utilidades Actualizadas**

**Archivo:** `resources/js/utils.js`

Nueva función añadida:

```javascript
showToast(type, message); // Notificaciones tipo toast
```

### **4. Integración**

**Archivos Modificados:**

-   `resources/views/tabs/movimientos/index.blade.php` - Incluye el modal
-   `resources/js/modules/movimientos/index.js` - Inicializa createModal
-   `resources/js/modules/movimientos/clientesModal.js` - Soporte multi-contexto
-   `resources/js/modules/movimientos/toolbar.js` - Limpieza de código

## 🔄 Flujo de Creación de Movimiento

```
1. Usuario hace clic en botón "Crear" (+)
   ↓
2. Se abre modal de creación
   ↓
3. Usuario hace clic en "Buscar Cliente"
   ↓
4. Se abre modal de selección de clientes (reutilizado)
   ↓
5. Usuario selecciona un cliente
   ↓
6. Datos del cliente se cargan en el formulario
   ↓
7. Usuario hace clic en "Agregar Cilindro"
   ↓
8. Usuario ingresa datos del cilindro (temporal con prompts)
   ↓
9. Cilindro se agrega a la tabla
   ↓
10. Usuario puede agregar más cilindros o eliminar existentes
    ↓
11. Usuario hace clic en "Guardar Movimiento"
    ↓
12. Validación del formulario:
    - ¿Tiene cliente?
    - ¿Tiene al menos un cilindro?
    - ¿Tiene fecha?
    ↓
13. Se envía POST a /api/movimientos
    ↓
14. Backend procesa y retorna respuesta
    ↓
15. Se muestra notificación de éxito/error
    ↓
16. Modal se cierra y tabla se refresca
```

## 📝 Estructura del Request

```json
{
    "fecha": "2025-10-02",
    "codcli": "8740372",
    "observaciones": "Ingreso de cilindros",
    "cilindros": [
        {
            "codigo_articulo": "1017",
            "detalle": "CILINDRO",
            "cantidad": 1.0,
            "precio_docto": 1800.0,
            "costo_promedio": 1200.0,
            "bodega": "1"
        }
    ]
}
```

## 🎨 Componentes del Modal

### **Sección 1: Información General**

-   **Cliente** (readonly + botón búsqueda)
-   **Información del Cliente** (textarea readonly)
-   **Fecha** (date input, por defecto hoy)
-   **Observaciones** (textarea opcional)

### **Sección 2: Cilindros**

-   **Tabla dinámica** con columnas:
    -   Código
    -   Detalle
    -   Cantidad
    -   Precio
    -   Costo
    -   Bodega
    -   Acciones (eliminar)
-   **Botón "Agregar Cilindro"**
-   **Mensaje cuando no hay cilindros**

### **Sección 3: Acciones**

-   **Guardar Movimiento** (azul, con loading state)
-   **Cancelar** (gris, cierra modal)

## 🔧 Funciones Principales

### `setupCreateModal(table)`

Inicializa todo el sistema del modal:

-   Event listeners
-   Estado inicial
-   Fecha por defecto

### `openModal()`

Abre el modal y resetea el formulario

### `closeModal()`

Cierra el modal y limpia el estado

### `resetForm()`

Limpia todos los campos y arrays de datos

### `renderCilindrosTable()`

Actualiza la tabla de cilindros dinámicamente

### `addCilindro()`

Agrega un nuevo cilindro a la lista

### `validateForm()`

Valida que todos los datos requeridos estén presentes

### `submitForm(e)`

Envía los datos al backend

## 🚀 Próximas Mejoras Recomendadas

### **1. Modal de Selección de Cilindros** ⭐⭐⭐

En lugar de usar `prompt()`, crear un modal similar al de clientes:

```javascript
// Archivo a crear: resources/js/modules/movimientos/cilindrosModal.js
- Tabla con lista de cilindros disponibles
- Búsqueda y filtrado
- Selección múltiple
- Campos editables (cantidad, precio, costo)
```

### **2. Validación Mejorada** ⭐⭐

```javascript
- Validar formato de números
- Validar rangos (cantidad > 0, precios >= 0)
- Validar cilindros duplicados
- Feedback visual en tiempo real
```

### **3. Estado de Carga** ⭐⭐

```javascript
- Skeleton loaders
- Deshabilitar inputs durante submit
- Progress indicators
```

### **4. Manejo de Errores Mejorado** ⭐⭐

```javascript
- Mostrar errores de validación del backend
- Resaltar campos con error
- Mensajes específicos por campo
```

### **5. Cálculos Automáticos** ⭐

```javascript
- Calcular totales (cantidad * precio)
- Mostrar resumen al final de la tabla
- Validar stock disponible
```

### **6. Autocompletado** ⭐

```javascript
- Autocompletar información de cilindros conocidos
- Sugerencias basadas en historial
- Precios sugeridos
```

## 🐛 Testing Checklist

-   [ ] Modal se abre al hacer clic en "Crear"
-   [ ] Modal se cierra con botón X
-   [ ] Modal se cierra con botón "Cancelar"
-   [ ] Modal se cierra con tecla ESC
-   [ ] Fecha por defecto es hoy
-   [ ] Botón "Buscar Cliente" abre modal de clientes
-   [ ] Seleccionar cliente llena los campos correctamente
-   [ ] Agregar cilindro funciona
-   [ ] Eliminar cilindro funciona
-   [ ] Validación impide guardar sin cliente
-   [ ] Validación impide guardar sin cilindros
-   [ ] Validación impide guardar sin fecha
-   [ ] Toast de éxito se muestra correctamente
-   [ ] Toast de error se muestra correctamente
-   [ ] Tabla se refresca después de crear
-   [ ] Formulario se resetea después de crear
-   [ ] Loading state se muestra durante submit

## 📱 Responsive Design

El modal está diseñado para ser completamente responsive:

-   ✅ **Desktop:** Modal centrado, ancho máximo 4xl
-   ✅ **Tablet:** Se adapta al ancho de pantalla
-   ✅ **Mobile:** Stack vertical de campos, modal full-width

## 🎯 Estado Actual

### ✅ Implementado

-   Modal de creación completo
-   Integración con modal de clientes
-   Sistema de validación básico
-   Notificaciones toast
-   Tabla dinámica de cilindros
-   API integration

### 🚧 En Desarrollo

-   Modal de selección de cilindros
-   Validación avanzada
-   Cálculos automáticos

### 📋 Por Implementar

-   Tests automatizados
-   Documentación de API
-   Manejo de permisos/roles
