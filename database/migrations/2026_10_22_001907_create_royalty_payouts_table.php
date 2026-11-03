<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('royalty_payouts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('track_id')
                ->constrained('music_tracks')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('total_streams');
            $table->decimal('rate_per_stream', 12, 6);
            $table->decimal('gross_earnings', 14, 2);
            $table->decimal('platform_commission', 14, 2);
            $table->decimal('net_payout', 14, 2);
            $table->string('payout_status')->default('Pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('royalty_payouts');
    }
};