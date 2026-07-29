<?php

namespace App\Http\Controllers;

use App\Models\Catalog;
use App\Services\SagaPlatform\PublicCatalogAccessPolicy;
use Illuminate\Http\Response;
use XMLWriter;

class PublicSitemapController extends Controller
{
    private const MAX_URLS = 50000;

    public function __invoke(PublicCatalogAccessPolicy $access): Response
    {
        $baseUrl = rtrim((string) config('app.url'), '/');
        abort_unless(filter_var($baseUrl, FILTER_VALIDATE_URL), 503);

        $writer = new XMLWriter;
        $writer->openMemory();
        $writer->startDocument('1.0', 'UTF-8');
        $writer->startElement('urlset');
        $writer->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        $written = 0;
        Catalog::query()
            ->whereNotNull('active_snapshot_id')
            ->whereNull('archived_at')
            ->with([
                'activeSnapshot',
                'organization.sagaPlatformAccount',
                'organization.subscription',
            ])
            ->orderBy('id')
            ->chunkById(500, function ($catalogs) use ($access, $baseUrl, $writer, &$written): bool {
                foreach ($catalogs as $catalog) {
                    $snapshot = $catalog->activeSnapshot;
                    $organization = $catalog->organization;

                    if (! $snapshot
                        || ! data_get($snapshot->payload, 'catalog.mobile_catalog_enabled')
                        || $access->shouldShowMaintenance($organization)) {
                        continue;
                    }

                    $writer->startElement('url');
                    $writer->writeElement(
                        'loc',
                        $baseUrl.route('public.mobile-catalog', [
                            'brand' => $organization->slug,
                            'catalog' => $catalog->slug,
                        ], false),
                    );

                    if ($snapshot->published_at) {
                        $writer->writeElement('lastmod', $snapshot->published_at->toAtomString());
                    }

                    $writer->endElement();
                    $written++;

                    if ($written >= self::MAX_URLS) {
                        return false;
                    }
                }

                return true;
            });

        $writer->endElement();
        $writer->endDocument();

        return response($writer->outputMemory())
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
