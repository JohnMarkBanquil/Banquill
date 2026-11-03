<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoyaltyPayoutRequest extends FormRequest
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
            'payout_status' => 'nullable|in:Pending,Paid',
        ];
    }

    public function messages(): array
    {
        return [
            'track_id.required' => 'Please select a music track.',
            'total_streams.min' => 'At least 10,000 streams are required.',
            'payout_status.in' => 'Status must be Pending or Paid.',
        ];
    }
}
