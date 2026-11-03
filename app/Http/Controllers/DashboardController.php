<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\MusicTrack;
use App\Models\RoyaltyPayout;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the actual totals from the database
        $totalArtists = Artist::count();
        $totalTracks = MusicTrack::count();
        $totalStreams = RoyaltyPayout::sum('total_streams');
        $totalPayouts = RoyaltyPayout::sum('net_payout');

        // Get the latest payout records
        $recentPayouts = RoyaltyPayout::with('musicTrack.artist')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($payout) {
                return [
                    'id' => $payout->id,
                    'artist' => $payout->musicTrack?->artist?->artist_name ?? 'Unknown Artist',
                    'track' => $payout->musicTrack?->track_title ?? 'Unknown Track',
                    'streams' => $payout->total_streams,
                    'amount' => $payout->net_payout,
                    'status' => $payout->payout_status,
                ];
            });

        // Get actual monthly payout totals for the last 7 months
        $startDate = Carbon::now()->startOfMonth()->subMonths(6);

        $monthlyRecords = RoyaltyPayout::where('created_at', '>=', $startDate)
            ->get(['net_payout', 'created_at'])
            ->groupBy(fn ($payout) => $payout->created_at->format('Y-m'))
            ->map(fn ($payouts) => $payouts->sum('net_payout'));

        $monthlyPayouts = [];

        for ($i = 0; $i < 7; $i++) {
            $month = $startDate->copy()->addMonths($i);
            $key = $month->format('Y-m');

            $monthlyPayouts[] = [
                'month' => $month->format('M'),
                'total' => (float) ($monthlyRecords[$key] ?? 0),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalArtists' => $totalArtists,
                'totalTracks' => $totalTracks,
                'totalStreams' => $totalStreams,
                'totalPayouts' => $totalPayouts,
            ],
            'recentPayouts' => $recentPayouts,
            'monthlyPayouts' => $monthlyPayouts,
        ]);
    }
}
