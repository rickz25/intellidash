<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UploadedReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UploadedReportController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            UploadedReport::query()->with('user:id,name')->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['uploaded_by'] = $validated['uploaded_by'] ?? $request->user()?->id;
        $validated['uploaded_at'] = $validated['uploaded_at'] ?? now();

        $report = UploadedReport::create($validated)->load('user:id,name');

        return response()->json([
            'message' => 'Report record created successfully.',
            'uploaded_report' => $report,
        ], 201);
    }

    public function show(UploadedReport $uploadedReport): JsonResponse
    {
        return response()->json($uploadedReport->load('user:id,name'));
    }

    public function update(Request $request, UploadedReport $uploadedReport): JsonResponse
    {
        $validated = $request->validate($this->rules());
        $validated['uploaded_by'] = $validated['uploaded_by'] ?? $uploadedReport->uploaded_by;
        $uploadedReport->update($validated);

        return response()->json([
            'message' => 'Report record updated successfully.',
            'uploaded_report' => $uploadedReport->fresh()->load('user:id,name'),
        ]);
    }

    public function destroy(UploadedReport $uploadedReport): JsonResponse
    {
        $uploadedReport->delete();

        return response()->json(['message' => 'Report record deleted successfully.']);
    }

    private function rules(): array
    {
        return [
            'uploaded_by' => ['nullable', 'exists:users,id'],
            'file_name' => ['required', 'string', 'max:255'],
            'file_path' => ['required', 'string', 'max:255'],
            'report_type' => ['required', 'string', 'max:255'],
            'total_rows' => ['required', 'integer', 'min:0'],
            'processed_rows' => ['required', 'integer', 'min:0'],
            'failed_rows' => ['required', 'integer', 'min:0'],
            'status' => ['required', Rule::in(['processing', 'completed', 'failed'])],
            'remarks' => ['nullable', 'string'],
            'uploaded_at' => ['nullable', 'date'],
        ];
    }
}
