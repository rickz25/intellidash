<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
            'permissions' => ['*'],
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
                'city' => 'Manila',
                'contact_number' => '09'.rand(100000000, 999999999),
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
                'invoice_no' => 'INV-'.str_pad($i, 6, '0', STR_PAD_LEFT),
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

        /*
        |--------------------------------------------------------------------------
        | 8. UPLOADED REPORTS (4)
        |--------------------------------------------------------------------------
        */
        DB::table('uploaded_reports')->insert([
            [
                'uploaded_by' => 1,
                'file_name' => 'hourly_report_may.xlsx',
                'file_path' => 'uploads/reports/hourly_report_may.xlsx',
                'report_type' => 'Hourly Report',
                'total_rows' => 1500,
                'processed_rows' => 1490,
                'failed_rows' => 10,
                'status' => 'completed',
                'remarks' => 'Successfully uploaded and processed.',
                'uploaded_at' => Carbon::now()->subDays(5),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'uploaded_by' => 1,
                'file_name' => 'merchant_list.csv',
                'file_path' => 'uploads/reports/merchant_list.csv',
                'report_type' => 'Merchant Maintenance',
                'total_rows' => 800,
                'processed_rows' => 800,
                'failed_rows' => 0,
                'status' => 'completed',
                'remarks' => 'All merchant records imported successfully.',
                'uploaded_at' => Carbon::now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'uploaded_by' => 2,
                'file_name' => 'fraud_transactions.xlsx',
                'file_path' => 'uploads/reports/fraud_transactions.xlsx',
                'report_type' => 'Fraud Monitoring',
                'total_rows' => 2500,
                'processed_rows' => 2100,
                'failed_rows' => 400,
                'status' => 'failed',
                'remarks' => 'Some rows failed validation during import.',
                'uploaded_at' => Carbon::now()->subDay(),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'uploaded_by' => 2,
                'file_name' => 'daily_sales_report.xlsx',
                'file_path' => 'uploads/reports/daily_sales_report.xlsx',
                'report_type' => 'Sales Report',
                'total_rows' => 1200,
                'processed_rows' => 600,
                'failed_rows' => 0,
                'status' => 'processing',
                'remarks' => 'Import is currently in progress.',
                'uploaded_at' => Carbon::now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
