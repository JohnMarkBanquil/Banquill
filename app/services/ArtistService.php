<?php

namespace App\Services;

use App\Models\Artist;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ArtistService
{
    public function createArtist(array $data): Artist
    {
        $data = $this->sanitize($data);

        return DB::transaction(function () use ($data): Artist {
            $data['artist_code'] = $this->generateArtistCode();

            return Artist::create($data);
        });
    }

    public function updateArtist(Artist $artist, array $data): Artist
    {
        $data = $this->sanitize($data);
        unset($data['artist_code']);

        DB::transaction(fn () => $artist->update($data));

        return $artist->refresh();
    }

    public function deleteArtist(Artist $artist): void
    {
        DB::transaction(function () use ($artist): void {
            if ($artist->musicTracks()->exists()) {
                throw ValidationException::withMessages([
                    'artist' => 'Cannot delete an artist who has music tracks.',
                ]);
            }

            $artist->delete();
        });
    }

    private function sanitize(array $data): array
    {
        if (array_key_exists('artist_name', $data)) {
            $data['artist_name'] = trim($data['artist_name']);

            if ($data['artist_name'] === '') {
                throw ValidationException::withMessages([
                    'artist_name' => 'Artist name is required.',
                ]);
            }
        }

        if (array_key_exists('bank_account', $data)) {
            $data['bank_account'] = $this->normalizeBankAccount($data['bank_account']);

            if ($data['bank_account'] === '') {
                throw ValidationException::withMessages([
                    'bank_account' => 'Bank account must contain at least one letter or number.',
                ]);
            }
        }

        return $data;
    }

    private function normalizeBankAccount(mixed $value): string
    {
        return preg_replace('/[^A-Za-z0-9]/', '', trim((string) $value));
    }

    private function generateArtistCode(): string
    {
        do {
            $code = 'ART'.Str::upper(Str::random(6));
        } while (Artist::where('artist_code', $code)->exists());

        return $code;
    }
}
