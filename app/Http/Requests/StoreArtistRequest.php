<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArtistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'artist_name' => ['required', 'string', 'max:255'],
            'bank_account' => [
                'required',
                'string',
                'max:255',
                'regex:/[A-Za-z0-9]/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'artist_name.required' => 'Artist name is required.',
            'bank_account.required' => 'Bank account is required.',
            'bank_account.regex' => 'Bank account must contain at least one letter or number.',
        ];
    }
}
