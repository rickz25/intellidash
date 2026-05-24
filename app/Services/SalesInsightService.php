<?php

namespace App\Services;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class SalesInsightService
{
    /*
        |--------------------------------------------------------------------------
        | SALES DROP INSIGHT ENGINE
        |--------------------------------------------------------------------------
     * HOW IT WORKS (FLOW)

        Sales data → Compare (today vs yesterday)
                ↓
        Inventory check
                ↓
        Product performance check
                ↓
        Branch performance check
                ↓
        Customer activity check
                ↓
        Rule engine
                ↓
        AI explanation output
     */

    public function salesDrop()
    {
        /*
        |--------------------------------------------------------------------------
        | 1. SALES COMPARISON
        |--------------------------------------------------------------------------
        */

        $today = Sale::whereDate('transaction_date', now())->sum('total_amount');

        $yesterday = Sale::whereDate('transaction_date', now()->subDay())->sum('total_amount');

        $dropPercent = $yesterday > 0
            ? (($yesterday - $today) / $yesterday) * 100
            : 0;

        /*
        |--------------------------------------------------------------------------
        | 2. LOW STOCK IMPACT
        |--------------------------------------------------------------------------
        */

        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'reorder_level')
            ->pluck('id');

        $lowStockImpact = SaleItem::whereIn('product_id', $lowStockProducts)
            ->whereDate('created_at', now())
            ->count();

        /*
        |--------------------------------------------------------------------------
        | 3. TOP PRODUCT DECLINE
        |--------------------------------------------------------------------------
        */

        $topProductsYesterday = SaleItem::select('product_id', DB::raw('SUM(quantity) as qty'))
            ->whereDate('created_at', now()->subDay())
            ->groupBy('product_id')
            ->orderByDesc('qty')
            ->limit(5)
            ->pluck('product_id');

        $topProductsToday = SaleItem::select('product_id', DB::raw('SUM(quantity) as qty'))
            ->whereDate('created_at', now())
            ->groupBy('product_id')
            ->pluck('product_id');

        $missingProducts = $topProductsYesterday->diff($topProductsToday);

        /*
        |--------------------------------------------------------------------------
        | 4. BRANCH PERFORMANCE DROP
        |--------------------------------------------------------------------------
        */

        $branchPerformance = Sale::select(
                'branch_id',
                DB::raw('SUM(total_amount) as total')
            )
            ->whereDate('transaction_date', now())
            ->groupBy('branch_id')
            ->get();

        $lowBranch = $branchPerformance->sortBy('total')->first();

        /*
        |--------------------------------------------------------------------------
        | 5. CUSTOMER ACTIVITY DROP
        |--------------------------------------------------------------------------
        */

        $customerToday = Sale::whereDate('transaction_date', now())
            ->distinct('customer_name')
            ->count();

        $customerYesterday = Sale::whereDate('transaction_date', now()->subDay())
            ->distinct('customer_name')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | 6. AI INSIGHT ENGINE (RULE-BASED)
        |--------------------------------------------------------------------------
        */

        $insights = [];

        if ($dropPercent > 20) {
            $insights[] = "Sales dropped by " . round($dropPercent, 2) . "% compared to yesterday.";
        }

        if ($lowStockImpact > 10) {
            $insights[] = "Low stock products are affecting sales performance.";
        }

        if ($missingProducts->count() > 0) {
            $insights[] = "Top selling products are missing in today's sales (possible stock or demand issue).";
        }

        if ($customerToday < $customerYesterday) {
            $insights[] = "Customer traffic has decreased compared to yesterday.";
        }

        if ($lowBranch) {
            $branch = Branch::find($lowBranch->branch_id);
            $insights[] = "Branch '{$branch->name}' is underperforming significantly.";
        }

        /*
        |--------------------------------------------------------------------------
        | 7. ROOT CAUSES
        |--------------------------------------------------------------------------
        */

        $causes = [];

        if ($lowStockImpact > 10) $causes[] = "inventory_shortage";
        if ($missingProducts->count() > 0) $causes[] = "product_availability_issue";
        if ($customerToday < $customerYesterday) $causes[] = "demand_drop";
        if ($lowBranch) $causes[] = "branch_underperformance";

        /*
        |--------------------------------------------------------------------------
        | 8. RECOMMENDATION ENGINE
        |--------------------------------------------------------------------------
        */

        $recommendation = "Monitor sales trends closely.";

        if (in_array("inventory_shortage", $causes)) {
            $recommendation = "Restock high-demand products immediately.";
        }

        if (in_array("branch_underperformance", $causes)) {
            $recommendation = "Audit underperforming branches and staff activity.";
        }

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'status' => $dropPercent > 20 ? 'warning' : 'stable',
            'drop_percent' => round($dropPercent, 2),
            'insights' => $insights,
            'root_causes' => $causes,
            'recommendation' => $recommendation,
        ]);
    }
}
