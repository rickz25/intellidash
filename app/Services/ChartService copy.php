<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;

class ChartService
{
    public function salesTrend30Days(): array
    {
        $data = Sale::select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('transaction_date', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'type' => 'line',
            'title' => 'Sales Trend (30 Days)',
            'labels' => $data->pluck('date')->values()->all(),
            'datasets' => [[
                'label' => 'Sales',
                'data' => $data->pluck('total')->map(fn ($value) => (float) $value)->values()->all(),
            ]],
        ];
    }

    public function topProducts(int $limit = 10): array
    {
        $data = Product::withSum('saleItems', 'quantity')
            ->orderByDesc('sale_items_sum_quantity')
            ->limit($limit)
            ->get();

        return [
            'type' => 'bar',
            'title' => 'Top Products',
            'labels' => $data->pluck('name')->values()->all(),
            'datasets' => [[
                'label' => 'Sold Qty',
                'data' => $data->pluck('sale_items_sum_quantity')->map(fn ($value) => (int) ($value ?? 0))->values()->all(),
            ]],
        ];
    }

    public function dashboardCharts(): array
    {
        return [
            'sales_trend' => $this->salesTrend30Days(),
            'top_products' => $this->topProducts(),
        ];
    }

    public function generate($request): array
    {
        $intent = strtolower($request->input('prompt'));

        if (str_contains($intent, 'sales') && str_contains($intent, '30')) {
            return $this->salesTrend30Days();
        }

        if (str_contains($intent, 'top') && str_contains($intent, 'product')) {
            return $this->topProducts();
        }

        return [
            'type' => 'empty',
            'title' => 'No matching chart found',
            'labels' => [],
            'datasets' => [],
        ];
    }
}

