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
        Schema::create('uploaded_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('uploaded_by')
                ->constrained('users')
                ->onDelete('cascade');

            $table->string('file_name');
            $table->string('file_path');

            $table->string('report_type');

            $table->integer('total_rows')->default(0);
            $table->integer('processed_rows')->default(0);
            $table->integer('failed_rows')->default(0);

            $table->enum('status', ['processing', 'completed', 'failed'])
                ->default('processing');

            $table->text('remarks')->nullable();

            $table->dateTime('uploaded_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploaded_reports');
    }
};
