<?php

namespace App\Services;

use App\Models\SiteSetting;

class SiteSettingService
{
    private array $keys = [
        'site_name',
        'email',
        'phone',
        'facebook',
        'instagram',
        'linkedin',
        'registration_url',
        'unilab_url',
        'iliauni_url',
    ];


    public function all(): array
    {
        $settings = [];

        foreach ($this->keys as $key) {
            $settings[$key] = SiteSetting::get($key, '');
        }

        return $settings;
    }


    public function update(array $data): void
    {
        foreach ($this->keys as $key) {
            if (array_key_exists($key, $data)) {
                SiteSetting::set($key, $data[$key]);
            }
        }
    }
}
