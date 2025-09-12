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
        Schema::create('movimiento_cilindro_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movimiento_cilindro_id')->constrained('movimiento_cilindros')->cascadeOnDelete();
            $table->foreignId('cilindro_id')->constrained('cilindros')->cascadeOnDelete();
            $table->integer('cantidad')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimiento_cilindro_detalle');
    }
};
