<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ArtistController extends Controller
{
    // Display all artists
    public function index()
    {
        return Inertia::render('Artists/Index', [
            'artists' => Artist::latest()->get(),
        ]);
    }

    // Show create artist page
    public function create()
    {
        return Inertia::render('Artists/Create');
    }

    // Save new artist
    public function store(Request $request)
    {
        $validated = $request->validate([
            'artist_name' => 'required|string|max:255',
            'bank_account' => 'required|string|max:100',
        ]);

        // Remove spaces and special characters from bank account
        $validated['bank_account'] = preg_replace(
            '/[^A-Za-z0-9]/',
            '',
            $validated['bank_account']
        );

        DB::transaction(function () use ($validated) {
            Artist::create($validated);
        });

        return redirect()
            ->route('artists.index')
            ->with('success', 'Artist registered successfully!');
    }

    // Show edit artist page
    public function edit(Artist $artist)
    {
        return Inertia::render('Artists/Edit', [
            'artist' => $artist,
        ]);
    }

    // Update artist
    public function update(Request $request, Artist $artist)
    {
        $validated = $request->validate([
            'artist_name' => 'required|string|max:255',
            'bank_account' => 'required|string|max:100',
        ]);

        $validated['bank_account'] = preg_replace(
            '/[^A-Za-z0-9]/',
            '',
            $validated['bank_account']
        );

        DB::transaction(function () use ($validated, $artist) {
            $artist->update($validated);
        });

        return redirect()
            ->route('artists.index')
            ->with('success', 'Artist updated successfully!');
    }

    // Delete artist
    public function destroy(Artist $artist)
    {
        if ($artist->musicTracks()->exists()) {
            return back()->with(
                'error',
                'Cannot delete an artist who has music tracks.'
            );
        }

        $artist->delete();

        return redirect()
            ->route('artists.index')
            ->with('success', 'Artist deleted successfully!');
    }
}
