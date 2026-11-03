<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoyaltyPayoutRequest;
use App\Http\Requests\UpdateRoyaltyPayoutRequest;
use App\Models\MusicTrack;
use App\Models\RoyaltyPayout;
use App\Services\RoyaltyPayoutService;
use Inertia\Inertia;

class RoyaltyPayoutController extends Controller
{
    public function index()
    {
        return Inertia::render('RoyaltyPayouts/Index', [
            'payouts' => RoyaltyPayout::with('musicTrack.artist')
                ->latest()
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('RoyaltyPayouts/Create', [
            'tracks' => MusicTrack::with('artist')->get(),
        ]);
    }

    public function store(
        StoreRoyaltyPayoutRequest $request,
        RoyaltyPayoutService $service
    ) {
        $service->create($request->validated());

        return redirect()->route('royalty-payouts.index')
            ->with('success', 'Royalty payout created successfully.');
    }

    public function edit(RoyaltyPayout $royalty_payout)
    {
        return Inertia::render('RoyaltyPayouts/Edit', [
            'payout' => $royalty_payout,
            'tracks' => MusicTrack::with('artist')->get(),
        ]);
    }

    public function update(
        UpdateRoyaltyPayoutRequest $request,
        RoyaltyPayout $royalty_payout,
        RoyaltyPayoutService $service
    ) {
        $service->update($royalty_payout, $request->validated());

        return redirect()->route('royalty-payouts.index')
            ->with('success', 'Royalty payout updated successfully.');
    }

    public function destroy(RoyaltyPayout $royalty_payout)
    {
        $royalty_payout->delete();

        return redirect()->route('royalty-payouts.index')
            ->with('success', 'Royalty payout deleted successfully.');
    }
}
