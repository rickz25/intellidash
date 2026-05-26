<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    public function index(): JsonResponse
    {
        $branches = Branch::query()
            ->withCount(['users', 'products', 'sales'])
            ->latest()
            ->get();

        return response()->json($branches);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'branch_code' => ['required', 'string', 'max:50', 'unique:branches,branch_code'],
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', 'unique:branches,email'],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
        ]);

        $branch = Branch::create($validated);

        return response()->json([
            'message' => 'Branch created successfully.',
            'branch' => $branch,
        ], 201);
    }

    public function show(Branch $branch): JsonResponse
    {
        return response()->json(
            $branch->loadCount(['users', 'products', 'sales'])
        );
    }

    public function update(Request $request, Branch $branch): JsonResponse
    {
        $validated = $request->validate([
            'branch_code' => ['required', 'string', 'max:50', Rule::unique('branches', 'branch_code')->ignore($branch->id)],
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('branches', 'email')->ignore($branch->id)],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
        ]);

        $branch->update($validated);

        return response()->json([
            'message' => 'Branch updated successfully.',
            'branch' => $branch->fresh()->loadCount(['users', 'products', 'sales']),
        ]);
    }

    public function destroy(Branch $branch): JsonResponse
    {
        if ($branch->users()->exists() || $branch->products()->exists() || $branch->sales()->exists()) {
            return response()->json([
                'message' => 'This branch is already linked to users, products, or sales and cannot be deleted.',
            ], 422);
        }

        $branch->delete();

        return response()->json([
            'message' => 'Branch deleted successfully.',
        ]);
    }
}
