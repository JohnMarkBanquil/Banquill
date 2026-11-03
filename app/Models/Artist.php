<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Artist extends Model
{
    protected $fillable = [
        'artist_code',
        'artist_name',
        'bank_account',
    ];

    protected static function booted(): void
    {
        static::creating(function ($artist) {
            if (empty($artist->artist_code)) {
                do {
                    $code = 'ART' . strtoupper(Str::random(6));
                } while (static::where('artist_code', $code)->exists());

                $artist->artist_code = $code;
            }

            $artist->bank_account = preg_replace(
                '/[^A-Za-z0-9]/',
                '',
                $artist->bank_account
            );
        });
    }

    public function musicTracks()
    {
        return $this->hasMany(MusicTrack::class, 'artist_id');
    }
}