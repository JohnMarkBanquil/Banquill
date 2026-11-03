<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoyaltyPayoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'music_track_id' => ['required', 'integer', 'exists:music_tracks,id'],
            'total_streams' => ['required', 'integer', 'min:0'],
            'rate_per_stream' => ['required', 'numeric', 'min:0'],
            'gross_earnings' => ['required', 'numeric', 'min:0'],
            'platform_commission' => ['sometimes', 'numeric', 'min:0'],
            'net_payout' => ['required', 'numeric', 'min:0'],
            'payout_status' => ['sometimes', 'string', 'max:20'],
        ];
    }
}
