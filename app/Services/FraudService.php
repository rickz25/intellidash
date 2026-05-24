<?php

namespace App\Services;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use App\Models\FraudLog;

class FraudService
{
    /*
            |--------------------------------------------------------------------------
            | FRAUD DETECTION ENGINE
            |--------------------------------------------------------------------------
            🎯 DETECTS
                fake discounts
                abnormal refunds
                suspicious sales spikes
                cashier anomalies
                inventory manipulation
        * HOW IT WORKS (FLOW)
    
            Sales data → Analyze for anomalies
                    ↓
            Rule-based checks
                    ↓
            AI risk scoring
                    ↓
            Alert generation
        */
    // public function analyze()
    // {
    //     /*
    //     |--------------------------------------------------------------------------
    //     | 1. ABNORMAL DISCOUNTS
    //     |--------------------------------------------------------------------------
    //     */

    //     $highDiscountSales = Sale::where('discount', '>', 500)->count();

    //     /*
    //     |--------------------------------------------------------------------------
    //     | 2. SALES SPIKES
    //     |--------------------------------------------------------------------------
    //     */

    //     $dailySales = Sale::select(
    //             DB::raw('DATE(transaction_date) as date'),
    //             DB::raw('SUM(total_amount) as total')
    //         )
    //         ->groupBy('date')
    //         ->get();

    //     $avg = $dailySales->avg('total');

    //     $spikes = $dailySales->filter(fn ($d) => $d->total > $avg * 2);

    //     /*
    //     |--------------------------------------------------------------------------
    //     | 3. CASHIER ANOMALY (CREATED_BY)
    //     |--------------------------------------------------------------------------
    //     */

    //     $cashierActivity = Sale::select(
    //             'created_by',
    //             DB::raw('COUNT(*) as total_sales'),
    //             DB::raw('SUM(total_amount) as revenue')
    //         )
    //         ->groupBy('created_by')
    //         ->get();

    //     $suspiciousCashiers = $cashierActivity->filter(
    //         fn ($c) => $c->total_sales > 200 && $c->revenue < 10000
    //     );

    //     /*
    //     |--------------------------------------------------------------------------
    //     | RESPONSE
    //     |--------------------------------------------------------------------------
    //     */

    //     return response()->json([
    //         'high_discount_alerts' => $highDiscountSales,
    //         'sales_spikes' => $spikes->values(),
    //         'suspicious_cashiers' => $suspiciousCashiers->values(),
    //         'risk_level' =>
    //             ($highDiscountSales > 10 || $spikes->count() > 3)
    //                 ? 'HIGH'
    //                 : 'LOW'
    //     ]);
    // }

    public function analyze()
    {
        $highDiscountSales = Sale::where('discount', '>', 500)->count();

        $dailySales = Sale::select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('date')
            ->get();

        $avg = $dailySales->avg('total') ?? 0;

        $spikes = $dailySales->filter(
            fn ($d) => $d->total > ($avg * 2)
        );

        $cashierActivity = Sale::select(
                'created_by',
                DB::raw('COUNT(*) as total_sales'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('created_by')
            ->get();

        $suspiciousCashiers = $cashierActivity->filter(
            fn ($c) => $c->total_sales > 200 && $c->revenue < 10000
        );

        $riskScore = 0;

        $riskScore += min($highDiscountSales * 2, 40);
        $riskScore += min($spikes->count() * 10, 30);
        $riskScore += min($suspiciousCashiers->count() * 15, 30);

        $riskLevel = match (true) {
            $riskScore >= 70 => 'HIGH',
            $riskScore >= 40 => 'MEDIUM',
            default => 'LOW',
        };

        $fraudData = [
            'risk_score' => $riskScore,
            'risk_level' => $riskLevel,
            'high_discount_alerts' => $highDiscountSales,
            'sales_spikes_count' => $spikes->count(),
            'suspicious_cashiers_count' => $suspiciousCashiers->count(),
        ];

        // 🔥 Save historical fraud snapshot
        FraudLog::create([
            ...$fraudData,

            'meta' => [
                'average_sales' => $avg,
                'generated_at' => now()->toDateTimeString(),
            ],
        ]);

        return response()->json([
            'fraud_kpi' => $fraudData,
        ]);
    }

    public function latestFraud()
    {
        $latestFraud = FraudLog::latest()->first();

        if (! $latestFraud) {
            return response()->json([
                'fraud_kpi' => [
                    'risk_score' => 0,
                    'risk_level' => 'LOW',
                    'high_discount_alerts' => 0,
                    'sales_spikes_count' => 0,
                    'suspicious_cashiers_count' => 0,
                ],
            ]);
        }

        return response()->json([
            'fraud_kpi' => [
                'risk_score' => $latestFraud->risk_score,
                'risk_level' => $latestFraud->risk_level,
                'high_discount_alerts' => $latestFraud->high_discount_alerts,
                'sales_spikes_count' => $latestFraud->sales_spikes_count,
                'suspicious_cashiers_count' => $latestFraud->suspicious_cashiers_count,
                'meta' => $latestFraud->meta,
                'generated_at' => $latestFraud->created_at,
            ],
        ]);
    }
}
