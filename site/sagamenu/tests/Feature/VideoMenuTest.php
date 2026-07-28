<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Models\Organization;
use App\Models\User;
use App\Services\MediaUploadValidator;
use App\Services\OfferingMediaManager;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\CatalogSnapshotBuilder;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class VideoMenuTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_video_upload_validator_accepts_mp4_signature_and_rejects_disguised_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('valid.mp4', "\x00\x00\x00\x18ftypisom");
        Storage::disk('public')->put('fake.mp4', 'not-a-video');

        $validated = app(MediaUploadValidator::class)->validateStored('public', 'valid.mp4', 'video');

        $this->assertSame('mp4', $validated['extension']);
        $this->assertSame('video/mp4', $validated['mime_type']);

        $this->expectException(ValidationException::class);
        app(MediaUploadValidator::class)->validateStored('public', 'fake.mp4', 'video');
    }

    public function test_editor_attaches_one_tenant_scoped_menu_video(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $video = $this->videoAsset($offering->organization_id, $owner->id);

        app(OfferingMediaManager::class)->syncFromEditor(
            $offering,
            null,
            null,
            [],
            $owner,
            null,
            $video->id,
        );

        $this->assertDatabaseHas('offering_media', [
            'organization_id' => $offering->organization_id,
            'offering_id' => $offering->id,
            'media_asset_id' => $video->id,
            'role' => 'menu_video',
        ]);

        $other = Organization::query()->create([
            'name' => 'Tenant Video Lain',
            'slug' => 'tenant-video-lain',
            'business_type' => 'fnb',
            'status' => 'active',
            'plan_key' => 'starter',
            'locale' => 'id',
            'currency' => 'IDR',
            'default_timezone' => 'Asia/Jakarta',
        ]);
        $foreignVideo = $this->videoAsset($other->id, $owner->id, 'foreign.webm', 'video/webm');

        $this->expectException(ValidationException::class);
        app(OfferingMediaManager::class)->syncFromEditor(
            $offering,
            null,
            null,
            [],
            $owner,
            null,
            $foreignVideo->id,
        );
    }

    public function test_snapshot_and_public_surfaces_render_controlled_video_without_autoplay(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $video = $this->videoAsset($offering->organization_id, $owner->id);

        app(OfferingMediaManager::class)->syncFromEditor(
            $offering,
            null,
            $offering->media()->where('role', 'primary_image')->value('media_asset_id'),
            $offering->media()->where('role', 'gallery_image')->pluck('media_asset_id')->all(),
            $owner,
            null,
            $video->id,
        );

        $payload = app(CatalogSnapshotBuilder::class)->build($catalog->fresh());
        $item = collect($payload['collections'])
            ->flatMap(fn (array $collection) => $collection['offerings'])
            ->firstWhere('slug', 'iced-aren-latte');
        $publishedVideo = collect($item['media'])->firstWhere('role', 'menu_video');

        $this->assertSame('video', $publishedVideo['type']);
        $this->assertSame('video/webm', $publishedVideo['mime_type']);
        $this->assertSame(12, $publishedVideo['duration_seconds']);
        $this->assertSame('ready', $publishedVideo['metadata']['processing_status']);

        app(CatalogPublisher::class)->publish($catalog->fresh(), $owner);

        foreach (['/m/saga-coffee/main-menu', '/s/saga-coffee/main-menu'] as $url) {
            $this->get($url)
                ->assertOk()
                ->assertSee('<video', false)
                ->assertSee('controls', false)
                ->assertSee('playsinline', false)
                ->assertSee('preload="metadata"', false)
                ->assertSee('Memiliki video menu')
                ->assertDontSee('autoplay', false);
        }
    }

    public function test_snapshot_excludes_video_until_processing_is_ready(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $video = $this->videoAsset($offering->organization_id, $owner->id);
        $video->update(['metadata' => ['processing_status' => 'pending_processing']]);

        app(OfferingMediaManager::class)->syncFromEditor(
            $offering,
            null,
            null,
            [],
            $owner,
            null,
            $video->id,
        );

        $payload = app(CatalogSnapshotBuilder::class)->build($catalog->fresh());
        $item = collect($payload['collections'])
            ->flatMap(fn (array $collection) => $collection['offerings'])
            ->firstWhere('slug', 'iced-aren-latte');

        $this->assertFalse(collect($item['media'])->contains('role', 'menu_video'));
    }

    private function videoAsset(
        int $organizationId,
        int $userId,
        string $name = 'aren-story.webm',
        string $mime = 'video/webm',
    ): MediaAsset {
        return MediaAsset::query()->create([
            'organization_id' => $organizationId,
            'uploaded_by_user_id' => $userId,
            'type' => 'video',
            'disk' => 'public',
            'path' => 'organizations/'.$organizationId.'/media/'.$name,
            'thumbnail_path' => null,
            'original_name' => $name,
            'extension' => pathinfo($name, PATHINFO_EXTENSION),
            'mime_type' => $mime,
            'file_size' => 125959,
            'duration_seconds' => 12,
            'alt_text' => 'Cerita menu aren',
            'metadata' => [
                'source' => 'test',
                'processing_status' => 'ready',
            ],
        ]);
    }
}
