<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use App\Services\Publishing\CatalogSnapshotBuilder;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class AdminCatalogPreviewController extends Controller
{
    public function __invoke(
        Catalog $catalog,
        string $surface,
        CatalogSnapshotBuilder $builder,
    ): Response {
        Gate::authorize('view', $catalog);
        abort_unless(in_array($surface, ['mobile', 'store'], true), 404);

        $view = $surface === 'store' ? 'public.store-display' : 'public.mobile-catalog';
        $payload = $builder->build($catalog);
        $locale = (string) data_get($payload, 'organization.locale', 'id');
        $availableLocales = array_values(array_unique([
            $locale,
            ...array_values(array_filter((array) data_get($payload, 'catalog.settings.enabled_locales', []))),
        ]));
        $response = response()->view($view, [
            'catalogModel' => $catalog,
            'payload' => $payload,
            'surface' => $surface,
            'isPreview' => true,
            'analyticsEndpoint' => route('analytics.events'),
            'locale' => $locale,
            'availableLocales' => $availableLocales,
        ]);

        return $response
            ->header('Cache-Control', 'no-store, private')
            ->header('X-Frame-Options', 'SAMEORIGIN')
            ->header('Content-Security-Policy', "frame-ancestors 'self'");
    }
}
