<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use App\Models\Organization;
use App\Services\Catalog\OfferingAvailability;
use App\Services\Publishing\CatalogPublisher;
use App\Services\Publishing\PreviewTokenService;
use App\Services\SagaPlatform\PublicCatalogAccessPolicy;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class PublicCatalogController extends Controller
{
    public function __construct(
        private readonly PublicCatalogAccessPolicy $access,
        private readonly OfferingAvailability $availability,
    ) {}

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
        [$payload, $locale, $availableLocales] = $this->preparePayload(
            $payload,
            $surface,
            (string) request()->query('lang', ''),
        );

        return [
            'catalogModel' => $catalog,
            'payload' => $payload,
            'surface' => $surface,
            'isPreview' => $preview,
            'analyticsEndpoint' => route('analytics.events'),
            'locale' => $locale,
            'availableLocales' => $availableLocales,
        ];
    }

    /**
     * @return array{0: array, 1: string, 2: array<int, string>}
     */
    private function preparePayload(array $payload, string $surface, string $requestedLocale): array
    {
        $defaultLocale = (string) data_get($payload, 'organization.locale', 'id');
        $configuredLocales = array_values(array_filter((array) data_get($payload, 'catalog.settings.enabled_locales', [])));
        $translationLocales = collect(data_get($payload, 'collections', []))
            ->flatMap(fn (array $collection) => collect($collection['offerings'] ?? [])->flatMap(
                fn (array $offering) => array_keys($offering['translations'] ?? []),
            ))
            ->unique()
            ->values()
            ->all();
        $availableLocales = array_values(array_unique([$defaultLocale, ...$configuredLocales, ...$translationLocales]));
        $locale = in_array($requestedLocale, $availableLocales, true) ? $requestedLocale : $defaultLocale;
        $now = now();

        $payload['collections'] = collect($payload['collections'] ?? [])
            ->map(function (array $collection) use ($surface, $locale, $defaultLocale, $now): array {
                $collection['offerings'] = collect($collection['offerings'] ?? [])
                    ->filter(fn (array $offering): bool => $this->offeringIsVisible($offering, $surface, $now))
                    ->map(function (array $offering) use ($locale, $defaultLocale): array {
                        $offering = $this->localizeOffering($offering, $locale, $defaultLocale);
                        $offering['availability_state'] = $this->availability->publicState($offering['availability'] ?? null);

                        return $offering;
                    })
                    ->values()
                    ->all();

                return $collection;
            })
            ->filter(fn (array $collection): bool => count($collection['offerings']) > 0)
            ->values()
            ->all();

        return [$payload, $locale, $availableLocales];
    }

    private function offeringIsVisible(array $offering, string $surface, Carbon $now): bool
    {
        $visibility = $offering['visibility'] ?? 'both';
        if ($visibility === 'hidden') {
            return false;
        }
        if ($surface === 'mobile' && $visibility === 'store') {
            return false;
        }
        if ($surface === 'store' && $visibility === 'mobile') {
            return false;
        }

        $startsAt = ! empty($offering['available_from']) ? Carbon::parse($offering['available_from']) : null;
        $endsAt = ! empty($offering['available_until']) ? Carbon::parse($offering['available_until']) : null;

        return (! $startsAt || $now->gte($startsAt)) && (! $endsAt || $now->lte($endsAt));
    }

    private function localizeOffering(array $offering, string $locale, string $defaultLocale): array
    {
        if ($locale === $defaultLocale) {
            return $offering;
        }

        $translation = data_get($offering, "translations.{$locale}", []);
        foreach (['name', 'short_description', 'full_description', 'video_transcript'] as $field) {
            if (! empty($translation[$field])) {
                $offering[$field] = $translation[$field];
            }
        }

        return $offering;
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
