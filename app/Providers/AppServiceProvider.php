<?php

namespace App\Providers;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\UploadedReport;
use App\Models\User;
use App\Observers\AuditObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // User::observe(AuditObserver::class);
        // Product::observe(AuditObserver::class);
        // UploadedReport::observe(AuditObserver::class);
        // Branch::observe(AuditObserver::class);
        // Category::observe(AuditObserver::class);
        // Sale::observe(AuditObserver::class);
        // SaleItem::observe(AuditObserver::class);
    }
}
