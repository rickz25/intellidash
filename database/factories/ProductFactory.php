<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'branch_id' => Branch::inRandomOrder()->value('id'),
            'category_id' => Category::inRandomOrder()->value('id'),

            'sku' => fake()->unique()->bothify('SKU-###'),
            'barcode' => fake()->ean13(),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 100, 5000),
            'cost' => fake()->randomFloat(2, 50, 4000),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'reorder_level' => 10,
            'image' => null,
            'status' => 1,
        ];
    }
}
