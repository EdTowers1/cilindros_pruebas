# Implementación del Campo Consecutivo en Modal de Creación

## Resumen

Se implementó la funcionalidad para obtener automáticamente el número consecutivo y la fecha actual al abrir el modal de creación de movimientos.

## Cambios Realizados

### 1. Backend (PHP/Laravel)

#### MovimientoService.php

-   **Nuevo método público**: `getConsecutivo()`
    -   Expone el método privado `generateConsecutivo()` para uso externo
    -   Llama al stored procedure `usp_consecutivo_read` con los parámetros:
        -   `codigo_sucursal`: '01'
        -   `tipo_transaccion`: 'INC'
        -   `ceros_izquierda`: 1
    -   Retorna el número consecutivo generado

```php
public function getConsecutivo(): string
{
    return $this->generateConsecutivo();
}
```

#### MovimientoCilindroController.php

-   **Nuevo endpoint**: `getConsecutivo()`
    -   Ruta: `GET /movimientos/consecutivo`
    -   Respuesta JSON:
        ```json
        {
            "success": true,
            "data": {
                "consecutivo": "IN0001234",
                "fecha": "2025-10-02"
            }
        }
        ```
    -   Obtiene el consecutivo del servicio
    -   Incluye la fecha actual en formato Y-m-d

```php
public function getConsecutivo()
{
    try {
        $consecutivo = $this->movimientoService->getConsecutivo();
        $fechaActual = now()->format('Y-m-d');

        return response()->json([
            'success' => true,
            'data' => [
                'consecutivo' => $consecutivo,
                'fecha' => $fechaActual
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener el consecutivo',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

#### routes/web.php

-   **Nueva ruta registrada**:
    ```php
    Route::get('/consecutivo', 'getConsecutivo')->name('movimientos.consecutivo');
    ```
    -   **IMPORTANTE**: La ruta `/consecutivo` debe estar ANTES de `/{movimiento}` para evitar conflictos
    -   Protegida por middleware `auth`

### 2. Frontend (JavaScript)

#### createModal.js

-   **Nueva función**: `loadConsecutivo()`
    -   Realiza fetch a `/movimientos/consecutivo`
    -   Maneja errores con toast notifications
    -   Actualiza los campos del formulario:
        -   `#createOrden` → recibe el consecutivo
        -   `#createFecha` → recibe la fecha actual

```javascript
const loadConsecutivo = async () => {
    try {
        const response = await fetch("/movimientos/consecutivo", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener el consecutivo");
        }

        const result = await response.json();

        if (result.success) {
            document.getElementById("createOrden").value =
                result.data.consecutivo;
            document.getElementById("createFecha").value = result.data.fecha;
        } else {
            showToast("Error al obtener el consecutivo", "error");
        }
    } catch (error) {
        console.error("Error al cargar consecutivo:", error);
        showToast("Error al cargar el número de orden", "error");
    }
};
```

-   **Modificación en `openModal()`**:
    -   Ahora es `async`
    -   Llama a `loadConsecutivo()` después de resetear el formulario
    -   Espera la carga del consecutivo con `await`

```javascript
const openModal = async () => {
    resetForm();
    modal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    await loadConsecutivo();
};
```

-   **Actualización en `resetForm()`**:
    -   Limpia los campos `createOrden` y `createFecha`

### 3. Vista (Blade)

#### create-modal.blade.php

Los campos ya están configurados como `readonly`:

-   **Campo Orden**: `#createOrden`

    -   `readonly`, `required`
    -   Placeholder: "Auto"
    -   Background gris para indicar no editable

-   **Campo Fecha**: `#createFecha`
    -   `readonly`, `required`, `aria-readonly="true"`
    -   `pointer-events-none` para deshabilitar el datepicker
    -   Background gris para indicar no editable

## Flujo de Funcionamiento

1. **Usuario hace clic en "Crear Movimiento"**
2. **Se abre el modal** (`openModal()`)
3. **Se resetea el formulario** (`resetForm()`)
4. **Se llama automáticamente a** `loadConsecutivo()`
5. **El backend consulta** el stored procedure `usp_consecutivo_read`
6. **Se recibe la respuesta** con consecutivo y fecha
7. **Se populan los campos** `#createOrden` y `#createFecha`
8. **El usuario completa** cliente, observaciones y cilindros
9. **Al enviar**, el consecutivo ya está en el formulario

## Manejo de Errores

-   **Error en el servidor**: Toast de error + log en consola
-   **Error de red**: Toast de error + log en consola
-   **Consecutivo no disponible**: Respuesta 500 del backend

## Testing Recomendado

1. ✅ Abrir modal y verificar que el campo orden se llena automáticamente
2. ✅ Verificar que la fecha se establece correctamente
3. ✅ Intentar editar los campos (deben estar bloqueados)
4. ✅ Cerrar y reabrir el modal (debe generar nuevo consecutivo)
5. ✅ Simular error del servidor (verificar toast de error)
6. ✅ Crear un movimiento completo y verificar que el consecutivo se envía correctamente

## Notas Importantes

-   El consecutivo se genera CADA VEZ que se abre el modal
-   Los campos orden y fecha son de solo lectura pero sus valores SE ENVÍAN en el formulario
-   El stored procedure debe estar disponible en la base de datos
-   La ruta `/consecutivo` debe estar antes de `/{movimiento}` en el archivo de rutas
-   El endpoint está protegido por autenticación

## Archivos Modificados

1. `app/Services/MovimientoService.php` - Método público getConsecutivo()
2. `app/Http/Controllers/MovimientoCilindroController.php` - Endpoint getConsecutivo()
3. `routes/web.php` - Nueva ruta GET /movimientos/consecutivo
4. `resources/js/modules/movimientos/createModal.js` - Función loadConsecutivo()
5. `resources/views/tabs/movimientos/create-modal.blade.php` - Campos readonly

## Próximos Pasos (Opcional)

-   Agregar loading spinner mientras se carga el consecutivo
-   Implementar retry logic en caso de fallo temporal
-   Cachear el consecutivo por un tiempo determinado
-   Agregar validación adicional en el backend
