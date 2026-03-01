<?php

namespace App\Http\Requests\SiteSetting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'site_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'facebook' => ['nullable', 'url', 'max:512'],
            'instagram' => ['nullable', 'url', 'max:512'],
            'linkedin' => ['nullable', 'url', 'max:512'],
            'registration_url' => ['nullable', 'url', 'max:512'],
            'unilab_url' => ['nullable', 'url', 'max:512'],
            'iliauni_url' => ['nullable', 'url', 'max:512'],
        ];
    }
}
