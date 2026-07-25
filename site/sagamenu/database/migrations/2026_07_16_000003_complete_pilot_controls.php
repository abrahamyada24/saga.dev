<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table): void {
            $table->string('onboarding_status')->default('setup')->after('status');
            $table->string('pilot_status')->default('not_ready')->after('onboarding_status');
            $table->string('attention_status')->default('clear')->after('pilot_status');
            $table->text('attention_reason')->nullable()->after('attention_status');
            $table->timestamp('pilot_started_at')->nullable()->after('attention_reason');
            $table->timestamp('pilot_approved_at')->nullable()->after('pilot_started_at');
            $table->index(['pilot_status', 'attention_status']);
        });

        Schema::table('organization_user', function (Blueprint $table): void {
            $table->string('status')->default('active')->after('role');
            $table->timestamp('deactivated_at')->nullable()->after('accepted_at');
            $table->index(['organization_id', 'role', 'status'], 'organization_owner_status_index');
        });

        Schema::table('analytics_daily_rollups', function (Blueprint $table): void {
            $table->json('top_searches')->nullable()->after('top_offerings');
            $table->json('qr_sources')->nullable()->after('top_searches');
        });

        Schema::create('backup_runs', function (Blueprint $table): void {
            $table->id();
            $table->string('status')->default('running');
            $table->string('connection');
            $table->string('storage_disk')->default('local');
            $table->text('database_path')->nullable();
            $table->text('media_path')->nullable();
            $table->text('manifest_path')->nullable();
            $table->text('checksum_path')->nullable();
            $table->text('error')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'completed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backup_runs');

        Schema::table('analytics_daily_rollups', function (Blueprint $table): void {
            $table->dropColumn(['top_searches', 'qr_sources']);
        });

        Schema::table('organization_user', function (Blueprint $table): void {
            $table->dropIndex('organization_owner_status_index');
            $table->dropColumn(['status', 'deactivated_at']);
        });

        Schema::table('organizations', function (Blueprint $table): void {
            $table->dropIndex(['pilot_status', 'attention_status']);
            $table->dropColumn([
                'onboarding_status',
                'pilot_status',
                'attention_status',
                'attention_reason',
                'pilot_started_at',
                'pilot_approved_at',
            ]);
        });
    }
};
