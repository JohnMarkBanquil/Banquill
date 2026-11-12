<?php

namespace Tests\Feature;

use App\Models\Artist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoyaltyPayoutManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_payout_status_is_automatically_set_to_pending(): void
    {
        $this->actingAs(User::factory()->create());
        $artist = Artist::query()->create([
            'artist_code' => 'ART000001',
            'artist_name' => 'Test Artist',
            'bank_account' => '123456',
        ]);
        $track = $artist->musicTracks()->create([
            'track_isrc' => 'USABC1234567',
            'track_title' => 'Test Track',
        ]);

        $this->post('/royalty-payouts', [
            'track_id' => $track->id,
            'total_streams' => 10000,
            'rate_per_stream' => 0.01,
            'platform_commission' => 10,
            'payout_status' => 'Paid',
        ])->assertRedirect('/royalty-payouts');

        $this->assertDatabaseHas('royalty_payouts', [
            'track_id' => $track->id,
            'payout_status' => 'Pending',
        ]);
    }
}
