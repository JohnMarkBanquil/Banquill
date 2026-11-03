<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MusicTrackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'artist_id' => 'required|integer|exists:artists,id',

            'track_isrc' => [
                'required',
                'string',
                'size:12',
                'regex:/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/i',
                'unique:music_tracks,track_isrc',
            ],

            'track_title' => 'required|string|max:255',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'artist_id.required' => 'Please select an artist.',
            'artist_id.exists' => 'The selected artist does not exist.',
            'track_isrc.required' => 'The ISRC code is required.',
            'track_isrc.size' => 'The ISRC code must contain exactly 12 characters.',
            'track_isrc.regex' => 'Please enter a valid ISRC code.',
            'track_isrc.unique' => 'This ISRC code is already registered.',
            'track_title.required' => 'The track title is required.',
        ];
    }
}
