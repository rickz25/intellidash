<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FraudLog extends Model
{
    protected $fillable = [
        'risk_score',
        'risk_level',
        'high_discount_alerts',
        'sales_spikes_count',
        'suspicious_cashiers_count',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];
}
