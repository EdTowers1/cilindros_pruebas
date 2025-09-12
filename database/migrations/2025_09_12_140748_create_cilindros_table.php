<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cilindros', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->integer('capacidad'); // en litros o kilos
            $table->enum('estado', ['disponible', 'asignado', 'mantenimiento'])->default('disponible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cilindros');
    }
};
