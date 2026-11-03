<?php

namespace App\Services;

use App\Models\RoyaltyPayout;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoyaltyPayoutService
{
    public function create(array $data): RoyaltyPayout
    {
        return DB::transaction(function () use ($data) {
            return $this->savePayout(new RoyaltyPayout(), $data);
        });
    }

    public function update(
        RoyaltyPayout $payout,
        array $data
    ): RoyaltyPayout {
        return DB::transaction(function () use ($payout, $data) {
            return $this->savePayout($payout, $data);
        });
    }

    private function savePayout(
        RoyaltyPayout $payout,
        array $data
    ): RoyaltyPayout {
        if ($data['total_streams'] < 10000) {
            throw ValidationException::withMessages([
                'total_streams' => 'A payout requires at least 10,000 streams.',
            ]);
        }

        $gross = round(
            $data['total_streams'] * $data['rate_per_stream'],
            2
        );

        $commission = $data['platform_commission'];

        if ($commission > $gross) {
            throw ValidationException::withMessages([
                'platform_commission' => 'Commission cannot exceed gross earnings.',
            ]);
        }

        $payout->fill([
            'track_id' => $data['track_id'],
            'total_streams' => $data['total_streams'],
            'rate_per_stream' => $data['rate_per_stream'],
            'gross_earnings' => $gross,
            'platform_commission' => $commission,
            'net_payout' => round($gross - $commission, 2),
            'payout_status' => $data['payout_status'] ?? 'Pending',
        ]);

        $payout->save();

        return $payout;
    }
}