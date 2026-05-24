<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    // public function index(Request $request): JsonResponse
    // {
    //     if ($request->boolean('lookup')) {
    //         return response()->json(
    //             Product::query()
    //                 ->select(['id', 'name', 'sku', 'price'])
    //                 ->where('status', true)
    //                 ->orderBy('name')
    //                 ->limit(1000)
    //                 ->get()
    //         );
    //     }

    //     $limit = min((int) $request->integer('limit', 500), 1000);

    //     return response()->json(
    //         Product::query()
    //             ->with(['branch:id,name', 'category:id,name'])
    //             ->latest()
    //             ->limit($limit)
    //             ->get()
    //     );
    // }

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('lookup')) {
            return response()->json(
                Product::query()
                    ->select(['id', 'name', 'sku', 'price'])
                    ->where('status', true)
                    ->orderBy('name')
                    ->limit(1000)
                    ->get()
            );
        }

        $perPage = min((int) $request->integer('per_page', 10), 100);

        $query = Product::query()
            ->with(['branch:id,name', 'category:id,name']);

         // ✅ RISK FILTER
        if ($request->filled('risk')) {
            if ($request->risk === 'high_risk') {
                $query->whereColumn('stock_quantity', '<=', 'reorder_level');
            }

            if ($request->risk === 'low_stock') {
                $query->where('stock_quantity', '<', 10);
            }

            if ($request->risk === 'out_of_stock') {
                $query->where('stock_quantity', '=', 0);
            }
        }

        // ✅ NAME FILTER
        if ($request->filled('product_name')) {
            $query->where('name', 'like', "%{$request->product_name}%");
        }

            return response()->json(
                $query->latest()->paginate($perPage)
            );
        }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $product = Product::create($validated)->load(['branch:id,name', 'category:id,name']);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load(['branch:id,name', 'category:id,name']));
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate($this->rules($product));
        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->fresh()->load(['branch:id,name', 'category:id,name']),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->saleItems()->exists()) {
            return response()->json([
                'message' => 'This product has sale history and cannot be deleted.',
            ], 422);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }

    private function rules(?Product $product = null): array
    {
        return [
            'branch_id' => ['required', 'exists:branches,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($product?->id)],
            'barcode' => ['nullable', 'string', 'max:255', Rule::unique('products', 'barcode')->ignore($product?->id)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
        ];
    }
}
