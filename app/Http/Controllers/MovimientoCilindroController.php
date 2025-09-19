<?php

namespace App\Http\Controllers;

use App\Http\Filters\MovimientoCilindroFilter;
use App\Models\DocumentoHeader;
use Illuminate\Http\Request;

class MovimientoCilindroController extends Controller
{

    public function index(Request $request, MovimientoCilindroFilter $filters)
    {
        try {
            $page    = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 10);
            $perPage = in_array($perPage, [10, 15, 20]) ? $perPage : 10;

            // If frontend sends a generic `search` param, map it to the filter key `docto`
            if ($request->filled('search') && !$request->filled('docto')) {
                $request->merge(['docto' => $request->input('search')]);
            }

            // Build base query
            $query = DocumentoHeader::query()
                ->select('row_id', 'docto', 'fecha', 'codcli')
                ->with(['tercero' => fn($q) => $q->select('row_id', 'codcli', 'Nombre_tercero')]);

            // Apply filters from MovimientoCilindroFilter (methods like `docto` will be applied)
            $query = $filters->apply($query);

            $paginator = $query->orderBy('docto', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'data'        => $paginator->items(),
                'last_page'   => $paginator->lastPage(),
                'total'       => $paginator->total(),
                'current_page' => $paginator->currentPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Error al obtener los movimientos: ' . $e->getMessage()],
                500
            );
        }
    }

    public function show($docto)
    {
        try {
            $movimiento = DocumentoHeader::with(['tercero', 'bodies' => function ($q) {
                $q->orderBy('codigo_articulo');
            }])->where('docto', $docto)->first();

            if (!$movimiento) {
                return response()->json(['error' => 'Movimiento no encontrado'], 404);
            }

            // Acceso seguro a propiedades
            $movimiento->docto;
            $movimiento->fecha;
            $movimiento->codcli;
            if ($movimiento->tercero) {
                $movimiento->tercero->Nombre_tercero;
            }
            foreach ($movimiento->bodies as $b) {
                $b->codigo_articulo;
                $b->cantidad;
                $b->precio_docto;
            }

            return response()->json($movimiento);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Error al obtener los movimientos: ' . $e->getMessage()],
                500
            );
        }
    }

    
}
