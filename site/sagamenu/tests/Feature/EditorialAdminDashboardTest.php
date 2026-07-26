<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\Offering;
use App\Models\Organization;
use App\Models\User;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EditorialAdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_owner_dashboard_uses_editorial_preview_first_workspace(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();

        $this->actingAs($owner)
            ->get('/admin')
            ->assertOk()
            ->assertSee('Menu siap ditinjau dalam satu kanvas.')
            ->assertSee('Store Display')
            ->assertSee('Bio Menu')
            ->assertSee('Draft preview tidak mengubah versi live.');
    }

    public function test_owner_preview_renders_current_draft_with_same_public_view(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        Offering::query()->where('slug', 'iced-aren-latte')->update(['name' => 'Editorial Draft Latte']);

        $this->actingAs($owner)
            ->get(route('admin.catalog-preview', [$catalog, 'mobile']))
            ->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertSee('Draft preview')
            ->assertSee('Editorial Draft Latte')
            ->assertDontSee('WhatsApp Order')
            ->assertDontSee('Checkout');
    }

    public function test_owner_cannot_preview_catalog_from_another_organization(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $organization = Organization::query()->create([
            'name' => 'Other Tenant',
            'slug' => 'other-tenant',
            'business_type' => 'fnb',
            'status' => 'active',
            'plan_key' => 'starter',
            'locale' => 'id',
            'currency' => 'IDR',
            'default_timezone' => 'Asia/Jakarta',
        ]);
        $catalog = Catalog::query()->create([
            'organization_id' => $organization->id,
            'name' => 'Private Menu',
            'slug' => 'private-menu',
            'vertical' => 'fnb',
            'status' => 'draft',
        ]);

        $this->actingAs($owner)
            ->get(route('admin.catalog-preview', [$catalog, 'store']))
            ->assertForbidden();
    }

    public function test_owner_preview_requires_authentication_and_valid_surface(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();

        $this->get(route('admin.catalog-preview', [$catalog, 'store']))
            ->assertRedirect(route('filament.admin.auth.login'));

        $this->actingAs($owner)
            ->get("/owner-preview/catalogs/{$catalog->id}/invalid")
            ->assertNotFound();
    }
}
