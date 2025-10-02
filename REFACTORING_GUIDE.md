# Refactorización del Controlador MovimientoCilindroController

## 🎯 Mejoras Aplicadas según Buenas Prácticas de Laravel

### **1. Separación de Responsabilidades (SRP - Single Responsibility Principle)**

#### **Antes:** ❌

```php
public function store(Request $request) {
    // 130+ líneas de código
    // Validación, lógica de negocio, DB, todo mezclado
}
```

#### **Ahora:** ✅

```php
// Controlador: Solo coordina y delega
public function store(StoreMovimientoRequest $request) {
    $movimiento = $this->movimientoService->createMovimiento($request->validated());
    return response()->json(['success' => true, 'data' => $movimiento], 201);
}
```

### **2. Form Request para Validación**

#### **Archivo:** `app/Http/Requests/StoreMovimientoRequest.php`

✅ **Ventajas:**

-   Validación separada del controlador
-   Reutilizable en otros lugares
-   Mensajes de error personalizados
-   Fácil de testear
-   Autorización incluida

```php
class StoreMovimientoRequest extends FormRequest
{
    public function rules(): array {
        return [
            'fecha' => ['required', 'date', 'before_or_equal:today'],
            'codcli' => ['required', 'string', 'max:20'],
            // ... más reglas
        ];
    }
}
```

### **3. Service Layer para Lógica de Negocio**

#### **Archivo:** `app/Services/MovimientoService.php`

✅ **Ventajas:**

-   Lógica de negocio centralizada
-   Reutilizable desde múltiples controladores
-   Fácil de testear con mocks
-   Manejo de transacciones centralizado
-   Métodos privados para encapsular complejidad

```php
class MovimientoService
{
    public function createMovimiento(array $data): array {
        DB::beginTransaction();
        try {
            $docto = $this->generateConsecutivo();
            $jsonCabecera = $this->buildCabeceraJson($docto, $data);
            $jsonMovimientos = $this->buildMovimientosJson($docto, $data['cilindros']);
            $this->executeInsertUpdate($jsonCabecera, $jsonMovimientos);
            DB::commit();
            return ['docto' => $docto, ...];
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception('Error al crear el movimiento: ' . $e->getMessage());
        }
    }
}
```

### **4. Dependency Injection**

#### **Antes:** ❌

```php
class MovimientoCilindroController extends Controller {
    public function store() {
        // Lógica directamente en el método
    }
}
```

#### **Ahora:** ✅

```php
class MovimientoCilindroController extends Controller {
    protected MovimientoService $movimientoService;

    public function __construct(MovimientoService $movimientoService) {
        $this->movimientoService = $movimientoService;
    }
}
```

### **5. Constantes para Valores Fijos**

#### **Antes:** ❌

```php
"sucursal" => "01",
"transac_docto" => "INC",
// Valores hardcodeados repetidos por todas partes
```

#### **Ahora:** ✅

```php
private const SUCURSAL = '01';
private const TRANSACCION = 'INC';
private const TIPO = 'E';
private const PREFIJO = 'IN';
```

### **6. Métodos Pequeños y Bien Nombrados**

✅ Cada método tiene una responsabilidad clara:

-   `generateConsecutivo()` - Genera número de documento
-   `buildCabeceraJson()` - Construye JSON de cabecera
-   `buildMovimientosJson()` - Construye JSON de movimientos
-   `executeInsertUpdate()` - Ejecuta stored procedure

### **7. Manejo de Errores Mejorado**

```php
try {
    $movimiento = $this->movimientoService->createMovimiento($request->validated());
    return response()->json(['success' => true, 'data' => $movimiento], 201);
} catch (\Exception $e) {
    return response()->json([
        'success' => false,
        'message' => 'Error al crear el movimiento',
        'error' => $e->getMessage()
    ], 500);
}
```

## 📊 Comparación de Tamaño

| Archivo            | Antes      | Ahora                |
| ------------------ | ---------- | -------------------- |
| **Controller**     | 130 líneas | 25 líneas            |
| **Validación**     | Mezclada   | 72 líneas (separada) |
| **Lógica Negocio** | Mezclada   | 178 líneas (Service) |
| **Total**          | 130 líneas | 275 líneas           |

**¿Por qué más líneas?** Porque ahora está **bien organizado**, **mantenible** y **testeable**.

## 🧪 Ventajas para Testing

```php
// Ahora puedes hacer unit tests fácilmente:
public function test_create_movimiento() {
    $mockService = Mockery::mock(MovimientoService::class);
    $mockService->shouldReceive('createMovimiento')
        ->once()
        ->andReturn(['docto' => 'IN00000001']);

    $this->app->instance(MovimientoService::class, $mockService);

    $response = $this->post('/api/movimientos', $data);
    $response->assertStatus(201);
}
```

## 🔄 Flujo Actual

```
Request
  ↓
StoreMovimientoRequest (Validación)
  ↓
MovimientoCilindroController::store()
  ↓
MovimientoService::createMovimiento()
  ↓
  ├─ generateConsecutivo()
  ├─ buildCabeceraJson()
  ├─ buildMovimientosJson()
  └─ executeInsertUpdate()
  ↓
Response JSON
```

## 🚀 Próximos Pasos Recomendados

1. ✅ Implementar `update()` y `destroy()` siguiendo el mismo patrón
2. ✅ Crear Resources para formatear respuestas JSON
3. ✅ Implementar Policies para autorización
4. ✅ Agregar Tests unitarios y de integración
5. ✅ Implementar Repository Pattern si la lógica de BD crece
6. ✅ Agregar logging para auditoría

## 📝 Ejemplo de Uso

```php
POST /api/movimientos
{
    "fecha": "2025-10-02",
    "codcli": "8740372",
    "observaciones": "Ingreso de cilindros",
    "cilindros": [{
        "codigo_articulo": "1017",
        "detalle": "CILINDRO",
        "cantidad": 1.000,
        "precio_docto": 1800.00,
        "costo_promedio": 1200.00,
        "bodega": "1"
    }]
}
```

**Respuesta:**

```json
{
    "success": true,
    "message": "Movimiento creado exitosamente",
    "data": {
        "docto": "IN00000001",
        "fecha": "2025-10-02",
        "codcli": "8740372"
    }
}
```
