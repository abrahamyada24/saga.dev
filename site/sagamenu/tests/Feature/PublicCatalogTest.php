<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\Offering;
use App\Models\PreviewToken;
use App\Models\User;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
