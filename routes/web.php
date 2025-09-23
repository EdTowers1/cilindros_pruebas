<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MovimientoCilindroController;
use App\Http\Controllers\TerceroController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tab content routes
    Route::get('/tab/cilindros', function () {
        if (request()->ajax()) {
            return view('tabs.cilindros.index');
        }
        return view('dashboard');
    })->name('tab.cilindros');

    Route::get('/tab/clientes', function () {
        if (request()->ajax()) {
            return view('tabs.clientes.index');
        }
        return view('dashboard');
    })->name('tab.clientes');

    Route::get('/tab/movimientos', function () {
        if (request()->ajax()) {
            return view('tabs.movimientos.index');
        }
        return view('dashboard');
    })->name('tab.movimientos');

    // MovimientoCilindro API (JSON) - protegido por auth
    Route::prefix('movimientos')->controller(MovimientoCilindroController::class)->group(function () {
        Route::get('/', 'index')->name('movimientos.index');
        Route::get('/{movimiento}', 'show')->name('movimientos.show');
        Route::post('/', 'store')->name('movimientos.store');
        Route::put('/{movimiento}', 'update')->name('movimientos.update');
        Route::delete('/{movimiento}', 'destroy')->name('movimientos.destroy');
    });

    Route::prefix('terceros')->controller(TerceroController::class)->group(function () {
        Route::get('/', 'index')->name('api.terceros.index');
    });


});

require __DIR__ . '/auth.php';
