<?php

namespace App\Console\Commands;

use App\Models\AnalyticsDailyRollup;
use App\Models\AnalyticsEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class RollupAnalyticsDaily extends Command
{
    protected $signature = 'sagamenu:analytics-rollup {date? : Date in Y-m-d format, defaults to today}';

    protected $description = 'Aggregate privacy-minimal Saga Menu analytics events by catalog and surface.';

    public function handle(): int
    {
        $date = Carbon::parse($this->argument('date') ?? today()->toDateString())->toDateString();

        $groups = AnalyticsEvent::query()
            ->whereDate('occurred_at', $date)
            ->get()
            ->groupBy(fn (AnalyticsEvent $event) => "{$event->organization_id}:{$event->catalog_id}:{$event->surface}");

        foreach ($groups as $events) {
            $first = $events->first();
            $meaningful = $events->whereIn('event_name', [
                'collection_selected', 'offering_opened', 'search_performed', 'external_action_clicked',
            ]);

            $topCollections = $events->whereNotNull('collection_slug')->countBy('collection_slug')->sortDesc()->take(5)->all();
            $topOfferings = $events->whereNotNull('offering_slug')->countBy('offering_slug')->sortDesc()->take(5)->all();
            $topSearches = $events->whereNotNull('search_term')->countBy('search_term')->sortDesc()->take(5)->all();
            $qrSources = $events
                ->where('event_name', 'qr_scanned')
                ->map(fn (AnalyticsEvent $event) => data_get($event->metadata, 'source_key', 'unknown'))
                ->countBy()
                ->sortDesc()
                ->take(5)
                ->all();

            $rollup = AnalyticsDailyRollup::query()
                ->where('catalog_id', $first->catalog_id)
                ->where('surface', $first->surface)
                ->whereDate('date', $date)
                ->first();

            $values = [
                'organization_id' => $first->organization_id,
                'catalog_views' => $events->where('event_name', 'catalog_viewed')->count(),
                'engaged_sessions' => $meaningful->pluck('session_key')->filter()->unique()->count(),
                'offering_opens' => $events->where('event_name', 'offering_opened')->count(),
                'qr_scans' => $events->where('event_name', 'qr_scanned')->count(),
                'searches' => $events->where('event_name', 'search_performed')->count(),
                'zero_results' => $events->where('event_name', 'search_zero_result')->count(),
                'top_collections' => $topCollections,
                'top_offerings' => $topOfferings,
                'top_searches' => $topSearches,
                'qr_sources' => $qrSources,
            ];

            $rollup
                ? $rollup->update($values)
                : AnalyticsDailyRollup::query()->create([...$values, 'catalog_id' => $first->catalog_id, 'date' => $date, 'surface' => $first->surface]);
        }

        $this->info("Analytics rollup complete for {$date} ({$groups->count()} groups).");

        return self::SUCCESS;
    }
}
