<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentoHeader extends Model
{
	/**
	 * Nombre de la tabla existente
	 * @var string
	 */
	protected $table = 'm_docto_header';

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
	 * La tabla ya maneja sus propios timestamps/instantes, desactivamos timestamps automáticos de Eloquent
	 * @var bool
	 */
	public $timestamps = false;

	/**
	 * Atributos asignables (fillable) - incluir los campos que se usarán en asignación masiva
	 * @var array
	 */
	protected $fillable = [
		'transac_docto', 'tipo', 'prefijo', 'docto', 'tipo_factura',
		'fecha', 'hora', 'fecha_vence', 'codcli', 'docto_provee',
		'comprobante', 'codigo_vendedor', 'Observaciones', 'multiproposito',
		'fecha_transaccion', 'id_user', 'usuario', 'user_anulado',
		'anulado', 'fecha_anulado', 'instante'
	];

	/**
	 * Casts de atributos para facilitar manipulación
	 * @var array
	 */
	protected $casts = [
		'row_id' => 'integer',
		'fecha' => 'date',
		'fecha_vence' => 'date',
		'fecha_anulado' => 'date',
		'fecha_transaccion' => 'datetime',
		'instante' => 'datetime',
		'id_user' => 'integer',
		'user_anulado' => 'integer',
		'anulado' => 'boolean',
	];

	/**
	 * Mutator / accessor de ejemplo: obtener Observaciones como string vacía si es null
	 */
	public function getObservacionesAttribute($value)
	{
		return $value === null ? '' : $value;
	}

	public function tercero()
	{
		return $this->belongsTo(Tercero::class, 'codcli', 'codcli');
	}

	public function bodies()
	{
		return $this->hasMany(DocumentoBody::class, 'docto', 'docto')
					->orderBy('codigo_articulo');
	}
}
