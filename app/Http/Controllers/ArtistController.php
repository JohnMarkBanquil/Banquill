<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArtistRequest;
use App\Http\Requests\UpdateArtistRequest;
use App\Models\Artist;
use App\Services\ArtistService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtistController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $search = is_string($search) ? trim($search) : '';

        return Inertia::render('Artists/Index', [
            'artists' => Artist::query()
                ->with(['musicTracks:id,artist_id'])
                ->withCount('musicTracks')
                ->when($search !== '', function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query->where('artist_name', 'like', "%{$search}%")
                            ->orWhere('artist_code', 'like', "%{$search}%");
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
        return Inertia::render('Artists/Create');
    }

    public function store(
        StoreArtistRequest $request,
        ArtistService $service
    ) {
        $service->createArtist($request->validated());

        return to_route('artists.index')
            ->with('success', 'Artist registered successfully!');
    }

    public function show(Artist $artist)
    {
        return Inertia::render('Artists/Show', [
            'artist' => $artist->load('musicTracks:id,artist_id,track_title'),
        ]);
    }

    public function edit(Artist $artist)
    {
        return Inertia::render('Artists/Edit', [
            'artist' => $artist,
        ]);
    }

    public function update(
        UpdateArtistRequest $request,
        int $id,
        ArtistService $service
    ) {
        $service->updateArtist(
            Artist::findOrFail($id),
            $request->validated()
        );

        return to_route('artists.index')
            ->with('success', 'Artist updated successfully!');
    }

    public function destroy(Artist $artist, ArtistService $service)
    {
        $service->deleteArtist($artist);

        return to_route('artists.index')
            ->with('success', 'Artist deleted successfully!');
    }
}
