<?php

namespace App\Http\Controllers;

use App\Models\DocumentoBody;
use App\Models\DocumentoHeader;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class MovimientoCilindroController extends Controller
{

    public function index(Request $request)
    {
        try {
            $page    = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 10);
            $perPage = in_array($perPage, [10, 15, 20]) ? $perPage : 10;

            $paginator = DocumentoHeader::query()
                ->select('row_id', 'docto', 'fecha', 'codcli')
                ->with(['tercero' => fn($q) => $q->select('row_id', 'codcli', 'Nombre_tercero')])
                ->orderBy('docto', 'desc')
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
        $movimientos = DocumentoHeader::with(['tercero', 'bodies' => function ($q) {
            $q->orderBy('codigo_articulo');
        }])->where('docto', $docto)->get();

        $movimientos->docto;
        $movimientos->fecha;
        $movimientos->codcli;
        $movimientos->tercero->Nombre_tercero;
        foreach ($movimientos->bodies as $b) {
            $b->codigo_articulo;
            $b->cantidad;
            $b->precio_docto;
        }

        return response()->json($movimientos);
    }
}
