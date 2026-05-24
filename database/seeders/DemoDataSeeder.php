<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | 1. ROLES (5 roles)
        |--------------------------------------------------------------------------
        */
        $roles = collect([
            ['name' => 'Admin'],
            ['name' => 'Manager'],
            ['name' => 'Cashier'],
            ['name' => 'Analyst'],
            ['name' => 'Inventory'],
        ])->map(fn ($r) => Role::updateOrCreate($r, [
            'permissions' => ['*']
        ]));

        /*
        |--------------------------------------------------------------------------
        | 2. BRANCHES (10)
        |--------------------------------------------------------------------------
        */
        $branches = collect(range(1, 10))->map(function ($i) {
            return Branch::create([
                'branch_code' => "BR-00$i",
                'name' => "Branch $i",
                'address' => "Street $i, Manila",
                'city' => "Manila",
                'contact_number' => '09' . rand(100000000, 999999999),
                'email' => "branch$i@test.com",
                'manager_name' => "Manager $i",
                'status' => 1,
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | 3. USERS (50)
        |--------------------------------------------------------------------------
        */
        $users = collect(range(1, 50))->map(function ($i) use ($roles, $branches) {
            return User::create([
                'name' => "User $i",
                'email' => "user$i@test.com",
                'password' => Hash::make('password'),
                'role_id' => $roles->random()->id,
                'branch_id' => $branches->random()->id,
                'last_login_at' => now(),
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | 4. CATEGORIES
        |--------------------------------------------------------------------------
        */
        $categories = collect([
            'Electronics',
            'Groceries',
            'Clothing',
            'Accessories',
            'Office Supplies',
        ])->map(fn ($name) => Category::create([
            'name' => $name,
            'status' => 1,
        ]));

        /*
        |--------------------------------------------------------------------------
        | 5. PRODUCTS (200)
        |--------------------------------------------------------------------------
        */
        $products = collect(range(1, 200))->map(function ($i) use ($branches, $categories) {
            return Product::create([
                'branch_id' => $branches->random()->id,
                'category_id' => $categories->random()->id,
                'sku' => "SKU-$i",
                'barcode' => rand(1000000000000, 9999999999999),
                'name' => "Product $i",
                'description' => "Description for product $i",
                'price' => rand(100, 5000),
                'cost' => rand(50, 4000),
                'stock_quantity' => rand(0, 100),
                'reorder_level' => 10,
                'status' => 1,
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | 6. SALES (1,000)
        |--------------------------------------------------------------------------
        */
        $sales = collect(range(1, 1000))->map(function ($i) use ($branches, $users) {

            $subtotal = rand(500, 5000);
            $discount = rand(0, 200);
            $tax = rand(50, 300);
            $total = $subtotal + $tax - $discount;

            return Sale::create([
                'branch_id' => $branches->random()->id,
                'invoice_no' => "INV-" . str_pad($i, 6, '0', STR_PAD_LEFT),
                'customer_name' => "Customer $i",
                'transaction_date' => now()->subDays(rand(0, 30)),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total_amount' => $total,
                'payment_method' => ['Cash', 'Card'][rand(0, 1)],
                'status' => 'completed',
                'created_by' => $users->random()->id,
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | 7. SALE ITEMS (5,000)
        |--------------------------------------------------------------------------
        */
        foreach (range(1, 5000) as $i) {
            $product = $products->random();

            SaleItem::create([
                'sale_id' => $sales->random()->id,
                'product_id' => $product->id,
                'quantity' => rand(1, 5),
                'unit_price' => $product->price,
                'discount' => rand(0, 50),
                'total' => $product->price * rand(1, 5),
            ]);
        }
    }
}
