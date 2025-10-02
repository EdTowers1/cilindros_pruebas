<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MovimientoCilindroController extends Controller
{

    public function index(Request $request)
    {
        try {
            $page = (int) $request->input('page', 1);
            $perPage = (int) $request->input('per_page', 10);
            // $perPage = in_array($perPage, [10, 15, 20]) ? $perPage : 10;

            // If frontend sends a generic `search` param, map it to the filter key `docto`
            $searchData = '';
            if ($request->filled('search') && !$request->filled('docto')) {
                $searchData = $request->input('search');
            } elseif ($request->filled('docto')) {
                $searchData = $request->input('docto');
            }

            // Call stored procedure
            $params = [
                $perPage,      // nPageSize
                $page,         // nPageNumber
                'INC',         // cTransac
                '01',          // cSucursal
                $searchData,   // cSearchData
                0,             // nSearExact
                'docto',       // cSortBy
                'D',           // cSortDirection (D for desc)
            ];

            $results = DB::select('CALL usp_documentos_lista(?, ?, ?, ?, ?, ?, ?, ?, @page_count)', $params);

            // Get the output parameter @page_count (assuming it's total pages)
            $pageCountResult = DB::select('SELECT @page_count as page_count');
            $totalPages = $pageCountResult[0]->page_count ?? 1;

            // Approximate total records (totalPages * perPage), but this may not be accurate if last page is partial
            $totalRecords = $totalPages * $perPage;

            return response()->json([
                'data' => $results,
                'last_page' => $totalPages,
                'total' => $totalRecords,
                'current_page' => $page,
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
            $params = [
                '01',          // cSucursal
                'INC',         // cTransac
                $docto,       // docto
            ];

            // Get bodies via stored procedure
            $bodies = DB::select('CALL usp_documentos_body_lista(?, ?, ?)', $params);

            $header = $bodies[0];

            // Construct the movimiento object
            $movimiento = [
                'docto' => $header->docto,
                'fecha' => $header->fecha,
                'codcli' => $header->nit_tercero,
                'tercero' => [
                    'nit' => $header->nit_tercero,
                    'nombre_tercero' => $header->nombre_tercero,
                ],
                'bodies' => $bodies,
            ];

            return response()->json($movimiento);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Error al obtener los movimientos: ' . $e->getMessage()],
                500
            );
        }
    }

}
