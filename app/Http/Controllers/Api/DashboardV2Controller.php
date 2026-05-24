<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;

class DashboardV2Controller extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | DATE RANGE (default: last 30 days)
        |--------------------------------------------------------------------------
        */
        $startDate = now()->subDays(30);
        $endDate = now();

        /*
        |--------------------------------------------------------------------------
        | SALES KPIs
        |--------------------------------------------------------------------------
        */

        $totalSales = Sale::where('status', 'completed')->sum('total_amount');

        $totalOrders = Sale::whereBetween('transaction_date', [$startDate, $endDate])
            ->count();

        $averageOrderValue = $totalOrders > 0
            ? $totalSales / $totalOrders
            : 0;

        $netRevenue = Sale::where('status', 'completed')
            ->sum(DB::raw('total_amount - discount'));

        /*
        |--------------------------------------------------------------------------
        | DAILY SALES TREND
        |--------------------------------------------------------------------------
        */

        $dailySales = Sale::select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('status', 'completed')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(transaction_date)'))
            ->orderBy('date')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | INVENTORY KPIs
        |--------------------------------------------------------------------------
        */

        $totalProducts = Product::count();

        $lowStock = Product::whereColumn('stock_quantity', '<=', 'reorder_level')->count();

        $outOfStock = Product::where('stock_quantity', 0)->count();

        $inventoryValue = Product::sum(DB::raw('stock_quantity * cost'));

        /*
        |--------------------------------------------------------------------------
        | TOP SELLING PRODUCTS
        |--------------------------------------------------------------------------
        */

        $topProducts = SaleItem::select(
                'product_id',
                DB::raw('SUM(quantity) as total_qty'),
                DB::raw('SUM(total) as revenue')
            )
            ->with('product')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | CATEGORY PERFORMANCE
        |--------------------------------------------------------------------------
        */

        $categoryPerformance = Category::select(
                'categories.id',
                'categories.name',
                DB::raw('SUM(sale_items.total) as revenue')
            )
            ->join('products', 'products.category_id', '=', 'categories.id')
            ->join('sale_items', 'sale_items.product_id', '=', 'products.id')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | BRANCH PERFORMANCE
        |--------------------------------------------------------------------------
        */

        $branchPerformance = Branch::select(
                'branches.id',
                'branches.name',
                DB::raw('SUM(sales.total_amount) as revenue'),
                DB::raw('COUNT(sales.id) as orders')
            )
            ->join('sales', 'sales.branch_id', '=', 'branches.id')
            ->where('sales.status', 'completed')
            ->groupBy('branches.id', 'branches.name')
            ->orderByDesc('revenue')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | CRITICAL PRODUCT
        |--------------------------------------------------------------------------
        */
        $criticalProduct = Product::whereColumn('stock_quantity', '<=', 'reorder_level')
        ->orderBy('stock_quantity')
        ->first();

        $highRiskProducts = Product::whereColumn('stock_quantity', '<=', 'reorder_level')
        ->orderBy('stock_quantity')
        ->get();

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'sales_kpis' => [
                'total_sales' => $totalSales,
                'net_revenue' => $netRevenue,
                'total_orders' => $totalOrders,
                'average_order_value' => round($averageOrderValue, 2),
            ],

            'inventory_kpis' => [
                'total_products' => $totalProducts,

                'low_stock_count' => $lowStock,

                'out_of_stock' => $outOfStock,

                'inventory_value' => $inventoryValue,

                'critical_product' => $criticalProduct
                    ? [
                        'id' => $criticalProduct->id,
                        'name' => $criticalProduct->name,
                        'stock_quantity' => $criticalProduct->stock_quantity,
                        'reorder_level' => $criticalProduct->reorder_level,
                    ]
                    : null,
            ],
            'high_risk_products' => $highRiskProducts,
            'trends' => [
                'daily_sales' => $dailySales,
            ],

            'top_products' => $topProducts,

            'category_performance' => $categoryPerformance,

            'branch_performance' => $branchPerformance,
        ]);
    }
}

// Response format example:
    /*
    {
  "sales_kpis": {
    "total_sales": 250000,
    "net_revenue": 245000,
    "total_orders": 320,
    "average_order_value": 781.25
  },

  "inventory_kpis": {
    "total_products": 120,
    "low_stock": 15,
    "out_of_stock": 3,
    "inventory_value": 980000
  },

  "trends": {
    "daily_sales": [
      { "date": "2026-05-01", "total": 12000 },
      { "date": "2026-05-02", "total": 15000 }
    ]
  },

  "top_products": [],
  "category_performance": [],
  "branch_performance": []
}
    */
