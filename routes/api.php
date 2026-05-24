<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\{
    BranchController,
    CategoryController,
    ProductController,
    SaleController,
    SaleItemController,
    UploadedReportController,
    AiLogController,
    NotificationController,
    RoleController,
    AiDashboardController,
    DashboardController,
    DashboardV2Controller,
    DashboardV3Controller,
    FraudLogController
};

use App\Http\Controllers\Api\Ai\{
    SalesInsightController,
    ChartController,
    FraudDetectionController,
    PredictiveController
};

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
        'status' => 'ok'
    ]);
});

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {

//     Route::get('/me', [AuthController::class, 'me']);

//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::post('/logout-all', [AuthController::class, 'logoutAll']);
// });

Route::middleware(['auth:sanctum', 'role:Admin'])
    ->get('/ai/sales-drop', [SalesInsightController::class, 'salesDrop']);
Route::middleware(['auth:sanctum'])
->post('/ai/chart', [ChartController::class, 'generate']);
Route::middleware(['auth:sanctum', 'role:Admin'])
    ->get('/ai/fraud-check', [FraudDetectionController::class, 'analyze']);

Route::middleware(['auth:sanctum'])
    ->get('/ai/forecast/sales', [PredictiveController::class, 'salesForecast']);

Route::middleware(['auth:sanctum'])
    ->get('/ai/forecast/inventory', [PredictiveController::class, 'inventoryForecast']);

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
