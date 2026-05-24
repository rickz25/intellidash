<?php

namespace App\Services;

use App\Data\ChartData;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ChartService
{
    public function dashboardCharts(): array
    {
        return Cache::remember(
            'dashboard.charts',
            now()->addMinutes(5),
            fn () => [
                'sales_trend' => $this->salesTrend30Days(),
                'revenue_by_branch' => $this->revenueByBranch(),
                'top_products' => $this->topProducts(),
                'low_stock_products' => $this->lowStockProducts(),
                'monthly_revenue' => $this->monthlyRevenue(),
                'payment_methods' => $this->paymentMethods(),
                'fraud_risk_trend' => $this->fraudRiskTrend(),
                'sales_by_category' => $this->salesByCategory(),
            ]
        );
    }

    public function salesTrend30Days(): array
    {
        $data = Sale::query()
            ->selectRaw('DATE(transaction_date) as date')
            ->selectRaw('SUM(total_amount) as total')
            ->where('transaction_date', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $chart = new ChartData(
            type: 'line',
            title: 'Sales Trend (30 Days)',
            labels: $data->pluck('date')->values()->all(),
            datasets: [[
                'label' => 'Sales',
                'data' => $data->pluck('total')
                    ->map(fn ($v) => (float) $v)
                    ->values()
                    ->all(),
                'borderColor' => '#3b82f6',
                'backgroundColor' => 'rgba(59,130,246,0.1)',
                'fill' => true,
                'tension' => 0.4,
            ]]
        );

        return $chart->toArray();
    }

    public function revenueByBranch(): array
    {
        $data = DB::table('sales')
            ->join('branches', 'sales.branch_id', '=', 'branches.id')
            ->selectRaw('branches.name as branch')
            ->selectRaw('SUM(total_amount) as revenue')
            ->groupBy('branches.name')
            ->orderByDesc('revenue')
            ->get();

        $chart = new ChartData(
            type: 'bar',
            title: 'Revenue by Branch',
            labels: $data->pluck('branch')->all(),
            datasets: [[
                'label' => 'Revenue',
                'data' => $data->pluck('revenue')
                    ->map(fn ($v) => (float) $v)
                    ->all(),

                'backgroundColor' => '#10b981',
            ]]
        );
        return $chart->toArray();
    }

    public function topProducts(int $limit = 10): array
    {
        $data = Product::query()
            ->withSum('saleItems', 'quantity')
            ->orderByDesc('sale_items_sum_quantity')
            ->limit($limit)
            ->get();

        $chart = new ChartData(
            type: 'bar',
            title: 'Top Products',
            labels: $data->pluck('name')->all(),
            datasets: [[
                'label' => 'Units Sold',
                'data' => $data->pluck('sale_items_sum_quantity')
                    ->map(fn ($v) => (int) ($v ?? 0))
                    ->all(),

                'backgroundColor' => '#6366f1',
            ]]
        );
        return $chart->toArray();
    }

    public function lowStockProducts(): array
    {
        $data = Product::query()
            ->where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity')
            ->limit(10)
            ->get();

        $chart = new ChartData(
            type: 'bar',
            title: 'Low Stock Products',
            labels: $data->pluck('name')->all(),
            datasets: [[
                'label' => 'Stock Left',
                'data' => $data->pluck('stock_quantity')
                    ->map(fn ($v) => (int) $v)
                    ->all(),

                'backgroundColor' => '#ef4444',
            ]]
        );
        return $chart->toArray();
    }

    public function monthlyRevenue(): array
    {
        $data = Sale::query()
            ->selectRaw('MONTH(transaction_date) as month')
            ->selectRaw('SUM(total_amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $chart = new ChartData(
            type: 'line',
            title: 'Monthly Revenue',
            labels: $data->pluck('month')
                ->map(fn ($m) => date('F', mktime(0, 0, 0, $m, 1)))
                ->all(),

            datasets: [[
                'label' => 'Revenue',
                'data' => $data->pluck('total')
                    ->map(fn ($v) => (float) $v)
                    ->all(),

                'borderColor' => '#14b8a6',
                'fill' => true,
            ]]
        );
        return $chart->toArray();
    }

    public function paymentMethods(): array
    {
        $data = Sale::query()
            ->selectRaw('payment_method')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('payment_method')
            ->get();

        $chart = new ChartData(
            type: 'doughnut',
            title: 'Payment Method Breakdown',
            labels: $data->pluck('payment_method')->all(),
            datasets: [[
                'data' => $data->pluck('total')
                    ->map(fn ($v) => (int) $v)
                    ->all(),

                'backgroundColor' => [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                ],
            ]]
        );
        return $chart->toArray();
    }

    public function fraudRiskTrend(): array
    {
        $data = DB::table('fraud_logs')
            ->selectRaw('DATE(created_at) as day')
            ->selectRaw('AVG(risk_score) as score')
            ->groupBy('day')
            ->orderBy('day')
            ->limit(30)
            ->get();

        return [
            'type' => 'line',
            'title' => 'Fraud Risk Trend',
            'labels' => $data->pluck('day')->values()->all(),

            'datasets' => [[
                'label' => 'Risk Score',

                'data' => $data->pluck('score')
                    ->map(fn ($v) => round((float) $v, 2))
                    ->values()
                    ->all(),

                'borderColor' => '#ef4444',
                'backgroundColor' => 'rgba(239,68,68,0.1)',
                'fill' => true,
                'tension' => 0.4,
            ]],
        ];
    }

    public function salesByCategory(): array
    {
        $data = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category')
            ->selectRaw('SUM(sale_items.quantity) as total')
            ->groupBy('categories.name')
            ->get();

        $chart = new ChartData(
            type: 'pie',
            title: 'Sales by Category',
            labels: $data->pluck('category')->all(),
            datasets: [[
                'data' => $data->pluck('total')
                    ->map(fn ($v) => (int) $v)
                    ->all(),

                'backgroundColor' => [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ef4444',
                ],
            ]]
        );
        return $chart->toArray();
    }
}
