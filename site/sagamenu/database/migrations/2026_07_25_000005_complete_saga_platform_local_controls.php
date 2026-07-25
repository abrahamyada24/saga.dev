<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('saga_platform_accounts', function (Blueprint $table): void {
            $table->string('plan_code', 96)->nullable()->after('status');
            $table->unsignedBigInteger('entitlement_version')->default(0)->after('lifecycle_version');
            $table->json('entitlements')->nullable()->after('entitlement_version');
            $table->json('quota_policy')->nullable()->after('entitlements');
            $table->string('license_status', 48)->nullable()->after('quota_policy');
            $table->string('lifecycle_reason', 96)->nullable()->after('license_status');
            $table->timestamp('access_synced_at')->nullable()->after('last_synced_at');
        });

        Schema::table('subscriptions', function (Blueprint $table): void {
            $table->json('quota_policy')->nullable()->after('entitlements');
            $table->string('license_status', 48)->nullable()->after('quota_policy');
        });

        Schema::create('saga_platform_sync_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('saga_platform_account_id')->constrained()->cascadeOnDelete();
            $table->string('central_event_id', 128)->nullable()->unique();
            $table->string('event_type', 96);
            $table->unsignedBigInteger('central_version');
            $table->string('payload_digest', 64);
            $table->string('status', 32);
            $table->string('safe_error_code', 96)->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();
            $table->index(['saga_platform_account_id', 'central_version']);
        });

        Schema::create('saga_platform_checkout_attempts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('saga_platform_account_id')->constrained()->cascadeOnDelete();
            $table->string('idempotency_key', 128)->unique();
            $table->string('request_hash', 64);
            $table->string('plan_code', 96);
            $table->string('billing_cycle', 16);
            $table->unsignedBigInteger('amount');
            $table->string('status', 32)->default('pending');
            $table->string('central_reference', 128)->nullable();
            $table->text('checkout_url')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('gateway_mode', 48)->nullable();
            $table->string('safe_error_code', 96)->nullable();
            $table->timestamp('attempted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['saga_platform_account_id', 'status']);
        });

        Schema::create('saga_platform_migration_candidates', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('email_fingerprint', 64);
            $table->string('state', 32)->default('unlinked');
            $table->string('reason_code', 96);
            $table->string('central_user_id', 128)->nullable();
            $table->timestamp('compatibility_until')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->index(['state', 'reason_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saga_platform_migration_candidates');
        Schema::dropIfExists('saga_platform_checkout_attempts');
        Schema::dropIfExists('saga_platform_sync_events');

        Schema::table('subscriptions', function (Blueprint $table): void {
            $table->dropColumn(['quota_policy', 'license_status']);
        });

        Schema::table('saga_platform_accounts', function (Blueprint $table): void {
            $table->dropColumn([
                'plan_code',
                'entitlement_version',
                'entitlements',
                'quota_policy',
                'license_status',
                'lifecycle_reason',
                'access_synced_at',
            ]);
        });
    }
};
