<?php

use App\Http\Controllers\Api\AiDashboardController;
use App\Http\Controllers\Api\AiLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DashboardV2Controller;
use App\Http\Controllers\Api\DashboardV3Controller;
use App\Http\Controllers\Api\FraudLogController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\SaleItemController;
use App\Http\Controllers\Api\UploadedReportController;
use App\Services\PredictiveService;
use App\Services\SalesInsightService;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Email verification

// POST /email/verify
// POST /forgot-password
// POST /reset-password

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    /*
    |--------------------------------------------------------------------------
    | Dashboard Endpoints
    |--------------------------------------------------------------------------
    */

    // GET /dashboard - Main dashboard overview (KPIs, summary stats)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // GET /dashboard/v2 - Enhanced dashboard version 2
    Route::get('/dashboard/v2', [DashboardV2Controller::class, 'index']);

    // GET /dashboard/v3 - Advanced dashboard version 3 (latest UI/logic)
    Route::get('/dashboard/v3', [DashboardV3Controller::class, 'index']);

    // GET /dashboard/kpis - Key performance indicators
    Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);

    // GET /dashboard/ai - AI-powered dashboard insights
    Route::get('/dashboard/ai', [AiDashboardController::class, 'index']);

    // POST /dashboard/ai/actions/forecast - Run AI sales forecast
    Route::post('/dashboard/ai/actions/forecast', [AiDashboardController::class, 'runForecast']);

    // POST /dashboard/ai/actions/fraud - Run fraud detection analysis
    Route::post('/dashboard/ai/actions/fraud', [AiDashboardController::class, 'detectFraud']);

    // POST /dashboard/ai/actions/inventory - Run inventory optimization AI
    Route::post('/dashboard/ai/actions/inventory', [AiDashboardController::class, 'optimizeInventory']);

    // GET /insights/sales-drop - Detect abnormal sales drop insights
    Route::get('/insights/sales-drop', [SalesInsightService::class, 'salesDrop']);

    // GET /insights/sales-forecast - Predict future sales trends
    Route::get('/insights/sales-forecast', [PredictiveService::class, 'salesForecast']);

    /*
    |--------------------------------------------------------------------------
    | Admin-Only Management Endpoints
    |--------------------------------------------------------------------------
    */

    // CRUD /branches - Manage branch locations
    Route::apiResource('branches', BranchController::class);

    // CRUD /categories - Manage product categories
    Route::apiResource('categories', CategoryController::class);

    // CRUD /uploaded-reports - Manage uploaded CSV / reports
    Route::apiResource('uploaded-reports', UploadedReportController::class);

    // CRUD /ai-logs - View AI system logs
    Route::apiResource('ai-logs', AiLogController::class);

    // CRUD /notifications - Manage system notifications
    Route::apiResource('notifications', NotificationController::class);

    // CRUD /roles - Manage user roles & permissions
    Route::apiResource('roles', RoleController::class);

    /*
    |--------------------------------------------------------------------------
    | Product Management
    |--------------------------------------------------------------------------
    */

    // CRUD /products - Manage product catalog (Admin only)
    Route::middleware('role:Admin')
        ->apiResource('products', ProductController::class);

    /*
    |--------------------------------------------------------------------------
    | Sales Endpoints
    |--------------------------------------------------------------------------
    */

    // POST /sales - Create new sale transaction
    Route::middleware('permission:sales.create')
        ->post('/sales', [SaleController::class, 'store']);

    // GET /sales - List all sales
    Route::middleware('permission:sales.read')
        ->get('/sales', [SaleController::class, 'index']);

    // GET /sales/{sale} - View specific sale details
    Route::middleware('permission:sales.read')
        ->get('/sales/{sale}', [SaleController::class, 'show']);

    // PUT /sales/{sale} - Update existing sale record
    Route::middleware('permission:sales.update')
        ->put('/sales/{sale}', [SaleController::class, 'update']);

    // DELETE /sales/{sale} - Delete sale record
    Route::middleware('permission:sales.delete')
        ->delete('/sales/{sale}', [SaleController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Sale Items
    |--------------------------------------------------------------------------
    */

    // CRUD /sale-items - Manage items inside a sale transaction
    Route::apiResource('sale-items', SaleItemController::class);

    /*
    |--------------------------------------------------------------------------
    | Fraud Logs
    |--------------------------------------------------------------------------
    */

    // CRUD /fraud-logs - View detected fraud activity logs
    Route::apiResource('fraud-logs', FraudLogController::class);
});

