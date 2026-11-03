
<?php

use App\Http\Controllers\ArtistController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MusicTrackController;
use App\Http\Controllers\RoyaltyPayoutController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['verified'])
        ->name('dashboard');

    // Artist management
    Route::resource('artists', ArtistController::class);

    // Music track management
    Route::resource('music-tracks', MusicTrackController::class);

    // Royalty payout management
    Route::resource('royalty-payouts', RoyaltyPayoutController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
