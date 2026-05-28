<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AiLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 15), 100);
        $search = trim((string) $request->string('search'));

        $query = AiLog::query()
            ->with('user:id,name,email')
            ->latest();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('prompt', 'like', "%{$search}%")
                    ->orWhere('response', 'like', "%{$search}%")
                    ->orWhere('request_type', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($perPage)->withQueryString());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['user_id'] = $validated['user_id'] ?? $request->user()?->id;

        $log = AiLog::create($validated)->load('user:id,name,email');

        return response()->json([
            'message' => 'AI log created successfully.',
            'ai_log' => $log,
        ], 201);
    }

    public function show(AiLog $aiLog): JsonResponse
    {
        return response()->json($aiLog->load('user:id,name,email'));
    }

    public function update(Request $request, AiLog $aiLog): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['user_id'] = $validated['user_id'] ?? $aiLog->user_id;
        $aiLog->update($validated);

        return response()->json([
            'message' => 'AI log updated successfully.',
            'ai_log' => $aiLog->fresh()->load('user:id,name,email'),
        ]);
    }

    public function destroy(AiLog $aiLog): JsonResponse
    {
        $aiLog->delete();

        return response()->json(['message' => 'AI log deleted successfully.']);
    }

    private function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'prompt' => ['required', 'string'],
            'response' => ['nullable', 'string'],
            'tokens_used' => ['required', 'integer', 'min:0'],
            'request_type' => ['required', 'string', 'max:255'],
            'response_time' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['success', 'failed'])],
        ];
    }
}
