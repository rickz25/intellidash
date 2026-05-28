<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 15), 100);
        $search = trim((string) $request->string('search'));

        $query = Notification::query()
            ->with('user:id,name,email')
            ->latest();

        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($perPage)->withQueryString());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['user_id'] = $validated['user_id'] ?? $request->user()?->id;

        $notification = Notification::create($validated)->load('user:id,name,email');

        return response()->json([
            'message' => 'Notification created successfully.',
            'notification' => $notification,
        ], 201);
    }

    public function show(Notification $notification): JsonResponse
    {
        return response()->json($notification->load('user:id,name,email'));
    }

    public function update(Request $request, Notification $notification): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['user_id'] = $validated['user_id'] ?? $notification->user_id;
        $notification->update($validated);

        return response()->json([
            'message' => 'Notification updated successfully.',
            'notification' => $notification->fresh()->load('user:id,name,email'),
        ]);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully.']);
    }

    private function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'type' => ['required', Rule::in(['warning', 'info', 'success'])],
            'is_read' => ['required', 'boolean'],
        ];
    }
}
