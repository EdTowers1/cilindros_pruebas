<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'identificacion',
        'direccion',
        'telefono',
        'email',
    ];

    public function movimientos()
    {
        return $this->hasMany(MovimientoCilindro::class);
    }
}
