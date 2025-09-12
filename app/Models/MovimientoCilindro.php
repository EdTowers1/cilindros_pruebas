<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MovimientoCilindro extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'tipo',   // entrega, devolución, venta, préstamo, etc.
        'fecha',
        'observaciones',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function cilindros()
    {
        return $this->belongsToMany(Cilindro::class, 'movimiento_cilindro_detalle', 'movimiento_cilindro_id', 'cilindro_id')
            ->withPivot('cantidad')
            ->withTimestamps();
    }
}
