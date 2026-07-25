<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use App\Models\Organization;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use App\Services\SagaPlatform\PublicCatalogAccessPolicy;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class PublicCatalogController extends Controller
{
    public function __construct(private readonly PublicCatalogAccessPolicy $access) {}

    public function store(string $brand, string $catalog): View|Response
    {
        $model = $this->liveCatalog($brand, $catalog);
        if ($this->access->shouldShowMaintenance($model->organization)) {
            return $this->maintenance($model->organization);
        }
        $payload = $this->livePayload($model);
        abort_unless(data_get($payload, 'catalog.store_display_enabled'), 404);

        return view('public.store-display', $this->viewData($model, $payload, 'store', false));
    }

    public function mobile(string $brand, string $catalog): View|Response
    {
        $model = $this->liveCatalog($brand, $catalog);
        if ($this->access->shouldShowMaintenance($model->organization)) {
            return $this->maintenance($model->organization);
        }
        $payload = $this->livePayload($model);
        abort_unless(data_get($payload, 'catalog.mobile_catalog_enabled'), 404);

        return view('public.mobile-catalog', $this->viewData($model, $payload, 'mobile', false));
    }

    public function preview(string $token, PreviewTokenService $tokens): View|Response
    {
        $preview = $tokens->resolve($token);
        if ($this->access->shouldShowMaintenance($preview->catalog->organization)) {
            return $this->maintenance($preview->catalog->organization);
        }
        $view = $preview->surface === 'store' ? 'public.store-display' : 'public.mobile-catalog';

        return view($view, $this->viewData($preview->catalog, $preview->payload, $preview->surface, true));
    }

    private function liveCatalog(string $brand, string $catalogSlug): Catalog
    {
        $organization = Organization::query()->where('slug', $brand)->firstOrFail();

        return Catalog::query()
            ->whereBelongsTo($organization)
            ->where('slug', $catalogSlug)
            ->with('activeSnapshot')
            ->firstOrFail();
    }

    private function livePayload(Catalog $catalog): array
    {
        abort_unless($catalog->activeSnapshot, 404);

        $key = app(CatalogPublisher::class)->cacheKey($catalog);

        return Cache::remember($key, now()->addMinutes(30), fn () => $catalog->activeSnapshot->payload);
    }

    private function viewData(Catalog $catalog, array $payload, string $surface, bool $preview): array
    {
        return [
            'catalogModel' => $catalog,
            'payload' => $payload,
            'surface' => $surface,
            'isPreview' => $preview,
            'analyticsEndpoint' => route('analytics.events'),
        ];
    }

    private function maintenance(Organization $organization): Response
    {
        return response()
            ->view('public.maintenance', [
                'brandName' => $organization->name,
            ], 503)
            ->header('Cache-Control', 'no-store, private')
            ->header('Retry-After', (string) config('sagamenu.commercial.maintenance_retry_after_seconds', 3600));
    }
}
