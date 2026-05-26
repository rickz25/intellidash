<?php

namespace App\Services;

use App\Models\Sale;

class DashboardService
{
    public static function getDashboardData()
    {
        return [
            'summary' => [
                'total_sales' => Sale::sum('total_amount'),
            ],
        ];
    }
}
