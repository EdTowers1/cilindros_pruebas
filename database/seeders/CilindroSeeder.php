<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cilindro;

class CilindroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');

        $estados = ['disponible', 'asignado', 'mantenimiento'];

        for ($i = 0; $i < 20; $i++) {
            Cilindro::create([
                'codigo' => $faker->unique()->bothify('CL-#####'),
                'capacidad' => $faker->randomElement([5, 10, 15, 20, 40]),
                'estado' => $faker->randomElement($estados),
            ]);
        }
    }
}
