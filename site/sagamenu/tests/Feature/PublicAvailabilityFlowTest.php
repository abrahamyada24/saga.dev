<?php

namespace Tests\Feature;

use App\Filament\Resources\Offerings\Pages\ManageOfferings;
use App\Models\Catalog;
use App\Models\Offering;
use App\Models\User;
use App\Services\Catalog\OfferingAvailability;
use App\Services\Publishing\CatalogAvailabilityPublisher;
use Database\Seeders\DemoCoffeeMenuSeeder;
use DOMDocument;
use DOMXPath;
use Filament\Actions\Testing\TestAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Illuminate\Validation\ValidationException;
use Livewire\Livewire;
use Tests\TestCase;

class PublicAvailabilityFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DemoCoffeeMenuSeeder::class);
    }

    public function test_operator_can_select_and_publish_an_explicit_availability_status(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $catalog = $offering->catalog;
        $previousSnapshotId = $catalog->active_snapshot_id;

        Livewire::actingAs($owner)
            ->test(ManageOfferings::class)
            ->callAction(TestAction::make('availability')->table($offering), [
                'availability' => 'temporary',
            ])
            ->assertNotified('Status berhasil dipublikasikan');

        $offering->refresh();
        $catalog->refresh();

        $this->assertSame('temporary', $offering->availability);
        $this->assertNotSame($previousSnapshotId, $catalog->active_snapshot_id);
        $this->assertSame(
            'temporary',
            $this->snapshotOffering($catalog, $offering->slug)['availability_state']['key'],
        );

        $this->get('/m/saga-coffee/main-menu')
            ->assertOk()
            ->assertSee('Sementara tidak tersedia');
    }

    public function test_all_supported_states_stay_consistent_in_snapshot_mobile_and_store_views(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();

        $expectations = [
            'available' => ['Tersedia', true, false],
            'sold_out' => ['Sold out', false, true],
            'temporary' => ['Sementara tidak tersedia', false, true],
            'coming_soon' => ['Segera hadir', false, true],
            'seasonal' => ['Menu musiman', true, true],
        ];

        foreach ($expectations as $state => [$label, $isAvailable, $hasCardBadge]) {
            app(CatalogAvailabilityPublisher::class)->updateAndPublish($offering, $state, $owner);
            $catalog = $offering->catalog->fresh('activeSnapshot');
            $snapshotOffering = $this->snapshotOffering($catalog, $offering->slug);

            $this->assertSame($state, $snapshotOffering['availability_state']['key']);
            $this->assertSame($label, $snapshotOffering['availability_state']['label']);
            $this->assertSame($isAvailable, $snapshotOffering['availability_state']['is_available']);

            foreach (['/m/saga-coffee/main-menu', '/s/saga-coffee/main-menu'] as $path) {
                $xpath = $this->xpath($this->get($path)->assertOk());
                $unavailable = $isAvailable ? 'false' : 'true';

                $this->assertSame(
                    1,
                    $xpath->query("//article[@data-availability-state='{$state}' and @data-unavailable='{$unavailable}']//h3[normalize-space()='Iced Aren Latte']")->length,
                    "Card state {$state} should be consistent at {$path}.",
                );
                $this->assertSame(
                    1,
                    $xpath->query("//dialog[@data-offering-dialog='iced-aren-latte' and @data-availability-state='{$state}']//span[contains(@class, 'availability-text') and normalize-space()='{$label}']")->length,
                    "Dialog state {$state} should be consistent at {$path}.",
                );
                $this->assertSame(
                    $hasCardBadge ? 1 : 0,
                    $xpath->query("//article[@data-availability-state='{$state}'][.//h3[normalize-space()='Iced Aren Latte']]//span[contains(@class, 'availability-badge')]")->length,
                    "Card badge visibility for {$state} should be deliberate at {$path}.",
                );
            }
        }
    }

    public function test_unknown_snapshot_state_fails_closed_on_both_public_surfaces(): void
    {
        $catalog = Catalog::query()->where('slug', 'main-menu')->with('activeSnapshot')->firstOrFail();
        $payload = $catalog->activeSnapshot->payload;

        foreach ($payload['collections'] as &$collection) {
            foreach ($collection['offerings'] as &$offering) {
                if ($offering['slug'] !== 'iced-aren-latte') {
                    continue;
                }

                $offering['availability'] = 'unexpected_state';
                unset($offering['availability_state']);
            }
        }
        unset($collection, $offering);

        $catalog->activeSnapshot->update([
            'payload' => $payload,
            'checksum' => hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR)),
        ]);

        foreach (['/m/saga-coffee/main-menu', '/s/saga-coffee/main-menu'] as $path) {
            $xpath = $this->xpath($this->get($path)->assertOk());

            $this->assertSame(
                1,
                $xpath->query("//article[@data-availability-state='unknown' and @data-unavailable='true']//span[normalize-space()='Ketersediaan belum dikonfirmasi']")->length,
            );
            $this->assertSame(
                1,
                $xpath->query("//dialog[@data-offering-dialog='iced-aren-latte' and @data-availability-state='unknown']//span[normalize-space()='Ketersediaan belum dikonfirmasi']")->length,
            );
        }
    }

    public function test_failed_quick_publish_rolls_back_status_and_active_snapshot(): void
    {
        $owner = User::query()->where('email', 'owner@sagamenu.local')->firstOrFail();
        $offering = Offering::query()->where('slug', 'iced-aren-latte')->firstOrFail();
        $catalog = $offering->catalog;
        $previousSnapshotId = $catalog->active_snapshot_id;
        $catalog->collections()->update(['is_visible' => false]);

        try {
            app(CatalogAvailabilityPublisher::class)->updateAndPublish($offering, 'sold_out', $owner);
            $this->fail('Expected quick publish validation failure.');
        } catch (ValidationException) {
            $this->assertSame('available', $offering->fresh()->availability);
            $this->assertSame($previousSnapshotId, $catalog->fresh()->active_snapshot_id);
        }
    }

    public function test_availability_contract_and_sold_out_analytics_are_fail_closed(): void
    {
        $availability = app(OfferingAvailability::class);

        $this->assertSame(
            ['available', 'sold_out', 'temporary', 'coming_soon', 'seasonal'],
            OfferingAvailability::allowed(),
        );
        $this->assertFalse($availability->resolve(null)['is_available']);
        $this->assertSame('unknown', $availability->resolve('archived')['key']);
        $this->assertArrayNotHasKey('filament_color', $availability->publicState('available'));

        $script = file_get_contents(resource_path('js/app.js'));
        $this->assertStringContainsString("dataset.availabilityState === 'sold_out'", $script);
        $this->assertStringNotContainsString("dataset.unavailable === 'true'", $script);
    }

    /**
     * @return array<string, mixed>
     */
    private function snapshotOffering(Catalog $catalog, string $slug): array
    {
        return collect($catalog->activeSnapshot->payload['collections'])
            ->flatMap(fn (array $collection): array => $collection['offerings'])
            ->firstWhere('slug', $slug);
    }

    private function xpath(TestResponse $response): DOMXPath
    {
        $document = new DOMDocument;
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML($response->getContent());
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return new DOMXPath($document);
    }
}
