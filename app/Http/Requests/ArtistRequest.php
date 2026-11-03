<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArtistRequest extends FormRequest
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
            'artist_code' => 'required|string|max:50|unique:artists,artist_code',
            'artist_name' => 'required|string|max:255',
            'bank_account' => 'required|string|max:255',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'artist_code.required' => 'Artist code is required.',
            'artist_code.unique' => 'This artist code already exists.',
            'artist_name.required' => 'Artist name is required.',
            'bank_account.required' => 'Bank account is required.',
        ];
    }
}
