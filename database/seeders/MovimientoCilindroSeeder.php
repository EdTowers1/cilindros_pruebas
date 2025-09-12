<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MovimientoCilindro;
use App\Models\Cliente;
use App\Models\Cilindro;

use Illuminate\Support\Arr;

class MovimientoCilindroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('es_ES');

        $clientes = Cliente::all();
        $cilindros = Cilindro::all();

        if ($clientes->isEmpty() || $cilindros->isEmpty()) {
            $this->command->info('Se requieren clientes y cilindros para crear movimientos. Ejecuta primero los seeders de Cliente y Cilindro.');
            return;
        }

        $tipos = ['entrega', 'devolucion', 'venta', 'prestamo'];

        for ($i = 0; $i < 5; $i++) {
            $cliente = $clientes->random();
            $mov = MovimientoCilindro::create([
                'cliente_id' => $cliente->id,
                'tipo' => Arr::random($tipos),
                'fecha' => $faker->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
                'observaciones' => $faker->optional()->sentence(),
            ]);

            // attach between 1 and 4 cilindros
            $count = rand(1, 4);
            $pick = $cilindros->random($count);
            $attach = [];
            foreach ($pick as $c) {
                $attach[$c->id] = ['cantidad' => rand(1, 5)];
            }
            $mov->cilindros()->attach($attach);
        }
    }
}
