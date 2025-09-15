<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tercero extends Model
{
    /**
     * Tabla existente
     * @var string
     */
    protected $table = 'm_terceros';

    /**
     * Primary key
     * @var string
     */
    protected $primaryKey = 'row_id';

    /**
     * No usar timestamps de Eloquent
     * @var bool
     */
    public $timestamps = false;

    /**
     * Fillable
     * @var array
     */
    protected $fillable = [
        'codcli','regimen','perjurid','nomcli1','nomcli2','apellcli1','apellcli2','Nombre_tercero',
        'nomcomer','tipcli','tipo_tercero','tipo_identifica','nit_tercero','digver','direccion_tercero',
        'telefono_tercero','celular_tercero','email_tercero','codpostal','contacto_tercero','pais_tercero',
        'dpto_tercero','ciudad_tercero','matmerca','exento','NombreFe','EmailFe','TeleFe','CeluFe',
        'tresponsa','ttributo','fapertura','uapertura','inhabilitado','instante'
    ];

    /**
     * Casts
     * @var array
     */
    protected $casts = [
        'row_id' => 'integer',
        'regimen' => 'integer',
        'perjurid' => 'boolean',
        'tipo_tercero' => 'integer',
        'tipo_identifica' => 'integer',
        'exento' => 'boolean',
        'fapertura' => 'datetime',
        'inhabilitado' => 'boolean',
        'instante' => 'datetime',
    ];

    /**
     * Relación con DocumentoHeader
     */
    public function headers()
    {
        return $this->hasMany(DocumentoHeader::class, 'codcli', 'codcli');
    }
}
