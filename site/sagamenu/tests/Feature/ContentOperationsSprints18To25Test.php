<?php

namespace Tests\Feature;

use App\Models\AnalyticsDailyRollup;
use App\Models\Catalog;
use App\Models\CatalogOperationBatch;
use App\Models\Offering;
use App\Models\OfferingTranslation;
use App\Models\Organization;
use App\Models\QrRoute;
use App\Models\User;
use App\Services\Catalog\BulkOfferingUpdater;
use App\Services\Catalog\CatalogDraftDiffer;
use App\Services\Catalog\CatalogHealthValidator;
use App\Services\Publishing\CatalogPublisher;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ContentOperationsSprints18To25Test extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_bulk_update_is_tenant_scoped_idempotent_and_undoable(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $actor = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offerings = $catalog->offerings()->take(2)->get();
        $before = $offerings->pluck('availability', 'id')->all();
        $idempotencyKey = (string) Str::uuid();
        $service = app(BulkOfferingUpdater::class);

        $first = $service->update($catalog, $offerings->modelKeys(), ['availability' => 'sold_out'], $actor, $idempotencyKey);
        $second = $service->update($catalog, $offerings->modelKeys(), ['availability' => 'sold_out'], $actor, $idempotencyKey);

        $this->assertSame($first->id, $second->id);
        $this->assertSame(1, CatalogOperationBatch::query()->count());
        $this->assertSame(2, $catalog->offerings()->where('availability', 'sold_out')->whereKey($offerings->modelKeys())->count());

        $service->undo($first, $actor);
        foreach ($before as $offeringId => $availability) {
            $this->assertSame($availability, Offering::query()->findOrFail($offeringId)->availability);
        }
        $this->assertNotNull($first->fresh()->undone_at);
    }

    public function test_bulk_update_rejects_an_offering_from_another_catalog(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $actor = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $otherOrganization = Organization::query()->create(['name' => 'Other', 'slug' => 'other', 'business_type' => 'fnb']);
        $otherCatalog = Catalog::query()->create([
            'organization_id' => $otherOrganization->id,
            'name' => 'Other Menu',
            'slug' => 'other-menu',
        ]);
        $otherOffering = Offering::query()->create([
            'organization_id' => $otherOrganization->id,
            'catalog_id' => $otherCatalog->id,
            'name' => 'Other Item',
            'slug' => 'other-item',
            'price_type' => 'fixed',
            'price_min_minor' => 10000,
        ]);

        $this->expectException(ValidationException::class);
        app(BulkOfferingUpdater::class)->update(
            $catalog,
            [$otherOffering->id],
            ['availability' => 'sold_out'],
            $actor,
            (string) Str::uuid(),
        );
    }

    public function test_catalog_health_returns_stable_blocking_and_warning_codes(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $offering = $catalog->offerings()->firstOrFail();
        $offering->media()->delete();
        $offering->update([
            'short_description' => null,
            'available_from' => now()->addDay(),
            'available_until' => now(),
        ]);

        $issues = collect(app(CatalogHealthValidator::class)->validate($catalog->fresh()));

        $this->assertTrue($issues->contains('code', 'missing_image'));
        $this->assertTrue($issues->contains('code', 'missing_description'));
        $this->assertTrue($issues->contains('code', 'invalid_schedule'));
        $this->assertTrue($issues->contains(fn (array $issue) => $issue['severity'] === 'blocking'));
    }

    public function test_draft_differ_reports_field_level_change_without_generated_timestamp_noise(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $catalog->offerings()->firstOrFail()->update(['name' => 'Draft Operations Name']);

        $changes = collect(app(CatalogDraftDiffer::class)->diff($catalog->fresh()));

        $this->assertTrue($changes->contains(fn (array $change) => str_contains($change['path'], 'name')));
        $this->assertFalse($changes->contains(fn (array $change) => str_contains($change['path'], 'generated_at')));
    }

    public function test_translation_is_published_and_selected_by_query_locale(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        OfferingTranslation::query()->create([
            'offering_id' => $offering->id,
            'locale' => 'en',
            'name' => 'Iced Palm Sugar Latte',
            'short_description' => 'Espresso, milk, and Indonesian palm sugar.',
            'video_transcript' => 'A short look at how this drink is prepared.',
        ]);
        $catalog->update(['settings' => [...($catalog->settings ?? []), 'enabled_locales' => ['id', 'en']]]);
        app(CatalogPublisher::class)->publish($catalog->fresh(), User::query()->firstOrFail());

        $this->get('/m/saga-coffee/main-menu?lang=en')
            ->assertOk()
            ->assertSee('Iced Palm Sugar Latte')
            ->assertSee('Espresso, milk, and Indonesian palm sugar.')
            ->assertSee('EN');
    }

    public function test_future_scheduled_offering_stays_out_of_public_surface(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $offering->update(['available_from' => now()->addDay(), 'available_until' => now()->addDays(2)]);
        app(CatalogPublisher::class)->publish($catalog->fresh(), User::query()->firstOrFail());

        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertDontSee('Iced Aren Latte');
    }

    public function test_qr_schedule_fails_closed_outside_active_window(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        QrRoute::query()->create([
            'organization_id' => $catalog->organization_id,
            'catalog_id' => $catalog->id,
            'code' => 'future-qr',
            'label' => 'Future QR',
            'status' => 'active',
            'destination_surface' => 'mobile',
            'starts_at' => now()->addHour(),
        ]);

        $this->get('/q/future-qr')->assertGone();
    }

    public function test_video_and_sold_out_events_roll_up_as_aggregates(): void
    {
        $base = [
            'brand' => 'saga-coffee',
            'catalog' => 'main-menu',
            'surface' => 'mobile',
            'offering_slug' => 'iced-aren-latte',
        ];
        $this->postJson('/api/events', [...$base, 'event_id' => (string) Str::uuid(), 'event_name' => 'video_played'])->assertAccepted();
        $this->postJson('/api/events', [...$base, 'event_id' => (string) Str::uuid(), 'event_name' => 'sold_out_opened'])->assertAccepted();

        $this->artisan('sagamenu:analytics-rollup', ['date' => today()->toDateString()])->assertSuccessful();
        $rollup = AnalyticsDailyRollup::query()->where('surface', 'mobile')->firstOrFail();

        $this->assertSame(1, $rollup->video_plays);
        $this->assertSame(1, $rollup->sold_out_opens);
    }
}
