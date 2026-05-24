<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('branch_id')
                ->constrained('branches')
                ->onDelete('cascade');

            $table->foreignId('category_id')
                ->constrained('categories')
                ->onDelete('cascade');

            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();

            $table->string('name');
            $table->text('description')->nullable();

            $table->decimal('price', 12, 2);
            $table->decimal('cost', 12, 2);

            $table->integer('stock_quantity')->default(0);
            $table->integer('reorder_level')->default(0);

            $table->string('image')->nullable();

            $table->boolean('status')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
