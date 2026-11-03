<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MusicTrack extends Model
{
    protected $fillable = [
        'track_isrc',
        'track_title',
        'artist_id',
    ];

    protected static function booted(): void
    {
        static::saving(function ($track) {
            $track->track_isrc = strtoupper(
                trim($track->track_isrc)
            );
        });
    }

    public function artist()
    {
        return $this->belongsTo(Artist::class, 'artist_id');
    }

    public function royaltyPayouts()
    {
        return $this->hasMany(RoyaltyPayout::class, 'track_id');
    }
}