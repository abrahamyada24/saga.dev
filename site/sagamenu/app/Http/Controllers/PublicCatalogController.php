<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use App\Models\Organization;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Cache;

class PublicCatalogController extends Controller
{
    public function store(string $brand, string $catalog): View
    {
        [$model, $payload] = $this->livePayload($brand, $catalog);
        abort_unless(data_get($payload, 'catalog.store_display_enabled'), 404);

        return view('public.store-display', $this->viewData($model, $payload, 'store', false));
    }

    public function mobile(string $brand, string $catalog): View
    {
        [$model, $payload] = $this->livePayload($brand, $catalog);
        abort_unless(data_get($payload, 'catalog.mobile_catalog_enabled'), 404);

        return view('public.mobile-catalog', $this->viewData($model, $payload, 'mobile', false));
    }

    public function preview(string $token, PreviewTokenService $tokens): View
    {
        $preview = $tokens->resolve($token);
        $view = $preview->surface === 'store' ? 'public.store-display' : 'public.mobile-catalog';

        return view($view, $this->viewData($preview->catalog, $preview->payload, $preview->surface, true));
    }

    private function livePayload(string $brand, string $catalogSlug): array
    {
        $organization = Organization::query()->where('slug', $brand)->firstOrFail();
        $catalog = Catalog::query()
            ->whereBelongsTo($organization)
            ->where('slug', $catalogSlug)
            ->with('activeSnapshot')
            ->firstOrFail();

        abort_unless($catalog->activeSnapshot, 404);

        $key = app(CatalogPublisher::class)->cacheKey($catalog);
        $payload = Cache::remember($key, now()->addMinutes(30), fn () => $catalog->activeSnapshot->payload);

        return [$catalog, $payload];
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
}
