<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FraudLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
                'updated_at',
            ]);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('risk_score', 'like', "%{$search}%")
                    ->orWhere('risk_level', 'like', "%{$search}%")
                    ->orWhere('high_discount_alerts', 'like', "%{$search}%")
                    ->orWhere('sales_spikes_count', 'like', "%{$search}%")
                    ->orWhere('suspicious_cashiers_count', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate($perPage)->withQueryString());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $fraudLog = FraudLog::create($validated);

        return response()->json([
            'message' => 'Fraud log created successfully.',
            'fraud_log' => $fraudLog,
        ], 201);
    }

    public function show(FraudLog $fraudLog): JsonResponse
    {
        return response()->json($fraudLog);
    }

    public function update(Request $request, FraudLog $fraudLog): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $fraudLog->update($validated);

        return response()->json([
            'message' => 'Fraud log updated successfully.',
            'fraud_log' => $fraudLog->fresh(),
        ]);
    }

    public function destroy(FraudLog $fraudLog): JsonResponse
    {
        $fraudLog->delete();

        return response()->json(['message' => 'Fraud log deleted successfully.']);
    }

    private function rules(): array
    {
        return [
            'risk_score' => ['required', 'integer', 'min:0', 'max:100'],
            'risk_level' => ['required', Rule::in(['LOW', 'MEDIUM', 'HIGH'])],
            'high_discount_alerts' => ['required', 'integer', 'min:0'],
            'sales_spikes_count' => ['required', 'integer', 'min:0'],
            'suspicious_cashiers_count' => ['required', 'integer', 'min:0'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
