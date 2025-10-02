<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Exception;

class MovimientoService
{
    /**
     * Configuración por defecto
     */
    private const SUCURSAL = '01';
    private const TRANSACCION = 'INC';
    private const TIPO = 'E';
    private const PREFIJO = 'IN';

    /**
     * Crear un nuevo movimiento de cilindros
     *
     * @param array $data Datos validados del movimiento
     * @return array Información del movimiento creado
     * @throws Exception
     */
    public function createMovimiento(array $data): array
    {
        DB::beginTransaction();

        try {
            // 1. Generar número consecutivo
            $docto = $this->generateConsecutivo();

            // 2. Construir JSON de cabecera
            $jsonCabecera = $this->buildCabeceraJson($docto, $data);

            // 3. Construir JSON de movimientos (cilindros)
            $jsonMovimientos = $this->buildMovimientosJson($docto, $data['cilindros']);

            // 4. Ejecutar stored procedure
            $this->executeInsertUpdate($jsonCabecera, $jsonMovimientos);

            DB::commit();

            return [
                'docto' => $docto,
                'fecha' => $data['fecha'],
                'codcli' => $data['codcli'],
            ];
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception('Error al crear el movimiento: ' . $e->getMessage());
        }
    }

    /**
     * Obtener número consecutivo público (para API)
     *
     * @return string Número de documento generado
     * @throws Exception
     */
    public function getConsecutivo(): string
    {
        $raw = $this->generateConsecutivo();

        // If the stored procedure returns a JSON payload, try to decode and extract
        // the `documento_generado` field. Otherwise return the raw value.
        try {
            $decoded = json_decode($raw, true);
            if (is_array($decoded) && isset($decoded['documento_generado'])) {
                return (string) $decoded['documento_generado'];
            }
        } catch (\Throwable $e) {
            // ignore and fall through to return raw
        }

        return $raw;
    }

    /**
     * Generar número consecutivo usando stored procedure
     *
     * @return string Número de documento generado
     * @throws Exception
     */
    private function generateConsecutivo(): string
    {
        $input = json_encode([
            'codigo_sucursal' => self::SUCURSAL,
            'tipo_transaccion' => self::TRANSACCION,
            'ceros_izquierda' => 1
        ]);

        DB::select('CALL usp_consecutivo_read(?, @output)', [$input]);

        $result = DB::select('SELECT @output as docto');
        $consecutivo = $result[0]->docto ?? null;

        if (!$consecutivo) {
            throw new Exception('No se pudo generar el número de documento');
        }

        return $consecutivo;
    }

    /**
     * Construir JSON de cabecera del documento
     *
     * @param string $docto Número de documento
     * @param array $data Datos del movimiento
     * @return array
     */
    private function buildCabeceraJson(string $docto, array $data): array
    {
        return [
            "proceso" => "NEW",
            "row_id" => 0,
            "sucursal" => self::SUCURSAL,
            "transac_docto" => self::TRANSACCION,
            "tipo" => self::TIPO,
            "prefijo" => self::PREFIJO,
            "docto" => $docto,
            "tipo_factura" => "",
            "fecha" => $data['fecha'],
            "hora" => now()->format('H:i:s'),
            "fecha_vence" => "0000-00-00",
            "codcli" => $data['codcli'],
            "docto_provee" => $data['codcli'],
            "comprobante" => "",
            "codigo_vendedor" => "",
            "Observaciones" => $data['observaciones'] ?? "Documento de ingreso de cilindros",
            "multiproposito" => "",
            "fecha_transaccion" => now()->format('Y-m-d H:i:s'),
            "id_user" => 1,
            "usuario" => "ADMIN"
        ];
    }

    /**
     * Construir JSON de movimientos (cilindros)
     *
     * @param string $docto Número de documento
     * @param array $cilindros Lista de cilindros
     * @return array
     */
    private function buildMovimientosJson(string $docto, array $cilindros): array
    {
        $movimientos = [];

        foreach ($cilindros as $cilindro) {
            $movimientos[] = [
                "row_id" => 0,
                "sucursal" => self::SUCURSAL,
                "transac_docto" => self::TRANSACCION,
                "tipo" => self::TIPO,
                "prefijo" => self::PREFIJO,
                "docto" => $docto,
                "tipo_mov" => self::TIPO,
                "codigo_articulo" => $cilindro['codigo_articulo'],
                "detalle" => $cilindro['detalle'],
                "descrip_ampliada" => "",
                "cantidad" => (float) $cilindro['cantidad'],
                "precio_docto" => (float) $cilindro['precio_docto'],
                "descto_docto" => 0.00,
                "vlr_base_descto" => 0.00,
                "vlr_descto" => 0.00,
                "iva_docto" => 0.00,
                "vlr_baseiva" => 0.00,
                "vlr_iva" => 0.00,
                "costo_promedio" => (float) $cilindro['costo_promedio'],
                "bodega" => $cilindro['bodega'],
                "codigo_concepto" => "",
                "id_user" => 1,
                "usuario" => "ADMIN",
                "multiproposito" => "",
                "Fecha_transaccion" => now()->format('Y-m-d H:i:s')
            ];
        }

        return $movimientos;
    }

    /**
     * Ejecutar stored procedure de insert/update
     *
     * @param array $cabecera
     * @param array $movimientos
     * @throws Exception
     */
    private function executeInsertUpdate(array $cabecera, array $movimientos): void
    {
        $jsonCabecera = json_encode($cabecera);
        $jsonMovimientos = json_encode($movimientos);

        DB::select('CALL usp_documentos_insert_update(?, ?)', [
            $jsonCabecera,
            $jsonMovimientos
        ]);
    }
}
