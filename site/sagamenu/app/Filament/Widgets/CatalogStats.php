<?php

namespace App\Filament\Widgets;

use App\Models\AnalyticsDailyRollup;
use App\Models\Catalog;
use App\Services\TenantContext;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CatalogStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $organizationId = app(TenantContext::class)->organizationId(auth()->user());
        $rollups = AnalyticsDailyRollup::query()
            ->when($organizationId, fn ($query) => $query->where('organization_id', $organizationId))
            ->where('date', '>=', today()->subDays(29))
            ->get();
        $catalogCount = Catalog::query()->when($organizationId, fn ($query) => $query->where('organization_id', $organizationId))->count();

        return [
            Stat::make('Catalogs', number_format($catalogCount))->description('Active workspace catalog records'),
            Stat::make('Views (30 days)', number_format($rollups->sum('catalog_views')))->description('Mobile and Store Display'),
            Stat::make('Engaged sessions', number_format($rollups->sum('engaged_sessions')))->description('Meaningful catalog interactions'),
            Stat::make('Offering opens', number_format($rollups->sum('offering_opens')))->description('Detail views'),
        ];
    }
}
