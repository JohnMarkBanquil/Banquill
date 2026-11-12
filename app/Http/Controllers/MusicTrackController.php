<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMusicTrackRequest;
use App\Http\Requests\UpdateMusicTrackRequest;
use App\Models\Artist;
use App\Models\MusicTrack;
use App\Services\MusicTrackService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MusicTrackController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $search = is_string($search) ? trim($search) : '';

        return Inertia::render('MusicTracks/Index', [
            'tracks' => MusicTrack::query()
                ->with('artist:id,artist_code,artist_name')
                ->when($search !== '', function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query->where('track_title', 'like', "%{$search}%")
                            ->orWhere('track_isrc', 'like', "%{$search}%")
                            ->orWhereHas('artist', function (Builder $query) use ($search): void {
                                $query->where('artist_name', 'like', "%{$search}%");
                            });
                    });
                })
                ->latest()
                ->paginate(15)
                ->withQueryString(),
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('MusicTracks/Create', [
            'artists' => Artist::select('id', 'artist_code', 'artist_name')
                ->orderBy('artist_name')
                ->get(),
        ]);
    }

    public function store(
        StoreMusicTrackRequest $request,
        MusicTrackService $service
    ) {
        $service->createTrack($request->validated());

        return to_route('music-tracks.index')
            ->with('success', 'Music track added successfully!');
    }

    public function show(MusicTrack $music_track)
    {
        return Inertia::render('MusicTracks/Show', [
            'track' => $music_track->load([
                'artist:id,artist_code,artist_name',
                'royaltyPayouts:id,track_id',
            ]),
        ]);
    }

    public function edit(MusicTrack $music_track)
    {
        return Inertia::render('MusicTracks/Edit', [
            'track' => $music_track,
            'artists' => Artist::select('id', 'artist_code', 'artist_name')
                ->orderBy('artist_name')
                ->get(),
        ]);
    }

    public function update(
        UpdateMusicTrackRequest $request,
        int $id,
        MusicTrackService $service
    ) {
        $service->updateTrack(
            MusicTrack::findOrFail($id),
            $request->validated()
        );

        return to_route('music-tracks.index')
            ->with('success', 'Music track updated successfully!');
    }

    public function destroy(MusicTrack $music_track, MusicTrackService $service)
    {
        $service->deleteTrack($music_track);

        return to_route('music-tracks.index')
            ->with('success', 'Music track deleted successfully!');
    }
}
