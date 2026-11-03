<?php

namespace App\Services;

use App\Models\Artist;
use Illuminate\Support\Facades\DB;

class ArtistService
{
    public function createArtist(array $data): Artist
    {
        $data['bank_account'] = preg_replace(
            '/[\s-]+/',
            '',
            trim($data['bank_account'])
        );

        return DB::transaction(function () use ($data) {
            return Artist::create($data);
        });
    }

    public function updateArtist(Artist $artist, array $data): Artist
    {
        if (isset($data['bank_account'])) {
            $data['bank_account'] = preg_replace(
                '/[\s-]+/',
                '',
                trim($data['bank_account'])
            );
        }

        DB::transaction(function () use ($artist, $data) {
            $artist->update($data);
        });

        return $artist->refresh();
    }
}