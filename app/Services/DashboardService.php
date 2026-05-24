<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public static function getDashboardData()
    {
        return [
            'summary' => [
                'total_sales' => Sale::sum('total_amount'),
            ]
        ];
    }
}
