<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMusicTrackRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('track_isrc'))) {
            $this->merge([
                'track_isrc' => strtoupper(trim($this->input('track_isrc'))),
            ]);
        }
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'track_title' => ['required', 'string', 'max:255'],
            'track_isrc' => [
                'required',
                'string',
                'size:12',
                'regex:/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/',
                Rule::unique('music_tracks', 'track_isrc')
                    ->ignore($this->route('music_track')),
            ],
            'artist_id' => ['required', 'integer', 'exists:artists,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'track_title.required' => 'Track title is required.',
            'track_isrc.required' => 'ISRC code is required.',
            'track_isrc.size' => 'ISRC code must contain exactly 12 characters.',
            'track_isrc.regex' => 'Please enter a valid ISRC code.',
            'track_isrc.unique' => 'This ISRC code is already registered.',
            'artist_id.required' => 'Please select an artist.',
            'artist_id.exists' => 'The selected artist does not exist.',
        ];
    }
}
