<?php

use App\Http\Controllers\Api\AiDashboardController;
use App\Http\Controllers\Api\AiLogController;
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

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {

//     Route::get('/me', [AuthController::class, 'me']);

//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::post('/logout-all', [AuthController::class, 'logoutAll']);
// });

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/v2', [DashboardV2Controller::class, 'index']);
    Route::get('/dashboard/v3', [DashboardV3Controller::class, 'index']);
    Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);
    Route::get('/dashboard/ai', [AiDashboardController::class, 'index']);

    Route::post('/dashboard/ai/actions/forecast', [AiDashboardController::class, 'runForecast']);
    Route::post('/dashboard/ai/actions/fraud', [AiDashboardController::class, 'detectFraud']);
    Route::post('/dashboard/ai/actions/inventory', [AiDashboardController::class, 'optimizeInventory']);
    Route::get('/insights/sales-drop', [SalesInsightService::class, 'salesDrop']);
    Route::get('/insights/sales-forecast', [PredictiveService::class, 'salesForecast']);

    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:Admin')->group(function () {

        Route::apiResource('branches', BranchController::class);

        Route::apiResource('categories', CategoryController::class);

        Route::apiResource('uploaded-reports', UploadedReportController::class);

        Route::apiResource('ai-logs', AiLogController::class);

        Route::apiResource('notifications', NotificationController::class);

        Route::apiResource('roles', RoleController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Product Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:Admin')
        ->apiResource('products', ProductController::class);

    /*
    |--------------------------------------------------------------------------
    | Sales Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:sales.create')
        ->post('/sales', [SaleController::class, 'store']);

    Route::middleware('permission:sales.read')
        ->get('/sales', [SaleController::class, 'index']);

    Route::middleware('permission:sales.read')
        ->get('/sales/{sale}', [SaleController::class, 'show']);

    Route::middleware('permission:sales.update')
        ->put('/sales/{sale}', [SaleController::class, 'update']);

    Route::middleware('permission:sales.delete')
        ->delete('/sales/{sale}', [SaleController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Sale Items
    |--------------------------------------------------------------------------
    */

    Route::apiResource('sale-items', SaleItemController::class);

    /*
    |--------------------------------------------------------------------------
    | Fraud Logs
    |--------------------------------------------------------------------------
    */

    Route::apiResource('fraud-logs', FraudLogController::class);
});
