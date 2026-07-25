<?php

namespace App\Filament\Widgets;

use App\Models\AnalyticsDailyRollup;
use App\Services\TenantContext;
use Filament\Widgets\Widget;
use Illuminate\Support\Collection;

class AnalyticsInsights extends Widget
{
    protected string $view = 'filament.widgets.analytics-insights';

    protected int|string|array $columnSpan = 'full';

    protected function getViewData(): array
    {
        $organizationId = app(TenantContext::class)->organizationId(auth()->user());
        $rollups = AnalyticsDailyRollup::query()
            ->when($organizationId, fn ($query) => $query->where('organization_id', $organizationId))
            ->where('date', '>=', today()->subDays(29))
            ->get();

        return [
            'insights' => [
                'Top offerings' => $this->mergeRankings($rollups, 'top_offerings'),
                'Top collections' => $this->mergeRankings($rollups, 'top_collections'),
                'Top searches' => $this->mergeRankings($rollups, 'top_searches'),
                'QR sources' => $this->mergeRankings($rollups, 'qr_sources'),
            ],
        ];
    }

    private function mergeRankings(Collection $rollups, string $field): array
    {
        return $rollups
            ->flatMap(fn (AnalyticsDailyRollup $rollup) => collect($rollup->{$field} ?? [])->map(
                fn ($count, $key) => ['key' => $key, 'count' => $count],
            )->values())
            ->groupBy('key')
            ->map(fn (Collection $rows, string $key) => ['key' => $key, 'count' => $rows->sum('count')])
            ->sortByDesc('count')
            ->take(5)
            ->values()
            ->all();
    }
}
