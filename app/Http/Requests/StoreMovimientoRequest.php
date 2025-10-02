<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMovimientoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Ajustar según política de autorización
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fecha' => ['required', 'date', 'before_or_equal:today'],
            'codcli' => ['required', 'string', 'max:20'],
            'observaciones' => ['nullable', 'string', 'max:500'],
            'cilindros' => ['required', 'array', 'min:1'],
            'cilindros.*.codigo_articulo' => ['required', 'string', 'max:20'],
            'cilindros.*.detalle' => ['required', 'string', 'max:100'],
            'cilindros.*.cantidad' => ['required', 'numeric', 'min:0.001', 'max:9999.999'],
            'cilindros.*.precio_docto' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'cilindros.*.costo_promedio' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'cilindros.*.bodega' => ['required', 'string', 'max:10'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'fecha.required' => 'La fecha es obligatoria',
            'fecha.date' => 'La fecha debe ser válida',
            'fecha.before_or_equal' => 'La fecha no puede ser futura',
            'codcli.required' => 'El código del cliente es obligatorio',
            'cilindros.required' => 'Debe agregar al menos un cilindro',
            'cilindros.min' => 'Debe agregar al menos un cilindro',
            'cilindros.*.codigo_articulo.required' => 'El código del artículo es obligatorio',
            'cilindros.*.cantidad.required' => 'La cantidad es obligatoria',
            'cilindros.*.cantidad.min' => 'La cantidad debe ser mayor a 0',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'codcli' => 'código del cliente',
            'cilindros.*.codigo_articulo' => 'código del artículo',
            'cilindros.*.detalle' => 'detalle',
            'cilindros.*.cantidad' => 'cantidad',
            'cilindros.*.precio_docto' => 'precio',
            'cilindros.*.costo_promedio' => 'costo promedio',
            'cilindros.*.bodega' => 'bodega',
        ];
    }
}
