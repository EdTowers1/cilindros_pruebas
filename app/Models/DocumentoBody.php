<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\DocumentoHeader;

class DocumentoBody extends Model
{
    /**
     * Nombre de la tabla existente
     * @var string
     */
    protected $table = 'm_docto_body';

    /**
     * Primary key de la tabla
     * @var string
     */
    protected $primaryKey = 'row_id';

    /**
     * La clave primaria es autoincremental (int)
     * @var bool
     */
    public $incrementing = true;

    /**
     * Tipo de la clave primaria
     * @var string
     */
    protected $keyType = 'int';

    /**
     * Desactivar timestamps automáticos de Eloquent
     * @var bool
     */
    public $timestamps = false;

    /**
     * Atributos asignables
     * @var array
     */
    protected $fillable = [
        'transac_docto', 'tipo', 'prefijo', 'docto', 'tipo_mov', 'codigo_articulo',
        'detalle', 'descrip_ampliada', 'cantidad', 'precio_docto', 'descto_docto',
        'vlr_base_descto', 'vlr_descto', 'iva_docto', 'vlr_baseiva', 'vlr_iva',
        'costo_promedio', 'bodega', 'codigo_concepto', 'id_user', 'usuario',
        'multiproposito', 'Fecha_transaccion', 'borrado', 'user_borrado', 'fecha_borrado', 'instante'
    ];

    /**
     * Casts de atributos
     * @var array
     */
    protected $casts = [
        'row_id' => 'integer',
        'cantidad' => 'decimal:3',
        'precio_docto' => 'decimal:2',
        'descto_docto' => 'decimal:2',
        'vlr_base_descto' => 'decimal:2',
        'vlr_descto' => 'decimal:2',
        'iva_docto' => 'decimal:2',
        'vlr_baseiva' => 'decimal:2',
        'vlr_iva' => 'decimal:2',
        'costo_promedio' => 'decimal:2',
        'id_user' => 'integer',
        'user_borrado' => 'integer',
        'borrado' => 'boolean',
        'Fecha_transaccion' => 'datetime',
        'fecha_borrado' => 'datetime',
        'instante' => 'datetime',
    ];

    /**
     * Accessor para descrip_ampliada
     */
    public function getDescripAmpliadaAttribute($value)
    {
        return $value === null ? '' : $value;
    }

    /**
     * Relación opcional hacia DocumentoHeader (no existe FK directa)
     * Relacionamos por transac_docto + docto si necesitas obtener el header desde el body
     */
    public function header()
    {
        return $this->belongsTo(DocumentoHeader::class, 'docto', 'docto');
    }
}
