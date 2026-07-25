<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('password')->nullable()->change();
            $table->string('central_user_id', 26)->nullable()->unique()->after('id');
        });

        Schema::table('organizations', function (Blueprint $table): void {
            $table->string('central_organization_id', 26)->nullable()->unique()->after('id');
        });

        Schema::table('locations', function (Blueprint $table): void {
            $table->string('central_workspace_id', 26)->nullable()->unique()->after('id');
        });

        Schema::table('subscriptions', function (Blueprint $table): void {
            $table->string('central_subscription_id', 26)->nullable()->unique()->after('id');
            $table->unsignedBigInteger('central_version')->nullable()->after('status');
        });

        Schema::create('saga_platform_accounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('organization_id')->constrained()->restrictOnDelete();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->string('central_user_id', 26);
            $table->string('central_organization_id', 26);
            $table->string('central_workspace_id', 26)->nullable();
            $table->string('central_product_account_id', 26)->unique();
            $table->string('central_subscription_id', 26)->nullable()->index();
            $table->string('status')->default('provisioning');
            $table->unsignedBigInteger('lifecycle_version')->default(1);
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            $table->unique(['central_organization_id', 'organization_id']);
            $table->index(['central_user_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saga_platform_accounts');

        Schema::table('subscriptions', function (Blueprint $table): void {
            $table->dropUnique(['central_subscription_id']);
            $table->dropColumn(['central_subscription_id', 'central_version']);
        });
        Schema::table('locations', function (Blueprint $table): void {
            $table->dropUnique(['central_workspace_id']);
            $table->dropColumn('central_workspace_id');
        });
        Schema::table('organizations', function (Blueprint $table): void {
            $table->dropUnique(['central_organization_id']);
            $table->dropColumn('central_organization_id');
        });
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['central_user_id']);
            $table->dropColumn('central_user_id');
        });
    }
};
