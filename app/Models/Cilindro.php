<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cilindro extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'capacidad',
        'estado', // disponible, en uso, en reparación, etc.
    ];

    public function movimientos()
    {
        return $this->belongsToMany(MovimientoCilindro::class, 'movimiento_cilindro_detalle', 'cilindro_id', 'movimiento_cilindro_id')
            ->withPivot('cantidad')
            ->withTimestamps();
    }
}
