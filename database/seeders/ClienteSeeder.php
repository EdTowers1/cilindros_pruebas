<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cliente;
use Illuminate\Support\Str;


class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');

        for ($i = 0; $i < 15; $i++) {
            // generar una identificación única (ej: número o RUC/Cédula)
            $ident = $faker->unique()->numerify('##########');

            Cliente::create([
                'codigo' => $ident,
                'nombre' => $faker->name(),
                'identificacion' => $ident,
                'direccion' => $faker->address(),
                'telefono' => $faker->phoneNumber(),
                'email' => $faker->optional()->safeEmail(),
            ]);
        }
    }
}
