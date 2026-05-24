<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\{
    AuthController,
    BranchController,
    CategoryController,
    ProductController,
    SaleController,
    SaleItemController,
    UploadedReportController,
    AiLogController,
    NotificationController,
    DashboardController,
    DashboardV2Controller,
    FraudLogController
};

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);

    Route::middleware('role:Admin')->group(function () {
        Route::get('branches', function () {
            return Inertia::render('Branches/index');
        })->name('branches');

        Route::get('categories', function () {
            return Inertia::render('Categories/index');
        })->name('categories');

        Route::get('products', function () {
            return Inertia::render('Products/index');
        })->name('products');

        Route::get('sales', function () {
            return Inertia::render('Sales/index');
        })->name('sales');

        Route::get('sale-items', function () {
            return Inertia::render('SaleItems/index');
        })->name('sale-items');

        Route::get('roles', function () {
            return Inertia::render('Roles/index');
        })->name('roles');

        Route::get('uploaded-reports', function () {
            return Inertia::render('UploadedReports/index');
        })->name('uploaded-reports');

        Route::get('fraud-logs', function () {
            return Inertia::render('FraudLogs/index');
        })->name('fraud-logs');

    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
