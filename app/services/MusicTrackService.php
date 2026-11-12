<?php

namespace App\Services;

use App\Models\MusicTrack;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MusicTrackService
{
    public function createTrack(array $data): MusicTrack
    {
        $data = $this->sanitize($data);

        return DB::transaction(fn () => MusicTrack::create($data));
    }

    public function updateTrack(
        MusicTrack $track,
        array $data
    ): MusicTrack {
        $data = $this->sanitize($data);

        DB::transaction(fn () => $track->update($data));

        return $track->refresh();
    }

    public function deleteTrack(MusicTrack $track): void
    {
        DB::transaction(function () use ($track): void {
            if ($track->royaltyPayouts()->exists()) {
                throw ValidationException::withMessages([
                    'track' => 'Cannot delete a track with existing royalty payouts.',
                ]);
            }

            $track->delete();
        });
    }

    private function sanitize(array $data): array
    {
        if (array_key_exists('track_title', $data)) {
            $data['track_title'] = trim($data['track_title']);

            if ($data['track_title'] === '') {
                throw ValidationException::withMessages([
                    'track_title' => 'Track title is required.',
                ]);
            }
        }

        if (array_key_exists('track_isrc', $data)) {
            $data['track_isrc'] = $this->normalizeTrackIsrc($data['track_isrc']);

            if (! preg_match('/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/', $data['track_isrc'])) {
                throw ValidationException::withMessages([
                    'track_isrc' => 'Please enter a valid ISRC code.',
                ]);
            }
        }

        return $data;
    }

    private function normalizeTrackIsrc(mixed $value): string
    {
        return strtoupper(trim((string) $value));
    }
}
