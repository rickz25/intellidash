<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;

class DashboardV3Controller extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | DATE RANGE
        |--------------------------------------------------------------------------
        */
        $thisYear = now()->year;
        $lastYear = now()->subYear()->year;

        /*
        |--------------------------------------------------------------------------
        | 1. YEAR OVER YEAR SALES
        |--------------------------------------------------------------------------
        */

        $yoy = [
            'this_year' => Sale::whereYear('transaction_date', $thisYear)
                ->where('status', 'completed')
                ->sum('total_amount'),

            'last_year' => Sale::whereYear('transaction_date', $lastYear)
                ->where('status', 'completed')
                ->sum('total_amount'),
        ];

        $yoy['growth_percent'] = $yoy['last_year'] > 0
            ? (($yoy['this_year'] - $yoy['last_year']) / $yoy['last_year']) * 100
            : 0;

        /*
        |--------------------------------------------------------------------------
        | 2. PROFIT MARGIN
        |--------------------------------------------------------------------------
        */

        $profit = SaleItem::join('products', 'products.id', '=', 'sale_items.product_id')
            ->selectRaw('
                SUM((sale_items.unit_price - products.cost) * sale_items.quantity) as profit
            ')
            ->value('profit');

        $revenue = Sale::where('status', 'completed')->sum('total_amount');

        $profitMargin = $revenue > 0
            ? ($profit / $revenue) * 100
            : 0;

        /*
        |--------------------------------------------------------------------------
        | 3. CASH FLOW (SIMPLE MODEL)
        |--------------------------------------------------------------------------
        */

        $cashIn = Sale::where('payment_method', 'Cash')
            ->sum('total_amount');

        $cashOut = Product::sum(DB::raw('cost * stock_quantity'));

        /*
        |--------------------------------------------------------------------------
        | 4. CUSTOMER BEHAVIOR
        |--------------------------------------------------------------------------
        */

        $customerBehavior = Sale::select(
            'customer_name',
            DB::raw('COUNT(*) as visits'),
            DB::raw('SUM(total_amount) as spent')
        )
            ->groupBy('customer_name')
            ->orderByDesc('spent')
            ->limit(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | 5. MONTHLY TREND (FOR FORECASTING)
        |--------------------------------------------------------------------------
        */

        $monthlyTrend = Sale::select(
            DB::raw('MONTH(transaction_date) as month'),
            DB::raw('SUM(total_amount) as total')
        )
            ->whereYear('transaction_date', $thisYear)
            ->groupBy(DB::raw('MONTH(transaction_date)'))
            ->orderBy('month')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'yoy_sales' => $yoy,
            'profit_margin' => round($profitMargin, 2),
            'cash_flow' => [
                'cash_in' => $cashIn,
                'cash_out_inventory_value' => $cashOut,
            ],
            'customer_behavior' => $customerBehavior,
            'monthly_trend' => $monthlyTrend,
        ]);
    }
}
