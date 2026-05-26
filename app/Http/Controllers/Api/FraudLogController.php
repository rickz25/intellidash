<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FraudLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FraudLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 10), 100);

        $search = trim((string) $request->string('search'));

        $query = FraudLog::query()
            ->select([
                'id',
                'risk_score',
                'risk_level',
                'high_discount_alerts',
                'sales_spikes_count',
                'suspicious_cashiers_count',
                'meta',
                'created_at',
            ]);

        // ✅ search support
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('risk_score', 'like', "%{$search}%")
                    ->orWhere('risk_level', 'like', "%{$search}%")
                    ->orWhere('high_discount_alerts', 'like', "%{$search}%")
                    ->orWhere('sales_spikes_count', 'like', "%{$search}%")
                    ->orWhere('suspicious_cashiers_count', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query
                ->latest()
                ->paginate($perPage)
                ->withQueryString()
        );
    }
}
