<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ChartService;
use App\Services\FraudService;
use App\Services\PredictiveService;
use App\Services\SalesInsightService;
use Illuminate\Http\JsonResponse;

class AiDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $v2 = $this->safeData(app(DashboardV2Controller::class)->index());
        $v3 = $this->safeData(app(DashboardV3Controller::class)->index());

        $fraud = $this->safeData(app(FraudService::class)->latestFraud())['fraud_kpi'] ?? null;
        $salesInsight = $this->safeData(app(SalesInsightService::class)->salesDrop());
        $predictive = $this->safeData(app(PredictiveService::class)->salesForecast());
        $inventoryRisk = $this->getInventoryRisk($v2);
        $charts = app(ChartService::class)->dashboardCharts();
        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'reorder_level')
            ->select('id', 'name', 'stock_quantity', 'reorder_level')
            ->orderByRaw('(reorder_level - stock_quantity) DESC')
            ->limit(20)
            ->get();

        return response()->json([
            'realtime' => [
                'revenue' => $v2['sales_kpis']['net_revenue'] ?? 0,
                'sales' => $v2['sales_kpis']['total_sales'] ?? 0,
                'inventory' => $v2['inventory_kpis']['inventory_value'] ?? 0,

                'fraud' => $fraud,
                'sales_insight' => $salesInsight,
                'predictive' => $predictive,
                'inventory_risk' => $inventoryRisk,
                'low_stock_products' => $lowStockProducts->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'stock_quantity' => $p->stock_quantity,
                    'reorder_level' => $p->reorder_level,
                ]),
                'trends' => $v2['trends'] ?? [],
            ],

            'executive' => $this->normalizeV3($v3),

            'charts' => $charts,

            'ai_layer' => [
                'status' => $this->getMarketStatus($salesInsight),
                'risk_level' => $this->getRiskLevel($fraud),
                'recommendation' => $this->getRecommendation($v2, $v3, $inventoryRisk),
            ],
        ]);
    }

    public function runForecast(): JsonResponse
    {
        $forecast = $this->safeData(app(PredictiveService::class)->salesForecast());

        return response()->json([
            'message' => 'AI forecast recalculated successfully.',
            'predictive' => $forecast,
            'dashboard' => $this->index()->getData(true),
        ]);
    }

    public function detectFraud(): JsonResponse
    {
        $fraud = $this->safeData(app(FraudService::class)->analyze())['fraud_kpi'] ?? null;

        return response()->json([
            'message' => 'Fraud detection recalculated successfully.',
            'fraud' => $fraud,
            'dashboard' => $this->index()->getData(true),
        ]);
    }

    public function optimizeInventory(): JsonResponse
    {
        $v2 = $this->safeData(app(DashboardV2Controller::class)->index());
        $inventoryRisk = $this->getInventoryRisk($v2);
        $charts = app(ChartService::class)->dashboardCharts();

        return response()->json([
            'message' => 'Inventory optimization recalculated successfully.',
            'inventory_risk' => $inventoryRisk,
            'dashboard' => $this->index()->getData(true),
        ]);
    }

    private function safeData($response): array
    {
        if ($response instanceof JsonResponse || method_exists($response, 'getData')) {
            return $response->getData(true) ?? [];
        }

        return is_array($response) ? $response : [];
    }

    private function normalizeV3(array $v3): array
    {
        return [
            'yoy_sales' => $v3['yoy_sales'] ?? ['growth_percent' => 0],
            'profit_margin' => $v3['profit_margin'] ?? 0,
            'cash_flow' => $v3['cash_flow'] ?? [
                'cash_in' => 0,
                'cash_out_inventory_value' => 0,
            ],
            'monthly_trend' => $v3['trends']['monthly'] ?? $v3['monthly_trend'] ?? [],
        ];
    }

    private function getInventoryRisk(array $v2): array
    {
        return $v2['inventory_risk'] ?? [
            'high_risk_count' => $v2['inventory_kpis']['low_stock_count'] ?? 0,
            'critical_product' => $v2['inventory_kpis']['critical_product'] ?? null,
        ];
    }

    private function getMarketStatus(?array $salesInsight): string
    {
        return ($salesInsight['drop_percent'] ?? 0) > 10 ? 'warning' : 'healthy';
    }

    private function getRiskLevel(?array $fraud): string
    {
        $score = $fraud['risk_score'] ?? 0;

        return match (true) {
            $score > 70 => 'HIGH',
            $score > 40 => 'MEDIUM',
            default => 'LOW',
        };
    }

    private function getRecommendation(array $v2, array $v3, array $inventoryRisk): string
    {
        if (($v3['profit_margin'] ?? 0) < 20) {
            return 'Improve pricing strategy';
        }

        if (($inventoryRisk['high_risk_count'] ?? 0) > 0) {
            return 'Restock critical products';
        }

        return 'System stable';
    }
}

// public function index()
// {
//     // call V2
//     $v2 = app(DashboardV2Controller::class)->index()->getData(true);

//     // call V3
//     $v3 = app(DashboardV3Controller::class)->index()->getData(true);

//     return response()->json([
//         'realtime' => $v2,
//         'executive' => $v3,

//         // 🔥 AI LAYER (computed merge logic)
//         'ai_layer' => [
//             'status' => $this->getMarketStatus($v2, $v3),
//             'risk_level' => $this->getRiskLevel($v2, $v3),
//             'recommendation' => $this->getRecommendation($v2, $v3),
//         ],
//     ]);
// }

// private function getMarketStatus($v2, $v3)
// {
//     $salesDrop = $v2['sales_insight']['drop_percent'] ?? 0;

//     return $salesDrop > 10 ? 'warning' : 'healthy';
// }

// private function getRiskLevel($v2, $v3)
// {
//     $fraud = $v2['fraud']['risk_score'] ?? 0;

//     if ($fraud > 70) return 'HIGH';
//     if ($fraud > 40) return 'MEDIUM';

//     return 'LOW';
// }

// private function getRecommendation($v2, $v3)
// {
//     if (($v3['profit_margin'] ?? 0) < 20) {
//         return 'Improve pricing strategy';
//     }

//     if (($v2['inventory_risk']['high_risk_count'] ?? 0) > 0) {
//         return 'Restock critical products';
//     }

//     return 'System stable';
// }
// ---------------------------------------------------------------------
// public function insights()
// {
//     $todaySales = Sale::whereDate('transaction_date', now())
//         ->sum('total_amount');

//     $yesterdaySales = Sale::whereDate('transaction_date', now()->subDay())
//         ->sum('total_amount');

//     $change = $yesterdaySales > 0
//         ? (($todaySales - $yesterdaySales) / $yesterdaySales) * 100
//         : 0;

//     $insight = "Sales are stable";

//     if ($change < -20) {
//         $insight = "Sales dropped significantly today. Possible demand issue or stock shortage.";
//     }

//     if ($change > 20) {
//         $insight = "Strong sales growth detected. Promotion or demand spike.";
//     }

//     return response()->json([
//         'today_sales' => $todaySales,
//         'yesterday_sales' => $yesterdaySales,
//         'change_percent' => round($change, 2),
//         'insight' => $insight,
//     ]);
// }
// Forecasting (Simple Version)

//     $trend = Sale::selectRaw('MONTH(transaction_date) as m, SUM(total_amount) as t')
//     ->groupBy('m')
//     ->orderBy('m')
//     ->pluck('t');

// $forecast = $trend->avg();
