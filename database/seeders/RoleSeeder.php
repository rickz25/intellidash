<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'permissions' => [
                    'users.create',
                    'users.read',
                    'users.update',
                    'users.delete',

                    'branches.create',
                    'branches.read',
                    'branches.update',
                    'branches.delete',

                    'categories.create',
                    'categories.read',
                    'categories.update',
                    'categories.delete',

                    'products.create',
                    'products.read',
                    'products.update',
                    'products.delete',

                    'sales.create',
                    'sales.read',
                    'sales.update',
                    'sales.delete',

                    'reports.upload',
                    'reports.read',

                    'ai.logs.view',

                    'notifications.create',
                    'notifications.read',
                ],
            ],
            [
                'name' => 'Manager',
                'permissions' => [
                    'users.read',

                    'branches.read',
                    'categories.read',
                    'products.manage',

                    'sales.create',
                    'sales.read',

                    'reports.upload',
                    'ai.logs.view',
                    'notifications.read',
                ],
            ],
            [
                'name' => 'Analyst',
                'permissions' => [
                    'branches.read',
                    'categories.read',
                    'products.read',

                    'sales.read',

                    'ai.logs.view',
                    'reports.read',
                ],
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                ['permissions' => $role['permissions']]
            );
        }
    }
}
