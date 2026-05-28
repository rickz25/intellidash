<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SaleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 10), 100);
        $search = trim((string) $request->query('search', ''));

        $query = Sale::query()
            ->select([
                'id',
                'branch_id',
                'invoice_no',
                'customer_name',
                'transaction_date',
                'subtotal',
                'tax',
                'discount',
                'total_amount',
                'payment_method',
                'status',
                'created_by',
                'created_at',
                'updated_at',
            ])
            ->with(['branch:id,name', 'user:id,name'])
            ->withCount('items')
            ->latest();

        if ($search !== '') {
            $query->where(function ($query) use ($search) {
                $query
                    ->where('invoice_no', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('payment_method', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('branch', function ($branchQuery) use ($search) {
                        $branchQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return response()->json(
            $query->paginate($perPage)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['created_by'] = $validated['created_by'] ?? $request->user()?->id;

        $sale = Sale::create($validated)->load(['branch:id,name', 'user:id,name']);

        return response()->json([
            'message' => 'Sale created successfully.',
            'sale' => $sale,
        ], 201);
    }

    public function show(Sale $sale): JsonResponse
    {
        return response()->json(
            $sale->load(['branch:id,name', 'user:id,name', 'items.product:id,name,sku'])
        );
    }

    public function update(Request $request, Sale $sale): JsonResponse
    {
        $validated = $request->validate($this->rules($sale));
        $validated['created_by'] = $validated['created_by'] ?? $sale->created_by;

        $sale->update($validated);

        return response()->json([
            'message' => 'Sale updated successfully.',
            'sale' => $sale->fresh()->load(['branch:id,name', 'user:id,name']),
        ]);
    }

    public function destroy(Sale $sale): JsonResponse
    {
        $sale->delete();

        return response()->json(['message' => 'Sale deleted successfully.']);
    }

    private function rules(?Sale $sale = null): array
    {
        return [
            'branch_id' => ['required', 'exists:branches,id'],
            'invoice_no' => ['required', 'string', 'max:255', Rule::unique('sales', 'invoice_no')->ignore($sale?->id)],
            'customer_name' => ['nullable', 'string', 'max:255'],
            'transaction_date' => ['required', 'date'],
            'subtotal' => ['required', 'numeric', 'min:0'],
            'tax' => ['required', 'numeric', 'min:0'],
            'discount' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['completed', 'cancelled'])],
            'created_by' => ['nullable', 'exists:users,id'],
        ];
    }
}
