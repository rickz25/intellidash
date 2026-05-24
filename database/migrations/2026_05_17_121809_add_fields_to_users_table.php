<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')
                ->nullable()
                ->after('id')
                ->constrained('roles')
                ->onDelete('set null');

            $table->foreignId('branch_id')
                ->nullable()
                ->after('role_id')
                ->constrained('branches')
                ->onDelete('set null');

            $table->string('avatar')->nullable()->after('email');
            $table->string('last_device_name')->nullable()->after('password');
            $table->string('last_ip')->nullable()->after('last_device_name');
            $table->timestamp('last_login_at')->nullable()->after('last_ip');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['branch_id']);

            $table->dropColumn([
                'role_id',
                'branch_id',
                'avatar',
                'last_device_name',
                'last_ip',
                'last_login_at'
            ]);
        });
    }
};
