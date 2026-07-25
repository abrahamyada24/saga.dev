<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\Offering;
use App\Models\PreviewToken;
use App\Models\QrRoute;
use App\Models\SagaPlatformAccount;
use App\Models\User;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class PublicCatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_store_display_renders_active_snapshot_with_preview_only_copy(): void
    {
        $this->get('/s/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Store Display')
            ->assertSee('Saga Coffee Demo')
            ->assertSee('Iced Aren Latte')
            ->assertSee('Opsi tambahan')
            ->assertDontSee('WhatsApp Order')
            ->assertDontSee('Checkout')
            ->assertDontSee('Add to Cart');
    }

    public function test_mobile_catalog_renders_same_active_snapshot(): void
    {
        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Mobile Catalog')
            ->assertSee('Iced Aren Latte')
            ->assertDontSee('WhatsApp Order');
    }

    public function test_draft_changes_do_not_leak_to_live_catalog(): void
    {
        Offering::query()->where('slug', 'iced-aren-latte')->update(['name' => 'DRAFT SECRET LATTE']);

        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Iced Aren Latte')
            ->assertDontSee('DRAFT SECRET LATTE');
    }

    public function test_preview_token_renders_draft_and_expires(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        Offering::query()->where('slug', 'iced-aren-latte')->update(['name' => 'Draft Aren Special']);
        $token = app(PreviewTokenService::class)->create($catalog->fresh(), 'mobile', User::query()->first());

        $this->get('/preview/'.$token)
            ->assertOk()
            ->assertSee('Draft preview')
            ->assertSee('Draft Aren Special');

        PreviewToken::query()->update(['expires_at' => now()->subMinute()]);
        $this->get('/preview/'.$token)->assertNotFound();
    }

    public function test_hidden_offering_and_empty_collection_are_not_published(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $offering->update(['visibility' => 'hidden']);
        app(CatalogPublisher::class)->publish($catalog->fresh(), User::query()->first());

        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertDontSee('Iced Aren Latte');
    }

    public function test_failed_publish_keeps_previous_active_snapshot(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $activeSnapshotId = $catalog->active_snapshot_id;
        $catalog->collections()->update(['is_visible' => false]);

        try {
            app(CatalogPublisher::class)->publish($catalog->fresh(), User::query()->first());
            $this->fail('Expected validation exception was not thrown.');
        } catch (ValidationException) {
            $this->assertSame($activeSnapshotId, $catalog->fresh()->active_snapshot_id);
        }
    }

    public function test_disabled_surface_returns_not_found_after_publish(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $catalog->update(['store_display_enabled' => false]);
        app(CatalogPublisher::class)->publish($catalog->fresh(), User::query()->first());

        $this->get('/s/saga-coffee/main-menu')->assertNotFound();
        $this->get('/m/saga-coffee/main-menu')->assertOk();
    }

    public function test_restricted_central_account_hides_every_public_surface_behind_maintenance(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $account = $this->attachCentralAccount($catalog, 'past_due');
        $token = app(PreviewTokenService::class)->create($catalog, 'mobile', User::query()->firstOrFail());

        foreach (['past_due', 'expired', 'suspended', 'cancelled', 'provisioning_failed'] as $status) {
            $account->update(['status' => $status]);
            $catalog->organization->subscription()->update(['status' => $status]);

            foreach (['/s/saga-coffee/main-menu', '/m/saga-coffee/main-menu', '/preview/'.$token] as $path) {
                $this->get($path)
                    ->assertServiceUnavailable()
                    ->assertHeader('Cache-Control', 'no-store, private')
                    ->assertHeader('Retry-After', '3600')
                    ->assertSee('Menu sedang maintenance')
                    ->assertDontSee('Iced Aren Latte')
                    ->assertDontSee($status);
            }
        }
    }

    public function test_reactivation_restores_catalog_and_feature_rollback_does_not_bypass_restriction(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $account = $this->attachCentralAccount($catalog, 'suspended');
        config(['sagamenu.saga_platform.enabled' => false]);

        $this->get('/m/saga-coffee/main-menu')
            ->assertServiceUnavailable()
            ->assertSee('Menu sedang maintenance');

        $account->update(['status' => 'active']);
        $catalog->organization->subscription()->update(['status' => 'active']);
        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Iced Aren Latte');
    }

    public function test_mapped_account_fails_closed_when_subscription_projection_is_missing_or_mismatched(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $this->attachCentralAccount($catalog, 'active');

        $catalog->organization->subscription()->update(['central_subscription_id' => null]);
        $this->get('/m/saga-coffee/main-menu')
            ->assertServiceUnavailable()
            ->assertSee('Menu sedang maintenance');

        $catalog->organization->subscription()->update([
            'central_subscription_id' => (string) Str::ulid(),
            'status' => 'active',
        ]);
        $this->get('/m/saga-coffee/main-menu')
            ->assertServiceUnavailable()
            ->assertSee('Menu sedang maintenance');
    }

    public function test_restricted_account_shows_maintenance_before_publish_snapshot_check(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $this->attachCentralAccount($catalog, 'suspended');
        $catalog->update(['active_snapshot_id' => null]);

        $this->get('/m/saga-coffee/main-menu')
            ->assertServiceUnavailable()
            ->assertSee('Menu sedang maintenance');
    }

    public function test_qr_keeps_its_public_destination_but_catalog_policy_returns_maintenance(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $this->attachCentralAccount($catalog, 'expired');
        $qr = QrRoute::query()->create([
            'organization_id' => $catalog->organization_id,
            'catalog_id' => $catalog->id,
            'code' => 'maintenance-test',
            'label' => 'Maintenance Test',
            'status' => 'active',
            'destination_surface' => 'mobile',
        ]);

        $redirect = $this->get('/q/'.$qr->code)->assertRedirect();
        $this->get($redirect->headers->get('Location'))
            ->assertServiceUnavailable()
            ->assertSee('Menu sedang maintenance');
    }

    private function attachCentralAccount(Catalog $catalog, string $status): SagaPlatformAccount
    {
        $catalog->loadMissing(['organization.subscription', 'organization.users', 'location']);
        $subscriptionId = (string) Str::ulid();
        $catalog->organization->subscription()->update([
            'central_subscription_id' => $subscriptionId,
            'status' => $status,
        ]);

        return SagaPlatformAccount::query()->create([
            'user_id' => $catalog->organization->users->firstOrFail()->id,
            'organization_id' => $catalog->organization_id,
            'location_id' => $catalog->location_id,
            'central_user_id' => (string) Str::ulid(),
            'central_organization_id' => (string) Str::ulid(),
            'central_workspace_id' => (string) Str::ulid(),
            'central_product_account_id' => (string) Str::ulid(),
            'central_subscription_id' => $subscriptionId,
            'status' => $status,
            'plan_code' => 'sagamenu_pro',
            'lifecycle_version' => 3,
            'trial_ends_at' => now()->addDays(14),
        ]);
    }
}
