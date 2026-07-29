<?php

namespace App\Http\Controllers;

use App\Models\AnalyticsEvent;
use App\Models\Catalog;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AnalyticsEventController extends Controller
{
    private const EVENTS = [
        'catalog_viewed',
        'collection_selected',
        'offering_opened',
        'video_played',
        'sold_out_opened',
        'search_performed',
        'search_zero_result',
        'external_action_clicked',
        'catalog_shared',
    ];

    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'event_id' => ['required', 'uuid'],
            'brand' => ['required', 'string', 'max:120'],
            'catalog' => ['required', 'string', 'max:120'],
            'event_name' => ['required', Rule::in(self::EVENTS)],
            'surface' => ['required', Rule::in(['mobile', 'store'])],
            'session_key' => ['nullable', 'string', 'max:100'],
            'collection_slug' => ['nullable', 'string', 'max:120'],
            'offering_slug' => ['nullable', 'string', 'max:120'],
            'search_term' => ['nullable', 'string', 'max:120'],
            'metadata' => ['nullable', 'array'],
        ]);

        $organization = Organization::query()->where('slug', $data['brand'])->firstOrFail();
        $catalog = Catalog::query()->whereBelongsTo($organization)->where('slug', $data['catalog'])->firstOrFail();

        AnalyticsEvent::query()->firstOrCreate(
            ['event_id' => $data['event_id']],
            [
                'organization_id' => $organization->id,
                'catalog_id' => $catalog->id,
                'event_name' => $data['event_name'],
                'surface' => $data['surface'],
                'session_key' => isset($data['session_key']) ? hash('sha256', $data['session_key']) : null,
                'collection_slug' => $data['collection_slug'] ?? null,
                'offering_slug' => $data['offering_slug'] ?? null,
                'search_term' => isset($data['search_term']) ? Str::limit(strip_tags($data['search_term']), 120, '') : null,
                'metadata' => array_intersect_key($data['metadata'] ?? [], array_flip(['result_count', 'action_label', 'source_key'])),
                'occurred_at' => now(),
            ],
        );

        return response()->json(['accepted' => true], 202);
    }
}
