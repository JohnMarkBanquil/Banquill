<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoyaltyPayout extends Model
{
    protected $fillable = [
        'track_id',
        'total_streams',
        'rate_per_stream',
        'gross_earnings',
        'platform_commission',
        'net_payout',
        'payout_status',
    ];

    protected function casts(): array
    {
        return [
            'rate_per_stream' => 'decimal:6',
            'gross_earnings' => 'decimal:2',
            'platform_commission' => 'decimal:2',
            'net_payout' => 'decimal:2',
        ];
    }

    public function musicTrack()
    {
        return $this->belongsTo(MusicTrack::class, 'track_id');
    }
}