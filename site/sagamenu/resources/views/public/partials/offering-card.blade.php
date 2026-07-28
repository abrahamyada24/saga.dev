@php
    $media = collect($offering['media'])->firstWhere('role', 'primary_image');
    $video = collect($offering['media'])->firstWhere('role', 'menu_video');
    $isUnavailable = in_array($offering['availability'], ['sold_out', 'temporary', 'coming_soon', 'seasonal'], true);
    $availabilityLabel = match ($offering['availability']) {
        'sold_out' => 'Sold out',
        'temporary' => 'Sementara tidak tersedia',
        'coming_soon' => 'Segera hadir',
        'seasonal' => 'Seasonal',
        default => null,
    };
    $searchText = strtolower(implode(' ', array_filter([
        $offering['name'],
        $offering['short_description'],
        $offering['ingredients'],
        implode(' ', $offering['tags'] ?? []),
        implode(' ', $offering['inclusions'] ?? []),
    ])));
@endphp

<article class="offering-card offering-card--{{ $mode }} {{ $isUnavailable ? 'is-unavailable' : '' }}" data-search-item="{{ $searchText }}">
    <button
        type="button"
        class="offering-card__button"
        data-offering-open="{{ $offering['slug'] }}"
        data-offering-slug="{{ $offering['slug'] }}"
        aria-haspopup="dialog"
    >
        <div class="offering-card__media" data-image-container>
            <div class="media-fallback" aria-hidden="true"><span>{{ strtoupper(substr($offering['name'], 0, 1)) }}</span></div>
            @if (data_get($media, 'url'))
                <img src="{{ $media['url'] }}" alt="{{ $media['alt_text'] }}" loading="lazy" decoding="async">
            @endif
            @if ($availabilityLabel)
                <span class="availability-badge">{{ $availabilityLabel }}</span>
            @endif
            @if (data_get($video, 'url'))
                <span class="video-badge" aria-label="Memiliki video menu">
                    <span aria-hidden="true">▶</span> Video
                </span>
            @endif
        </div>
        <div class="offering-card__body">
            <div class="offering-card__title-row">
                <h3>{{ $offering['name'] }}</h3>
                @if (data_get($offering, 'price.label'))
                    <strong>{{ data_get($offering, 'price.label') }}</strong>
                @endif
            </div>
            <p>{{ $offering['short_description'] }}</p>
            @if (count($offering['badges'] ?? []))
                <div class="badge-row" aria-label="Penanda menu">
                    @foreach ($offering['badges'] as $badge)
                        <span>{{ $badge }}</span>
                    @endforeach
                </div>
            @endif
            <span class="detail-hint">Lihat detail</span>
        </div>
    </button>
</article>
