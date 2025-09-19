<?php

namespace App\Http\Controllers;

use App\Http\Filters\TerceroFilter;
use App\Models\Tercero;
use Illuminate\Http\Request;

class TerceroController extends Controller
{
    public function index(Request $request, TerceroFilter $filters)
    {
        try {
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 10);
            $perPage = in_array($perPage, [5, 10, 15, 20, 50]) ? $perPage : 10;

            $query = Tercero::query()->select('row_id', 'codcli', 'Nombre_tercero');

            // Apply filters (search, codcli, nombre) via TerceroFilter
            $query = $filters->apply($query);

            $paginator = $query->orderBy('Nombre_tercero')->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'data' => $paginator->items(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Error al obtener los terceros: ' . $e->getMessage()],
                500
            );
        }
    }
}
