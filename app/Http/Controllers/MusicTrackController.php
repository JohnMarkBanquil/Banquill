<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\MusicTrack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MusicTrackController extends Controller
{
    public function index()
    {
        return Inertia::render('MusicTracks/Index', [
            'tracks' => MusicTrack::with('artist')
                ->latest()
                ->get(),
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'track_title' => 'required|string|max:255',
            'track_isrc' => 'required|string|max:20|unique:music_tracks,track_isrc',
            'artist_id' => 'required|exists:artists,id',
        ]);

        $validated['track_isrc'] = strtoupper(
            trim($validated['track_isrc'])
        );

        // Check uniqueness after converting to uppercase.
        $request->merge([
            'track_isrc' => $validated['track_isrc'],
        ]);

        $request->validate([
            'track_isrc' => 'unique:music_tracks,track_isrc',
        ]);

        DB::transaction(function () use ($validated) {
            MusicTrack::create($validated);
        });

        return redirect()
            ->route('music-tracks.index')
            ->with('success', 'Music track added successfully!');
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

    public function update(Request $request, MusicTrack $music_track)
    {
        $validated = $request->validate([
            'track_title' => 'required|string|max:255',
            'track_isrc' => 'required|string|max:20|unique:music_tracks,track_isrc,' . $music_track->id,
            'artist_id' => 'required|exists:artists,id',
        ]);

        $validated['track_isrc'] = strtoupper(
            trim($validated['track_isrc'])
        );

        $music_track->update($validated);

        return redirect()
            ->route('music-tracks.index')
            ->with('success', 'Music track updated successfully!');
    }

    public function destroy(MusicTrack $music_track)
    {
        if ($music_track->royaltyPayouts()->exists()) {
            return back()->with(
                'error',
                'Cannot delete a track with existing royalty payouts.'
            );
        }

        $music_track->delete();

        return redirect()
            ->route('music-tracks.index')
            ->with('success', 'Music track deleted successfully!');
    }
}