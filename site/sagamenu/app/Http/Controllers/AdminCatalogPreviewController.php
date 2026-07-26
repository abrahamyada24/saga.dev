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
        $response = response()->view($view, [
            'catalogModel' => $catalog,
            'payload' => $builder->build($catalog),
            'surface' => $surface,
            'isPreview' => true,
            'analyticsEndpoint' => route('analytics.events'),
        ]);

        return $response
            ->header('Cache-Control', 'no-store, private')
            ->header('X-Frame-Options', 'SAMEORIGIN')
            ->header('Content-Security-Policy', "frame-ancestors 'self'");
    }
}
