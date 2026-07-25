<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('business_type')->default('fnb');
            $table->string('status')->default('active');
            $table->string('plan_key')->default('starter');
            $table->string('locale')->default('id');
            $table->string('currency', 3)->default('IDR');
            $table->string('default_timezone')->default('Asia/Jakarta');
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('address')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_user', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('owner');
            $table->boolean('is_primary')->default(false);
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();
            $table->unique(['organization_id', 'user_id']);
            $table->index(['organization_id', 'role']);
        });

        Schema::create('locations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('address')->nullable();
            $table->text('maps_url')->nullable();
            $table->string('phone')->nullable();
            $table->string('timezone')->default('Asia/Jakarta');
            $table->json('opening_hours')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['organization_id', 'slug']);
        });

        Schema::create('media_assets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('image');
            $table->string('disk')->default('public');
            $table->text('path')->nullable();
            $table->text('thumbnail_path')->nullable();
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->string('extension', 20)->nullable();
            $table->unsignedBigInteger('file_size')->default(0);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['organization_id', 'type']);
        });

        Schema::create('catalogs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('cover_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('logo_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('seo_image_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedBigInteger('custom_font_id')->nullable();
            $table->string('name');
            $table->string('slug');
            $table->string('vertical')->default('fnb');
            $table->string('status')->default('draft');
            $table->boolean('store_display_enabled')->default(true);
            $table->boolean('mobile_catalog_enabled')->default(true);
            $table->string('default_view_mode')->default('photo');
            $table->string('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->unsignedBigInteger('active_snapshot_id')->nullable();
            $table->timestamp('last_published_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('appearance')->nullable();
            $table->json('business_info')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->unique(['organization_id', 'slug']);
            $table->index(['organization_id', 'status']);
        });

        Schema::create('organization_invitations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invited_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('email');
            $table->string('role')->default('editor');
            $table->string('token_hash', 64)->unique();
            $table->timestamp('expires_at');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();
            $table->index(['organization_id', 'email']);
        });

        Schema::create('admin_assist_sessions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('reason');
            $table->timestamp('started_at');
            $table->timestamp('expires_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'ended_at']);
        });

        Schema::create('collections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();
            $table->unique(['catalog_id', 'slug']);
        });

        Schema::create('offerings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->foreignId('primary_collection_id')->nullable()->constrained('collections')->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('short_description')->nullable();
            $table->text('full_description')->nullable();
            $table->string('price_type')->default('fixed');
            $table->unsignedBigInteger('price_min_minor')->nullable();
            $table->unsignedBigInteger('price_max_minor')->nullable();
            $table->string('price_label')->nullable();
            $table->string('currency', 3)->default('IDR');
            $table->unsignedBigInteger('original_price_minor')->nullable();
            $table->unsignedBigInteger('promo_price_minor')->nullable();
            $table->string('promo_label')->nullable();
            $table->timestamp('promo_starts_at')->nullable();
            $table->timestamp('promo_ends_at')->nullable();
            $table->text('promo_terms')->nullable();
            $table->string('availability')->default('available');
            $table->timestamp('available_from')->nullable();
            $table->timestamp('available_until')->nullable();
            $table->string('visibility')->default('both');
            $table->json('badges')->nullable();
            $table->json('tags')->nullable();
            $table->text('ingredients')->nullable();
            $table->json('dietary')->nullable();
            $table->json('allergens')->nullable();
            $table->string('spice_level')->nullable();
            $table->string('caffeine_level')->nullable();
            $table->text('serving_note')->nullable();
            $table->string('external_action_label')->nullable();
            $table->text('external_action_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('archived_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->unique(['catalog_id', 'slug']);
            $table->index(['catalog_id', 'availability', 'visibility']);
        });

        Schema::create('collection_offering', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('collection_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offering_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['collection_id', 'offering_id']);
        });

        Schema::create('offering_media', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offering_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_asset_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('primary_image');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['offering_id', 'media_asset_id', 'role']);
        });

        Schema::create('variant_groups', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('offering_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('variant_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('variant_group_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedBigInteger('price_minor')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('option_groups', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('option_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('option_group_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedBigInteger('price_delta_minor')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('offering_option_group', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('offering_id')->constrained()->cascadeOnDelete();
            $table->foreignId('option_group_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['offering_id', 'option_group_id']);
        });

        Schema::create('inclusions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('offering_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('custom_fonts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_asset_id')->constrained()->cascadeOnDelete();
            $table->string('family_name');
            $table->unsignedSmallInteger('weight')->default(400);
            $table->string('style')->default('normal');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('catalog_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->string('status')->default('published');
            $table->json('payload');
            $table->foreignId('published_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->string('checksum', 64);
            $table->timestamps();
            $table->unique(['catalog_id', 'version']);
        });

        Schema::create('preview_tokens', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->string('token_hash', 64)->unique();
            $table->string('surface')->default('mobile');
            $table->json('payload');
            $table->timestamp('expires_at');
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('qr_routes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('label');
            $table->string('source_key')->nullable();
            $table->string('destination_surface')->default('mobile');
            $table->string('status')->default('active');
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();
        });

        Schema::create('analytics_events', function (Blueprint $table): void {
            $table->id();
            $table->uuid('event_id')->unique();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->foreignId('qr_route_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_name');
            $table->string('surface');
            $table->string('session_key', 64)->nullable();
            $table->string('collection_slug')->nullable();
            $table->string('offering_slug')->nullable();
            $table->string('search_term', 120)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();
            $table->index(['catalog_id', 'event_name', 'occurred_at']);
        });

        Schema::create('analytics_daily_rollups', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('catalog_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('surface');
            $table->unsignedBigInteger('catalog_views')->default(0);
            $table->unsignedBigInteger('engaged_sessions')->default(0);
            $table->unsignedBigInteger('offering_opens')->default(0);
            $table->unsignedBigInteger('qr_scans')->default(0);
            $table->unsignedBigInteger('searches')->default(0);
            $table->unsignedBigInteger('zero_results')->default(0);
            $table->json('top_collections')->nullable();
            $table->json('top_offerings')->nullable();
            $table->timestamps();
            $table->unique(['catalog_id', 'date', 'surface']);
        });

        Schema::create('audit_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->nullableMorphs('auditable');
            $table->text('reason')->nullable();
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            $table->index(['organization_id', 'action', 'created_at']);
        });

        Schema::create('subscriptions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('plan_key')->default('starter');
            $table->string('status')->default('trialing');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('grace_ends_at')->nullable();
            $table->json('entitlements')->nullable();
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('number')->unique();
            $table->unsignedBigInteger('amount_minor');
            $table->string('currency', 3)->default('IDR');
            $table->string('status')->default('draft');
            $table->date('due_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('support_issues', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default('normal');
            $table->string('status')->default('open');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_issues');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('analytics_daily_rollups');
        Schema::dropIfExists('analytics_events');
        Schema::dropIfExists('qr_routes');
        Schema::dropIfExists('preview_tokens');
        Schema::dropIfExists('catalog_snapshots');
        Schema::dropIfExists('custom_fonts');
        Schema::dropIfExists('inclusions');
        Schema::dropIfExists('offering_option_group');
        Schema::dropIfExists('option_values');
        Schema::dropIfExists('option_groups');
        Schema::dropIfExists('variant_values');
        Schema::dropIfExists('variant_groups');
        Schema::dropIfExists('offering_media');
        Schema::dropIfExists('collection_offering');
        Schema::dropIfExists('offerings');
        Schema::dropIfExists('collections');
        Schema::dropIfExists('admin_assist_sessions');
        Schema::dropIfExists('organization_invitations');
        Schema::dropIfExists('catalogs');
        Schema::dropIfExists('media_assets');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('organization_user');
        Schema::dropIfExists('organizations');
    }
};
