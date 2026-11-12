<?php

namespace Tests\Feature;

use App\Models\Artist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArtistManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_artist_creation_sanitizes_bank_account_and_generates_artist_code(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/artists', [
            'artist_name' => ' Artist Example ',
            'bank_account' => ' 123-45 67 ',
        ])->assertRedirect('/artists');

        $this->assertDatabaseHas('artists', [
            'artist_name' => 'Artist Example',
            'bank_account' => '1234567',
        ]);

        $artist = Artist::query()->firstOrFail();
        $this->assertMatchesRegularExpression('/^ART[A-Z0-9]{6}$/', $artist->artist_code);
    }

    public function test_artist_update_uses_service_and_preserves_generated_code(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();

        $this->put("/artists/{$artist->id}", [
            'artist_name' => 'Updated Artist',
            'bank_account' => '99-88 77',
        ])->assertRedirect('/artists');

        $this->assertDatabaseHas('artists', [
            'id' => $artist->id,
            'artist_code' => $artist->artist_code,
            'artist_name' => 'Updated Artist',
            'bank_account' => '998877',
        ]);
    }

    public function test_artist_index_is_paginated_and_eager_loads_tracks(): void
    {
        $this->actingAs(User::factory()->create());

        for ($i = 1; $i <= 16; $i++) {
            $this->createArtist($i);
        }

        $this->get('/artists')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('Artists/Index')
                ->has('artists.data', 15)
                ->has('artists.data.0.music_tracks')
                ->where('artists.total', 16)
        );
    }

    public function test_artist_show_route_renders_its_relationships(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();

        $this->get("/artists/{$artist->id}")->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('Artists/Show')
                ->where('artist.artist_code', $artist->artist_code)
                ->has('artist.music_tracks')
        );
    }

    public function test_artist_search_includes_records_outside_the_current_page(): void
    {
        $this->actingAs(User::factory()->create());

        for ($i = 1; $i <= 16; $i++) {
            $this->createArtist($i);
        }

        $this->get('/artists?search=Artist%2016')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->where('artists.total', 1)
                ->where('artists.data.0.artist_name', 'Artist 16')
        );
    }

    public function test_artist_with_tracks_cannot_be_deleted(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();
        $artist->musicTracks()->create([
            'track_isrc' => 'USABC1234567',
            'track_title' => 'Protected Track',
        ]);

        $this->delete("/artists/{$artist->id}")
            ->assertSessionHasErrors('artist');

        $this->assertDatabaseHas('artists', ['id' => $artist->id]);
    }

    private function createArtist(int $suffix = 1): Artist
    {
        return Artist::query()->create([
            'artist_code' => sprintf('ART%06d', $suffix),
            'artist_name' => "Artist {$suffix}",
            'bank_account' => (string) $suffix,
        ]);
    }
}
