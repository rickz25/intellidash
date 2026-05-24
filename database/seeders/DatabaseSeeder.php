<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Database\Seeders\RoleSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed roles first (IMPORTANT)
        $this->call([
            RoleSeeder::class,
            DemoDataSeeder::class,
            FraudLogSeeder::class,
        ]);

        // 2. Create test user with role assigned
        $adminRole = \App\Models\Role::where('name', 'Admin')->first();

        User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'test@example.com',
            'role_id' => $adminRole?->id,
        ]);
    }
}
