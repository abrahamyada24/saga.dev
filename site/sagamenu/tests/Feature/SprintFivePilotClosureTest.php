<?php

namespace Tests\Feature;

use App\Models\AnalyticsDailyRollup;
use App\Models\AnalyticsEvent;
use App\Models\Catalog;
use App\Models\Collection;
use App\Models\Offering;
use App\Models\Organization;
use App\Models\OrganizationMembership;
use App\Models\User;
use App\Services\AppearancePreset;
use App\Services\CatalogDuplicator;
use App\Services\OrganizationMembershipService;
use App\Services\Publishing\CatalogAvailabilityPublisher;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class SprintFivePilotClosureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_last_active_owner_cannot_be_demoted_deactivated_or_removed(): void
    {
        $organization = Organization::query()->where('slug', 'saga-coffee')->firstOrFail();
        $admin = User::query()->where('email', 'admin@sagamenu.local')->firstOrFail();
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $adminMembership = OrganizationMembership::query()->where('organization_id', $organization->id)->where('user_id', $admin->id)->firstOrFail();
        $ownerMembership = OrganizationMembership::query()->where('organization_id', $organization->id)->where('user_id', $owner->id)->firstOrFail();

        app(OrganizationMembershipService::class)->changeStatus($adminMembership, 'inactive', $admin);

        foreach (['role', 'status', 'remove'] as $operation) {
            try {
                match ($operation) {
                    'role' => app(OrganizationMembershipService::class)->changeRole($ownerMembership->fresh(), 'editor', $admin),
                    'status' => app(OrganizationMembershipService::class)->changeStatus($ownerMembership->fresh(), 'inactive', $admin),
                    'remove' => app(OrganizationMembershipService::class)->remove($ownerMembership->fresh(), $admin),
                };
                $this->fail("Last owner {$operation} should be rejected.");
            } catch (ValidationException $exception) {
                $this->assertStringContainsString('at least one active Owner', $exception->getMessage());
            }
        }

        $this->assertSame('owner', $owner->fresh()->roleFor($organization));
    }

    public function test_catalog_duplicate_copies_nested_content_as_a_new_draft(): void
    {
        $source = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $actor = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $copy = app(CatalogDuplicator::class)->duplicate($source, $actor);

        $this->assertSame('draft', $copy->status);
        $this->assertNull($copy->active_snapshot_id);
        $this->assertSame($source->collections()->count(), $copy->collections()->count());
        $this->assertSame($source->offerings()->count(), $copy->offerings()->count());
        $this->assertNotSame($source->collections()->first()->id, $copy->collections()->first()->id);
        $this->assertSame(
            $source->offerings()->withCount(['media', 'variantGroups', 'inclusions'])->first()->only(['media_count', 'variant_groups_count', 'inclusions_count']),
            $copy->offerings()->withCount(['media', 'variantGroups', 'inclusions'])->first()->only(['media_count', 'variant_groups_count', 'inclusions_count']),
        );
    }

    public function test_quick_availability_publish_creates_a_new_live_snapshot(): void
    {
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $oldSnapshot = $offering->catalog->active_snapshot_id;

        app(CatalogAvailabilityPublisher::class)->updateAndPublish($offering, 'sold_out', $owner);

        $this->assertSame('sold_out', $offering->fresh()->availability);
        $this->assertNotSame($oldSnapshot, $offering->catalog->fresh()->active_snapshot_id);
        $this->get('/m/saga-coffee/main-menu')->assertOk()->assertSee('Sold out');
    }

    public function test_qr_download_is_png_and_redirect_follows_slug_changes(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $response = $this->actingAs($owner)->get('/q/saga-coffee-main/download');
        $response->assertOk()->assertHeader('Content-Type', 'image/png');
        $this->assertStringStartsWith("\x89PNG\r\n\x1a\n", $response->getContent());

        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $catalog->organization->update(['slug' => 'saga-coffee-new']);
        $catalog->update(['slug' => 'all-day-menu']);

        $this->get('/q/saga-coffee-main')->assertRedirect('/m/saga-coffee-new/all-day-menu');
    }

    public function test_appearance_preset_applies_controlled_editable_values(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();

        app(AppearancePreset::class)->apply($catalog, 'bold_street', $owner);

        $this->assertSame('bold_street', $catalog->fresh()->appearance['preset']);
        $this->assertSame('#d5432f', $catalog->fresh()->appearance['primary_color']);
        $catalog->update(['appearance' => [...$catalog->appearance, 'primary_color' => '#112233']]);
        $this->assertSame('#112233', $catalog->fresh()->appearance['primary_color']);
    }

    public function test_rollup_records_search_and_qr_rankings(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        foreach ([['search_performed', 'latte', null], ['search_performed', 'latte', null], ['qr_scanned', null, 'counter-main']] as [$event, $search, $source]) {
            AnalyticsEvent::query()->create([
                'event_id' => (string) Str::uuid(),
                'organization_id' => $catalog->organization_id,
                'catalog_id' => $catalog->id,
                'event_name' => $event,
                'surface' => 'mobile',
                'search_term' => $search,
                'metadata' => $source ? ['source_key' => $source] : null,
                'occurred_at' => now(),
            ]);
        }

        $this->artisan('sagamenu:analytics-rollup', ['date' => today()->toDateString()])->assertSuccessful();
        $rollup = AnalyticsDailyRollup::query()->where('catalog_id', $catalog->id)->where('surface', 'mobile')->firstOrFail();
        $this->assertSame(2, $rollup->top_searches['latte']);
        $this->assertSame(1, $rollup->qr_sources['counter-main']);
    }

    public function test_owner_lifecycle_and_long_missing_media_fixture(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $organization = $owner->currentOrganization();
        $catalog = Catalog::query()->create([
            'organization_id' => $organization->id,
            'name' => 'Pilot Services Catalog',
            'slug' => 'pilot-services',
            'vertical' => 'service',
            'hero_title' => 'Layanan Konsultasi dan Produksi Kreatif untuk Bisnis yang Membutuhkan Deskripsi Sangat Panjang',
        ]);
        $collection = Collection::query()->create([
            'organization_id' => $organization->id,
            'catalog_id' => $catalog->id,
            'name' => 'Layanan Utama',
            'slug' => 'layanan-utama',
        ]);
        $offering = Offering::query()->create([
            'organization_id' => $organization->id,
            'catalog_id' => $catalog->id,
            'primary_collection_id' => $collection->id,
            'name' => str_repeat('Paket Konsultasi Premium ', 5),
            'slug' => 'paket-konsultasi-premium',
            'price_type' => 'starting_from',
            'price_min_minor' => 150000,
            'currency' => 'IDR',
            'availability' => 'available',
            'visibility' => 'both',
        ]);
        $collection->offerings()->attach($offering->id, ['sort_order' => 1]);

        $preview = app(PreviewTokenService::class)->create($catalog, 'mobile', $owner);
        $this->get('/preview/'.$preview)->assertOk()->assertSee('Paket Konsultasi Premium');
        $snapshot = app(CatalogPublisher::class)->publish($catalog, $owner);
        $this->get('/m/saga-coffee/pilot-services')->assertOk()->assertSee('media-fallback', false);
        app(CatalogPublisher::class)->restore($catalog->fresh(), $snapshot, $owner);
        app(CatalogPublisher::class)->unpublish($catalog->fresh(), $owner);
        $this->get('/m/saga-coffee/pilot-services')->assertNotFound();
    }
}
