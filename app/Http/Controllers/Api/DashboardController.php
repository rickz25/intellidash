<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use App\Services\FraudService;
use App\Services\SalesInsightService;
use App\Services\DashboardService;  
use App\Services\PredictiveService;

class DashboardController extends Controller
{
    public function index()
    {
        // TOTAL SALES
        $totalSales = Sale::where('status', 'completed')
            ->sum('total_amount');

        // TOTAL PRODUCTS
        $totalProducts = Product::count();

        // TOTAL CATEGORIES
        $totalCategories = Category::count();

        // TOTAL BRANCHES
        $totalBranches = Branch::count();

        // LOW STOCK PRODUCTS
        $lowStockProducts = Product::whereColumn(
                'stock_quantity',
                '<=',
                'reorder_level'
            )
            ->select(
                'id',
                'name',
                'stock_quantity',
                'reorder_level'
            )
            ->get();

        // MONTHLY SALES
        $monthlySales = Sale::select(
                DB::raw('MONTH(transaction_date) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('status', 'completed')
            ->groupBy(DB::raw('MONTH(transaction_date)'))
            ->orderBy('month')
            ->get();

        // RECENT SALES
        $recentSales = Sale::with('branch')
            ->latest()
            ->take(10)
            ->get();

        // TOP SELLING PRODUCTS
        $topProducts = SaleItem::select(
                'product_id',
                DB::raw('SUM(quantity) as total_qty')
            )
            ->with('product')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(10)
            ->get();

        return response()->json([
            'summary' => [
                'total_sales' => $totalSales,
                'total_products' => $totalProducts,
                'total_categories' => $totalCategories,
                'total_branches' => $totalBranches,
            ],

            'low_stock_products' => $lowStockProducts,

            'monthly_sales' => $monthlySales,

            'recent_sales' => $recentSales,

            'top_selling_products' => $topProducts,
        ]);
    }

    public function kpis()
    {
        // Revenue
        $revenue = Sale::sum('total_amount');

        // Sales
        $sales = Sale::count();

        // Inventory
        $inventory = Product::sum(DB::raw('stock_quantity * price'));

        // Fraud (reuse logic from FraudService)
        $fraud = app(FraudService::class)->analyze()->getData(true)['fraud_kpi'];
        $salesInsight = app(SalesInsightService::class)->salesDrop()->getData(true);
        $predictive = app(PredictiveService::class)->salesForecast()->getData(true);
        $inventoryForecast = app(PredictiveService::class)->inventoryForecast()->getData(true);

        // Merge insights into fraud KPI
        // $fraudData['sales_drop'] = $salesInsight['sales_drop'] ?? null;
        // $fraudData['predictive_sales_trend'] = $predictive['trend_per_day'] ?? null;

        // return response()->json([
        //     'revenue' => $revenue,
        //     'sales' => $sales,
        //     'inventory' => $inventory,

        //     // 🔥 fraud KPI injected here
        //     'fraud' => $fraudData,
        //     'sales_insight' => $salesInsight,
        //     'predictive' => $predictive,
        //     'inventory_forecast' => $inventoryForecast,
        // ]);

        $inventoryData = $inventory['inventory_forecast'] ?? [];

        // 🧠 normalize (handles string or array)
        if (is_string($inventoryData)) {
            $inventoryData = json_decode($inventoryData, true) ?? [];
        }

        $inventoryData = collect($inventoryData);

        return response()->json([
            'revenue' => (float) $revenue,
            'sales' => $sales,
            'inventory' => (float) $inventory,

            'fraud' => $fraud,

            'sales_insight' => [
                'status' => $salesInsight['status'] ?? 'stable',
                'drop_percent' => $salesInsight['drop_percent'] ?? 0,
                'top_insight' => $salesInsight['insights'][0] ?? null,
                'recommendation' => $salesInsight['recommendation'] ?? null,
            ],

            'predictive' => [
                'trend' => $predictive['insight'] ?? null,
                'next_7_days_avg' => isset($predictive['forecast_next_7_days'])
                    ? round(array_sum($predictive['forecast_next_7_days']) / 7, 2)
                    : 0,
            ],

            'inventory_risk' => [
                'high_risk_count' => $inventoryData->where('risk', 'HIGH')->count(),

                'critical_product' => optional(
                    $inventoryData->sortBy('days_left')->first()
                )['product'] ?? null,
            ],
        ]);
    }
    
}
