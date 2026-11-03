<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoyaltyPayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'track_id' => 'required|exists:music_tracks,id',
            'total_streams' => 'required|integer|min:10000',
            'rate_per_stream' => 'required|numeric|min:0',
            'platform_commission' => 'required|numeric|min:0',
            'payout_status' => 'required|in:Pending,Paid',
        ];
    }

    public function messages(): array
    {
        return [
            'total_streams.min' => 'At least 10,000 streams are required.',
            'payout_status.in' => 'Status must be Pending or Paid.',
        ];
    }
}
