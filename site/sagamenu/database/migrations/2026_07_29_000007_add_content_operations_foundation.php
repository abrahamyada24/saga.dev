<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offering_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('offering_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 12);
            $table->string('name');
            $table->text('short_description')->nullable();
            $table->text('full_description')->nullable();
            $table->text('video_transcript')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->unique(['offering_id', 'locale']);
        });

        Schema::create('catalog_operation_batches', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->uuid('idempotency_key');
            $table->string('operation');
            $table->json('payload');
            $table->json('before');
            $table->string('status')->default('completed');
            $table->timestamp('undone_at')->nullable();
            $table->timestamps();
            $table->unique(['organization_id', 'idempotency_key']);
            $table->index(['catalog_id', 'created_at']);
        });

        Schema::table('qr_routes', function (Blueprint $table): void {
            $table->timestamp('starts_at')->nullable()->after('status');
            $table->timestamp('ends_at')->nullable()->after('starts_at');
            $table->json('design')->nullable()->after('ends_at');
            $table->json('metadata')->nullable()->after('design');
        });

        Schema::table('analytics_daily_rollups', function (Blueprint $table): void {
            $table->unsignedBigInteger('video_plays')->default(0)->after('offering_opens');
            $table->unsignedBigInteger('sold_out_opens')->default(0)->after('video_plays');
        });
    }

    public function down(): void
    {
        Schema::table('analytics_daily_rollups', function (Blueprint $table): void {
            $table->dropColumn(['video_plays', 'sold_out_opens']);
        });

        Schema::table('qr_routes', function (Blueprint $table): void {
            $table->dropColumn(['starts_at', 'ends_at', 'design', 'metadata']);
        });

        Schema::dropIfExists('catalog_operation_batches');
        Schema::dropIfExists('offering_translations');
    }
};
