<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artist extends Model
{
    protected $fillable = [
        'artist_code',
        'artist_name',
        'bank_account',
    ];

    public function musicTracks(): HasMany
    {
        return $this->hasMany(MusicTrack::class, 'artist_id');
    }
}
