<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\MediaAsset;
use App\Models\Offering;
use App\Models\OfferingMedia;
use App\Models\User;
use App\Services\Publishing\CatalogPublisher;
use Database\Seeders\DemoCoffeeMenuSeeder;
use DOMDocument;
use DOMXPath;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCatalogMediaPerformanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_snapshot_preserves_image_dimensions_for_public_layout_stability(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->with('activeSnapshot')->firstOrFail();
        $media = collect(data_get($catalog->activeSnapshot->payload, 'collections'))
            ->flatMap(fn (array $collection) => $collection['offerings'])
            ->flatMap(fn (array $offering) => $offering['media'])
            ->firstWhere('role', 'primary_image');

        $this->assertSame(1200, $media['width']);
        $this->assertSame(900, $media['height']);
    }

    public function test_each_public_surface_prioritizes_one_card_image_and_defers_dialog_media(): void
    {
        $this->attachReadyVideoAndPublish();

        foreach (['/m/saga-coffee/main-menu', '/s/saga-coffee/main-menu'] as $path) {
            $response = $this->get($path)->assertOk();
            $xpath = $this->xpath($response->getContent());

            $this->assertSame(1, $xpath->query("//article//img[@loading='eager' and @fetchpriority='high']")->length);
            $this->assertGreaterThan(0, $xpath->query("//article//img[@loading='lazy']")->length);
            $this->assertSame(0, $xpath->query('//dialog//img[not(@loading="lazy")]')->length);
            $this->assertSame(0, $xpath->query('//img[not(@width) or not(@height)]')->length);
            $this->assertGreaterThan(0, $xpath->query('//dialog//video[@preload="none" and not(@autoplay)]')->length);
            $this->assertSame(0, $xpath->query('//dialog//video[@preload="metadata"]')->length);
            $this->assertGreaterThan(0, $xpath->query("//*[@data-image-fallback and @data-fallback-label and @aria-hidden='true']")->length);

            $videos = $xpath->query('//dialog//*[@data-menu-video]');
            $statuses = $xpath->query("//dialog//*[@data-video-status and @role='status' and @aria-live='polite' and @hidden]");
            $retries = $xpath->query("//dialog//button[@data-video-retry and normalize-space()='Coba lagi']");

            $this->assertGreaterThan(0, $videos->length);
            $this->assertSame($videos->length, $statuses->length);
            $this->assertSame($videos->length, $retries->length);
        }
    }

    public function test_public_media_recovery_client_contract_covers_failure_retry_and_recovery(): void
    {
        $javascript = file_get_contents(resource_path('js/app.js'));
        $stylesheet = file_get_contents(resource_path('css/app.css'));

        $this->assertStringContainsString("video.addEventListener('error'", $javascript);
        $this->assertStringContainsString("source.addEventListener('error'", $javascript);
        $this->assertStringContainsString("retry?.addEventListener('click'", $javascript);
        $this->assertStringContainsString("video.addEventListener('canplay'", $javascript);
        $this->assertStringContainsString("fallback?.setAttribute('role', 'img')", $javascript);
        $this->assertStringContainsString('.offering-dialog__video.has-error video', $stylesheet);
        $this->assertStringContainsString('.media-recovery[hidden]', $stylesheet);
    }

    public function test_public_views_remain_compatible_with_snapshot_media_without_dimensions(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->with('activeSnapshot')->firstOrFail();
        $payload = $catalog->activeSnapshot->payload;

        foreach ($payload['collections'] as &$collection) {
            foreach ($collection['offerings'] as &$offering) {
                foreach ($offering['media'] as &$media) {
                    unset($media['width'], $media['height']);
                }
            }
        }
        unset($collection, $offering, $media);

        $catalog->activeSnapshot->update(['payload' => $payload]);

        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Iced Aren Latte')
            ->assertSee('fetchpriority="high"', false);
    }

    private function attachReadyVideoAndPublish(): void
    {
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $video = MediaAsset::query()->create([
            'organization_id' => $offering->organization_id,
            'type' => 'video',
            'disk' => 'public',
            'path' => 'https://cdn.example.test/iced-aren-latte.webm',
            'original_name' => 'iced-aren-latte.webm',
            'mime_type' => 'video/webm',
            'extension' => 'webm',
            'file_size' => 1024,
            'duration_seconds' => 20,
            'alt_text' => 'Video Iced Aren Latte',
            'metadata' => ['processing_status' => 'ready'],
        ]);

        OfferingMedia::query()->create([
            'organization_id' => $offering->organization_id,
            'offering_id' => $offering->id,
            'media_asset_id' => $video->id,
            'role' => 'menu_video',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        app(CatalogPublisher::class)->publish(
            $offering->catalog,
            User::query()->firstOrFail(),
            'Public media performance test',
        );
    }

    private function xpath(string $html): DOMXPath
    {
        $document = new DOMDocument;
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML($html);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return new DOMXPath($document);
    }
}
