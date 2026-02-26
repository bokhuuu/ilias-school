<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@iliaschool.ge'],
            [
                'name' => 'Admin',
                'password' => Hash::make('iliasschool@2026'),
                'email_verified_at' => now(),
            ]
        );
    }
}
