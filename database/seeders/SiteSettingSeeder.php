<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'site_name' => 'ილიას სკოლა',
            'email' => '',
            'phone' => '',
            'facebook' => '',
            'instagram' => '',
            'linkedin' => '',
            'registration_url' => '',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::firstOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
