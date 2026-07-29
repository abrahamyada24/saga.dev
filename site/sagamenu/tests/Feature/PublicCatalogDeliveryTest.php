<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\Offering;
use App\Models\User;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use Database\Seeders\DemoCoffeeMenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCatalogDeliveryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_live_catalog_supports_conditional_get_without_a_response_body(): void
    {
        $first = $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertHeader('Vary', 'Accept-Encoding');

        $etag = $first->headers->get('ETag');
        $cacheControl = (string) $first->headers->get('Cache-Control');

        $this->assertNotNull($etag);
        $this->assertStringContainsString('public', $cacheControl);
        $this->assertStringContainsString('max-age=0', $cacheControl);
        $this->assertStringContainsString('s-maxage=60', $cacheControl);
        $this->assertStringContainsString('stale-while-revalidate=30', $cacheControl);
        $this->assertStringContainsString('stale-if-error=86400', $cacheControl);
        $this->assertGreaterThan(1000, strlen($first->getContent()));
        $this->assertFalse($first->headers->has('Set-Cookie'));

        $second = $this->withHeader('If-None-Match', $etag)
            ->get('/m/saga-coffee/main-menu')
            ->assertStatus(304);

        $this->assertSame('', $second->getContent());
        $this->assertSame($etag, $second->headers->get('ETag'));
    }

    public function test_new_publish_invalidates_the_previous_etag_immediately_at_origin(): void
    {
        $oldEtag = $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->headers->get('ETag');

        Offering::query()
            ->where('slug', 'iced-aren-latte')
            ->update(['availability' => 'sold_out']);

        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        app(CatalogPublisher::class)->publish($catalog->fresh(), User::query()->firstOrFail());

        $updated = $this->withHeader('If-None-Match', (string) $oldEtag)
            ->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Sold out');

        $this->assertNotSame($oldEtag, $updated->headers->get('ETag'));
    }

    public function test_store_and_mobile_surfaces_have_independent_validators(): void
    {
        $storeEtag = $this->get('/s/saga-coffee/main-menu')
            ->assertOk()
            ->headers->get('ETag');
        $mobileEtag = $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->headers->get('ETag');

        $this->assertNotNull($storeEtag);
        $this->assertNotNull($mobileEtag);
        $this->assertNotSame($storeEtag, $mobileEtag);
    }

    public function test_preview_is_excluded_from_shared_public_cache_policy(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $token = app(PreviewTokenService::class)->create(
            $catalog,
            'mobile',
            User::query()->firstOrFail(),
        );

        $response = $this->get('/preview/'.$token)->assertOk();
        $cacheControl = (string) $response->headers->get('Cache-Control');

        $this->assertStringNotContainsString('s-maxage=60', $cacheControl);
        $this->assertNull($response->headers->get('ETag'));
    }
}
