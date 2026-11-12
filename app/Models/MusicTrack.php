<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MusicTrack extends Model
{
    protected $fillable = [
        'track_isrc',
        'track_title',
        'artist_id',
    ];

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'artist_id');
    }

    public function royaltyPayouts(): HasMany
    {
        return $this->hasMany(RoyaltyPayout::class, 'track_id');
    }
}
