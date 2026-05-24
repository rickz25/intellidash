<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Role::query()->withCount('users')->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $role = Role::create($validated);

        return response()->json([
            'message' => 'Role created successfully.',
            'role' => $role,
        ], 201);
    }

    public function show(Role $role): JsonResponse
    {
        return response()->json($role->loadCount('users'));
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate($this->rules($role));
        $role->update($validated);

        return response()->json([
            'message' => 'Role updated successfully.',
            'role' => $role->fresh()->loadCount('users'),
        ]);
    }

    public function destroy(Role $role): JsonResponse
    {
        if ($role->users()->exists()) {
            return response()->json([
                'message' => 'This role has users and cannot be deleted.',
            ], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully.']);
    }

    private function rules(?Role $role = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role?->id)],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'max:255'],
        ];
    }
}
