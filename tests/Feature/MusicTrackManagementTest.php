<?php

namespace Tests\Feature;

use App\Models\Artist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MusicTrackManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_track_creation_normalizes_isrc_and_title(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();

        $this->post('/music-tracks', [
            'track_title' => ' Track Example ',
            'track_isrc' => ' usabc1234567 ',
            'artist_id' => $artist->id,
        ])->assertRedirect('/music-tracks');

        $this->assertDatabaseHas('music_tracks', [
            'track_title' => 'Track Example',
            'track_isrc' => 'USABC1234567',
            'artist_id' => $artist->id,
        ]);
    }

    public function test_track_update_allows_its_own_isrc_and_normalizes_input(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();
        $track = $artist->musicTracks()->create([
            'track_isrc' => 'USABC1234567',
            'track_title' => 'Original Title',
        ]);

        $this->put("/music-tracks/{$track->id}", [
            'track_title' => 'Updated Title',
            'track_isrc' => 'usabc1234567',
            'artist_id' => $artist->id,
        ])->assertRedirect('/music-tracks');

        $this->assertDatabaseHas('music_tracks', [
            'id' => $track->id,
            'track_title' => 'Updated Title',
            'track_isrc' => 'USABC1234567',
        ]);
    }

    public function test_duplicate_isrc_is_rejected_after_normalization(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();
        $artist->musicTracks()->create([
            'track_isrc' => 'USABC1234567',
            'track_title' => 'Existing Track',
        ]);

        $this->post('/music-tracks', [
            'track_title' => 'Duplicate Track',
            'track_isrc' => 'usabc1234567',
            'artist_id' => $artist->id,
        ])->assertSessionHasErrors('track_isrc');
    }

    public function test_track_index_is_paginated_and_eager_loads_artist(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();

        for ($i = 1; $i <= 16; $i++) {
            $artist->musicTracks()->create([
                'track_isrc' => 'USABC'.str_pad((string) $i, 7, '0', STR_PAD_LEFT),
                'track_title' => "Track {$i}",
            ]);
        }

        $this->get('/music-tracks')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('MusicTracks/Index')
                ->has('tracks.data', 15)
                ->where('tracks.total', 16)
                ->has('tracks.data.0.artist')
        );
    }

    public function test_track_search_includes_records_outside_the_current_page(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();

        for ($i = 1; $i <= 16; $i++) {
            $artist->musicTracks()->create([
                'track_isrc' => 'USABC'.str_pad((string) $i, 7, '0', STR_PAD_LEFT),
                'track_title' => "Track {$i}",
            ]);
        }

        $this->get('/music-tracks?search=Track%2016')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->where('tracks.total', 1)
                ->where('tracks.data.0.track_title', 'Track 16')
        );
    }

    public function test_track_show_route_renders_its_relationships(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();
        $track = $artist->musicTracks()->create([
            'track_isrc' => 'USABC1234567',
            'track_title' => 'Shown Track',
        ]);

        $this->get("/music-tracks/{$track->id}")->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('MusicTracks/Show')
                ->where('track.track_title', 'Shown Track')
                ->has('track.artist')
                ->has('track.royalty_payouts')
        );
    }

    public function test_track_with_payouts_cannot_be_deleted(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = $this->createArtist();
        $track = $artist->musicTracks()->create([
            'track_isrc' => 'USABC1234567',
            'track_title' => 'Protected Track',
        ]);
        $track->royaltyPayouts()->create([
            'total_streams' => 10000,
            'rate_per_stream' => 0.01,
            'gross_earnings' => 100.00,
            'platform_commission' => 10.00,
            'net_payout' => 90.00,
        ]);

        $this->delete("/music-tracks/{$track->id}")
            ->assertSessionHasErrors('track');

        $this->assertDatabaseHas('music_tracks', ['id' => $track->id]);
    }

    private function createArtist(): Artist
    {
        return Artist::query()->create([
            'artist_code' => 'ART000001',
            'artist_name' => 'Test Artist',
            'bank_account' => '123456',
        ]);
    }
}
