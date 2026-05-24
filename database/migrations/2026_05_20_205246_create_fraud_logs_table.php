<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fraud_logs', function (Blueprint $table) {
            $table->id();

            $table->integer('risk_score')->default(0);
            $table->string('risk_level')->default('LOW');

            $table->integer('high_discount_alerts')->default(0);
            $table->integer('sales_spikes_count')->default(0);
            $table->integer('suspicious_cashiers_count')->default(0);

            $table->json('meta')->nullable();

            $table->timestamps();

            $table->index('created_at');
            $table->index('risk_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fraud_logs');
    }
};
