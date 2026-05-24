<?php

namespace App\Services;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;

class PredictiveService
{
        /*
        |--------------------------------------------------------------------------
        | PREDICTIVE ANALYTICS ENGINE
        |--------------------------------------------------------------------------
     * CAPABILITIES
        - Sales forecasting (next 7 days)
        - Inventory depletion forecast
     * HOW IT WORKS (FLOW)

        Sales & inventory data → Analyze patterns
                ↓
        Basic forecasting model (moving average + trend)
                ↓
        AI interpretation layer
                ↓
        Actionable insights output
     */

     /*
     |--------------------------------------------------------------------------
     | SALES FORECASTING
     |--------------------------------------------------------------------------
     */


     /*     
        🧠 4. COMBINED DASHBOARD RESPONSE

        You can merge both:

        {
        "sales_forecast": {
            "next_7_days": [12000, 12500, 13000],
            "trend": "increasing"
        },
        "inventory_risk": [
            {
            "product": "Milk",
            "days_left": 3,
            "risk": "HIGH"
            }
        ]
        }
     */
    public function salesForecast()
    {
        /*
        |--------------------------------------------------------------------------
        | 1. GET DAILY SALES (LAST 30 DAYS)
        |--------------------------------------------------------------------------
        */

        $dailySales = Sale::select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('transaction_date', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total');

        /*
        |--------------------------------------------------------------------------
        | 2. BASIC FORECAST MODEL (MOVING AVERAGE + TREND)
        |--------------------------------------------------------------------------
        */

        $avg = $dailySales->avg();
        $trend = $this->calculateTrend($dailySales);

        // forecast next 7 days
        $forecast = [];

        for ($i = 1; $i <= 7; $i++) {
            $forecast[] = round($avg + ($trend * $i), 2);
        }

        /*
        |--------------------------------------------------------------------------
        | 3. AI INTERPRETATION
        |--------------------------------------------------------------------------
        */

        $direction = $trend > 0 ? 'increasing' : 'decreasing';

        return response()->json([
            'model' => 'moving_average_trend_v1',
            'average_daily_sales' => round($avg, 2),
            'trend_per_day' => round($trend, 2),
            'forecast_next_7_days' => $forecast,
            'insight' => "Sales are $direction based on recent trend.",
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INVENTORY FORECAST
    |--------------------------------------------------------------------------
    */
    public function inventoryForecast()
    {
        /*
        |--------------------------------------------------------------------------
        | 1. DAILY SALES PER PRODUCT
        |--------------------------------------------------------------------------
        */

        $products = Product::withSum(['saleItems as sold_qty' => function ($q) {
            $q->where('created_at', '>=', now()->subDays(7));
        }], 'quantity')->get();

        /*
        |--------------------------------------------------------------------------
        | 2. DEPLETION CALCULATION
        |--------------------------------------------------------------------------
        */

        $forecast = $products->map(function ($p) {

            $dailyAvg = $p->sold_qty / 7;

            if ($dailyAvg <= 0) {
                return [
                    'product' => $p->name,
                    'status' => 'no_sales',
                    'days_left' => null
                ];
            }

            $daysLeft = $p->stock_quantity / $dailyAvg;

            return [
                'product' => $p->name,
                'stock' => $p->stock_quantity,
                'daily_sales_avg' => round($dailyAvg, 2),
                'days_left' => round($daysLeft, 1),
                'risk' => $daysLeft < 5 ? 'HIGH' : ($daysLeft < 10 ? 'MEDIUM' : 'LOW')
            ];
        });

        return response()->json([
            'inventory_forecast' => $forecast
        ]);
    }

    private function calculateTrend($data)
    {
        $count = count($data);

        if ($count < 2) return 0;

        $firstHalf = $data->take(intval($count / 2))->avg();
        $secondHalf = $data->skip(intval($count / 2))->avg();

        return ($secondHalf - $firstHalf) / max($count / 2, 1);
    }
}
