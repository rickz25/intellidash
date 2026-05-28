<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

class GeneratePostmanCollection extends Command
{
    protected $signature = 'postman:generate';

    protected $description = 'Generate Postman collection from Laravel routes';

    public function handle()
    {
        $routes = collect(Route::getRoutes());

        $collection = [
            'info' => [
                'name' => 'IntelliDash API',
                'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
            ],
            'item' => [],
        ];

        $groups = [];

        foreach ($routes as $route) {

            $uri = $route->uri();

            // Only API routes
            if (!str_starts_with($uri, 'api/')) {
                continue;
            }

            $methods = array_values(array_diff($route->methods(), ['HEAD']));

            $module = $this->detectModule($uri);

            if (!isset($groups[$module])) {
                $groups[$module] = [];
            }

            foreach ($methods as $method) {

                $groups[$module][] = [
                    'name' => strtoupper($method) . ' ' . $uri,
                    'request' => [
                        'method' => $method,
                        'header' => [
                            [
                                'key' => 'Authorization',
                                'value' => 'Bearer {{ token }}',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'Accept',
                                'value' => 'application/json',
                                'type' => 'text',
                            ],
                        ],
                        'url' => [
                            'raw' => '{{ base_url }}/' . $uri,
                            'host' => ['{{ base_url }}'],
                            'path' => explode('/', $uri),
                        ],
                    ],
                ];
            }
        }

        foreach ($groups as $module => $items) {
            $collection['item'][] = [
                'name' => $module,
                'item' => $items,
            ];
        }

        $path = storage_path('app/postman_collection.json');

        file_put_contents(
            $path,
            json_encode($collection, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        $this->info("Postman collection generated:");
        $this->line($path);

        return Command::SUCCESS;
    }

    private function detectModule(string $uri): string
    {
        return match (true) {

            str_contains($uri, 'dashboard') => 'Dashboard',

            str_contains($uri, 'ai') => 'AI',

            str_contains($uri, 'sales') => 'Sales',

            str_contains($uri, 'products') => 'Products',

            str_contains($uri, 'fraud') => 'Fraud Logs',

            str_contains($uri, 'sale-items') => 'Sale Items',

            str_contains($uri, 'notifications') => 'Notifications',

            str_contains($uri, 'roles') => 'Roles',

            str_contains($uri, 'branches') => 'Branches',

            str_contains($uri, 'categories') => 'Categories',

            default => 'Other',
        };
    }
}
