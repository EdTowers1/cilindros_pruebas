<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MovimientoCilindro;
use Illuminate\Support\Facades\DB;

class MovimientoCilindroController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $query = MovimientoCilindro::with(['cliente', 'cilindros']);
        if ($q = $request->query('q')) {
            $query->where(function ($qry) use ($q) {
                $qry->where('tipo', 'like', "%{$q}%")
                    ->orWhereHas('cliente', function ($qc) use ($q) {
                        $qc->where('nombre', 'like', "%{$q}%");
                    });
            });
        }

        $result = $query->orderBy('fecha', 'desc')->paginate($perPage);
        return response()->json($result);
    }

    public function show(MovimientoCilindro $movimiento)
    {
        $movimiento->load(['cliente', 'cilindros']);
        return response()->json($movimiento);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'tipo' => 'required|string|max:50',
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string',
            'cilindros' => 'required|array|min:1',
            'cilindros.*.cilindro_id' => 'required|exists:cilindros,id',
            'cilindros.*.cantidad' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $mov = MovimientoCilindro::create([
                'cliente_id' => $data['cliente_id'],
                'tipo' => $data['tipo'],
                'fecha' => $data['fecha'],
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            $attach = [];
            foreach ($data['cilindros'] as $c) {
                $attach[$c['cilindro_id']] = ['cantidad' => $c['cantidad']];
            }
            $mov->cilindros()->attach($attach);

            DB::commit();
            return response()->json($mov->load(['cliente', 'cilindros']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear movimiento', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, MovimientoCilindro $movimiento)
    {
        $data = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'tipo' => 'required|string|max:50',
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string',
            'cilindros' => 'nullable|array',
            'cilindros.*.cilindro_id' => 'required_with:cilindros|exists:cilindros,id',
            'cilindros.*.cantidad' => 'required_with:cilindros|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $movimiento->update([
                'cliente_id' => $data['cliente_id'],
                'tipo' => $data['tipo'],
                'fecha' => $data['fecha'],
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            if (!empty($data['cilindros'])) {
                $sync = [];
                foreach ($data['cilindros'] as $c) {
                    $sync[$c['cilindro_id']] = ['cantidad' => $c['cantidad']];
                }
                $movimiento->cilindros()->sync($sync);
            }

            DB::commit();
            return response()->json($movimiento->load(['cliente', 'cilindros']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar movimiento', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(MovimientoCilindro $movimiento)
    {
        DB::beginTransaction();
        try {
            $movimiento->cilindros()->detach();
            $movimiento->delete();
            DB::commit();
            return response()->json(['message' => 'Movimiento eliminado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar movimiento', 'error' => $e->getMessage()], 500);
        }
    }
}
