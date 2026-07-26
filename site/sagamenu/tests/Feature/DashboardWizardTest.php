<?php

namespace Tests\Feature;

use App\Filament\Resources\Offerings\Pages\CreateOffering;
use App\Filament\Resources\Offerings\Pages\EditOffering;
use App\Models\Catalog;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Models\OptionGroup;
use App\Models\Organization;
use App\Models\User;
use App\Services\AppearancePreset;
use App\Services\OfferingMediaManager;
use App\Services\Publishing\CatalogSnapshotBuilder;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Livewire\Livewire;
use Tests\TestCase;

class DashboardWizardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_owner_can_open_full_page_create_and_edit_wizards(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();

        $this->actingAs($owner)
            ->get('/admin/offerings/create')
            ->assertOk()
            ->assertSee('Tambah menu')
            ->assertSee('Informasi dasar')
            ->assertSee('Foto &amp; media', false)
            ->assertSee('Pilihan &amp; detail', false)
            ->assertSee('Review')
            ->assertDontSee('Photo URL');

        $this->actingAs($owner)
            ->get("/admin/offerings/{$offering->id}/edit")
            ->assertOk()
            ->assertSee('Edit menu')
            ->assertSee($offering->name);
    }

    public function test_owner_can_create_and_edit_a_menu_through_the_wizard_component(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $collection = $catalog->collections()->where('slug', 'coffee')->firstOrFail();

        Livewire::actingAs($owner)
            ->test(CreateOffering::class)
            ->fillForm([
                'catalog_id' => $catalog->id,
                'primary_collection_id' => $collection->id,
                'name' => 'Wizard Test Latte',
                'price_type' => 'fixed',
                'price_min_minor' => 32000,
                'short_description' => 'Menu yang dibuat melalui wizard.',
                'availability' => 'available',
                'visibility' => 'both',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $offering = Offering::query()->where('slug', 'wizard-test-latte')->firstOrFail();
        $this->assertSame($catalog->organization_id, $offering->organization_id);
        $this->assertTrue($offering->collections()->whereKey($collection->id)->exists());
        $draftPayload = app(CatalogSnapshotBuilder::class)->build($catalog->fresh());
        $this->assertTrue(
            collect($draftPayload['collections'])
                ->flatMap(fn (array $item) => $item['offerings'])
                ->contains('slug', 'wizard-test-latte')
        );

        Livewire::actingAs($owner)
            ->test(EditOffering::class, ['record' => $offering->id])
            ->fillForm(['name' => 'Wizard Test Latte Revised'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('Wizard Test Latte Revised', $offering->fresh()->name);
        $this->assertSame('wizard-test-latte', $offering->fresh()->slug);
    }

    public function test_offering_editor_upload_creates_tenant_media_and_replaces_primary_image(): void
    {
        Storage::fake('public');
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $path = "organizations/{$offering->organization_id}/media/editor-test.png";
        Storage::disk('public')->put($path, base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
        ));

        app(OfferingMediaManager::class)->syncFromEditor($offering, $path, null, [], $owner);

        $asset = MediaAsset::query()->where('path', $path)->firstOrFail();
        $this->assertSame($offering->organization_id, $asset->organization_id);
        $this->assertSame('image/png', $asset->mime_type);
        $this->assertDatabaseHas('offering_media', [
            'offering_id' => $offering->id,
            'media_asset_id' => $asset->id,
            'role' => 'primary_image',
        ]);
    }

    public function test_offering_editor_rejects_media_from_another_tenant(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $other = Organization::query()->create([
            'name' => 'Tenant Lain',
            'slug' => 'tenant-lain',
            'business_type' => 'fnb',
            'status' => 'active',
            'plan_key' => 'starter',
            'locale' => 'id',
            'currency' => 'IDR',
            'default_timezone' => 'Asia/Jakarta',
        ]);
        $asset = MediaAsset::query()->create([
            'organization_id' => $other->id,
            'uploaded_by_user_id' => $owner->id,
            'type' => 'image',
            'disk' => 'public',
            'path' => 'other/image.png',
            'original_name' => 'image.png',
            'extension' => 'png',
            'mime_type' => 'image/png',
            'file_size' => 100,
        ]);

        $this->expectException(ValidationException::class);
        app(OfferingMediaManager::class)->syncFromEditor($offering, null, $asset->id, [], $owner);
    }

    public function test_snapshot_contains_active_add_on_rules_and_surface_layouts(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $group = OptionGroup::query()->where('name', 'Pilihan Susu')->firstOrFail();
        $group->update([
            'selection_type' => 'single',
            'min_selections' => 1,
            'max_selections' => 1,
            'is_active' => true,
        ]);
        $catalog->update([
            'appearance' => [
                ...$catalog->appearance,
                'mobile_layout' => 'photo_grid',
                'store_layout' => 'editorial_grid',
            ],
        ]);

        $payload = app(CatalogSnapshotBuilder::class)->build($catalog->fresh());
        $offering = collect($payload['collections'])->flatMap(fn (array $collection) => $collection['offerings'])->first(
            fn (array $item) => count($item['option_groups']) > 0
        );
        $publishedGroup = collect($offering['option_groups'])->firstWhere('name', 'Pilihan Susu');

        $this->assertSame('photo_grid', $payload['catalog']['appearance']['mobile_layout']);
        $this->assertSame('editorial_grid', $payload['catalog']['appearance']['store_layout']);
        $this->assertSame('single', $publishedGroup['selection_type']);
        $this->assertSame(1, $publishedGroup['min_selections']);
        $this->assertSame(1, $publishedGroup['max_selections']);
    }

    public function test_editorial_preset_uses_plus_jakarta_sans_but_remains_editable(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();

        app(AppearancePreset::class)->apply($catalog, 'editorial_kv', $owner);

        $this->assertSame('Plus Jakarta Sans', $catalog->fresh()->appearance['heading_font']);
        $this->assertSame('Plus Jakarta Sans', $catalog->fresh()->appearance['body_font']);
        $this->assertSame('editorial_list', $catalog->fresh()->appearance['mobile_layout']);
        $this->assertSame('editorial_grid', $catalog->fresh()->appearance['store_layout']);
    }
}
