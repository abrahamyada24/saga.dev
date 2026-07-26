<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Catalogs\CatalogResource;
use App\Filament\Resources\Offerings\OfferingResource;
use App\Models\Catalog;
use App\Services\TenantContext;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected string $view = 'filament.pages.dashboard';

    protected function getViewData(): array
    {
        $organizationId = app(TenantContext::class)->organizationId(auth()->user());
        $catalog = $organizationId
            ? Catalog::query()
                ->where('organization_id', $organizationId)
                ->with([
                    'organization',
                    'activeSnapshot',
                    'collections',
                    'offerings.primaryCollection',
                    'offerings.media.mediaAsset',
                ])
                ->latest('updated_at')
                ->first()
            : null;

        $offerings = $catalog?->offerings
            ->whereNull('archived_at')
            ->sortBy('sort_order')
            ->take(6)
            ->values() ?? collect();

        return [
            'catalog' => $catalog,
            'offerings' => $offerings,
            'activeCount' => $catalog?->offerings->where('availability', 'available')->count() ?? 0,
            'soldOutCount' => $catalog?->offerings->where('availability', 'sold_out')->count() ?? 0,
            'missingMediaCount' => $catalog?->offerings->filter(fn ($offering) => $offering->media->isEmpty())->count() ?? 0,
            'storePreviewUrl' => $catalog ? route('admin.catalog-preview', [$catalog, 'store']) : null,
            'mobilePreviewUrl' => $catalog ? route('admin.catalog-preview', [$catalog, 'mobile']) : null,
            'catalogsUrl' => CatalogResource::getUrl('index'),
            'offeringsUrl' => OfferingResource::getUrl('index'),
        ];
    }

    public function getWidgets(): array
    {
        return [];
    }
}
