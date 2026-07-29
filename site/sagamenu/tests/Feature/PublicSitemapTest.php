<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\SagaPlatformAccount;
use Database\Seeders\DemoCoffeeMenuSeeder;
use DOMDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicSitemapTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://menu.example.test']);
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_sitemap_lists_only_the_canonical_live_mobile_surface(): void
    {
        $response = $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertHeader('Vary', 'Accept-Encoding');

        $locations = $this->locations($response->getContent());

        $this->assertSame([
            'https://menu.example.test/m/saga-coffee/main-menu',
        ], $locations);
        $this->assertStringNotContainsString('/s/', $response->getContent());
        $this->assertStringNotContainsString('/preview/', $response->getContent());
        $this->assertFalse($response->headers->has('Set-Cookie'));
    }

    public function test_unpublished_disabled_and_restricted_catalogs_are_excluded(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->firstOrFail();
        $catalog->update(['active_snapshot_id' => null]);

        $this->assertSame([], $this->locations(
            $this->get('/sitemap.xml')->assertOk()->getContent(),
        ));

        $catalog->update(['active_snapshot_id' => $catalog->snapshots()->firstOrFail()->id]);
        $payload = $catalog->activeSnapshot->payload;
        data_set($payload, 'catalog.mobile_catalog_enabled', false);
        $catalog->activeSnapshot->update(['payload' => $payload]);

        $this->assertSame([], $this->locations(
            $this->get('/sitemap.xml')->assertOk()->getContent(),
        ));

        $catalog->update(['archived_at' => now()]);
        $this->assertSame([], $this->locations(
            $this->get('/sitemap.xml')->assertOk()->getContent(),
        ));

        $catalog->update(['archived_at' => null]);
        data_set($payload, 'catalog.mobile_catalog_enabled', true);
        $catalog->activeSnapshot->update(['payload' => $payload]);
        $this->attachCentralAccount($catalog, 'suspended');

        $this->assertSame([], $this->locations(
            $this->get('/sitemap.xml')->assertOk()->getContent(),
        ));
    }

    public function test_sitemap_supports_conditional_get_and_fails_closed_for_invalid_origin(): void
    {
        $first = $this->get('/sitemap.xml')->assertOk();
        $etag = $first->headers->get('ETag');

        $this->assertNotNull($etag);
        $this->assertStringContainsString('s-maxage=60', (string) $first->headers->get('Cache-Control'));

        $this->withHeader('If-None-Match', $etag)
            ->get('/sitemap.xml')
            ->assertStatus(304)
            ->assertContent('');

        config(['app.url' => 'not-a-public-origin']);
        $this->get('/sitemap.xml')->assertServiceUnavailable();
    }

    /**
     * @return array<int, string>
     */
    private function locations(string $xml): array
    {
        $document = new DOMDocument;
        $this->assertTrue($document->loadXML($xml));

        return collect($document->getElementsByTagName('loc'))
            ->map(fn ($node): string => $node->textContent)
            ->all();
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
