<?php

namespace App\Services;

use App\Models\MusicTrack;
use Illuminate\Support\Facades\DB;

class MusicTrackService
{
    public function createTrack(array $data): MusicTrack
    {
        $data['track_isrc'] = strtoupper(
            trim($data['track_isrc'])
        );

        return DB::transaction(function () use ($data) {
            return MusicTrack::create($data);
        });
    }

    public function updateTrack(
        MusicTrack $track,
        array $data
    ): MusicTrack {
        if (isset($data['track_isrc'])) {
            $data['track_isrc'] = strtoupper(
                trim($data['track_isrc'])
            );
        }

        DB::transaction(function () use ($track, $data) {
            $track->update($data);
        });

        return $track->refresh();
    }

    public function deleteTrack(MusicTrack $track): void
    {
        DB::transaction(function () use ($track) {
            $track->delete();
        });
    }
}