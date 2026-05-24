<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaleItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 10), 100);

        return response()->json(
            SaleItem::query()
                ->select(['id', 'sale_id', 'product_id', 'quantity', 'unit_price', 'discount', 'total', 'created_at'])
                ->with(['sale:id,invoice_no', 'product:id,name,sku'])
                ->latest()
                ->paginate($perPage)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $item = SaleItem::create($validated)->load(['sale:id,invoice_no', 'product:id,name,sku']);

        return response()->json([
            'message' => 'Sale item created successfully.',
            'sale_item' => $item,
        ], 201);
    }

    public function show(SaleItem $saleItem): JsonResponse
    {
        return response()->json($saleItem->load(['sale:id,invoice_no', 'product:id,name,sku']));
    }

    public function update(Request $request, SaleItem $saleItem): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $saleItem->update($validated);

        return response()->json([
            'message' => 'Sale item updated successfully.',
            'sale_item' => $saleItem->fresh()->load(['sale:id,invoice_no', 'product:id,name,sku']),
        ]);
    }

    public function destroy(SaleItem $saleItem): JsonResponse
    {
        $saleItem->delete();

        return response()->json(['message' => 'Sale item deleted successfully.']);
    }

    private function rules(): array
    {
        return [
            'sale_id' => ['required', 'exists:sales,id'],
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'discount' => ['required', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],
        ];
    }
}
