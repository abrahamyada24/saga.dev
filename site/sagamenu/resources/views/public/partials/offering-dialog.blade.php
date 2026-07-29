@php
    $media = collect($offering['media'])->firstWhere('role', 'primary_image');
    $video = collect($offering['media'])->firstWhere('role', 'menu_video');
    $gallery = collect($offering['media'])->where('type', 'image');
    $availabilityLabel = match ($offering['availability']) {
        'sold_out' => 'Sold out',
        'temporary' => 'Sementara tidak tersedia',
        'coming_soon' => 'Segera hadir',
        'seasonal' => 'Seasonal',
        default => 'Tersedia',
    };
@endphp

<dialog class="offering-dialog offering-dialog--{{ $mode }}" id="offering-{{ $offering['slug'] }}" data-offering-dialog="{{ $offering['slug'] }}">
    <div class="offering-dialog__frame">
        <button type="button" class="dialog-close" data-dialog-close aria-label="Tutup detail">Tutup</button>
        <div class="offering-dialog__media" data-image-container>
            <div class="media-fallback" aria-hidden="true"><span>{{ strtoupper(substr($offering['name'], 0, 1)) }}</span></div>
            @if (data_get($media, 'url'))
                <img src="{{ $media['url'] }}" alt="{{ $media['alt_text'] }}">
            @endif
        </div>
        <div class="offering-dialog__content">
            @if (data_get($video, 'url'))
                <div class="offering-dialog__video">
                    <video
                        controls
                        playsinline
                        preload="metadata"
                        @if (data_get($video, 'thumbnail_url') ?: data_get($media, 'url'))
                            poster="{{ data_get($video, 'thumbnail_url') ?: data_get($media, 'url') }}"
                        @endif
                        aria-label="Video {{ $offering['name'] }}"
                    >
                        <source src="{{ $video['url'] }}" type="{{ $video['mime_type'] ?: 'video/mp4' }}">
                        Browser Anda tidak mendukung pemutar video.
                    </video>
                </div>
                @if (! empty($offering['video_transcript']))
                    <details class="video-transcript">
                        <summary>Transcript video</summary>
                        <p>{{ $offering['video_transcript'] }}</p>
                    </details>
                @endif
            @endif
            <div class="dialog-title-row">
                <div>
                    <span class="availability-text">{{ $availabilityLabel }}</span>
                    <h2>{{ $offering['name'] }}</h2>
                </div>
                <div class="dialog-price">
                    @if (data_get($offering, 'price.original_minor') && data_get($offering, 'price.promo_minor'))
                        <del>Rp {{ number_format(data_get($offering, 'price.original_minor'), 0, ',', '.') }}</del>
                    @endif
                    <strong>{{ data_get($offering, 'price.label') }}</strong>
                </div>
            </div>

            <p class="dialog-description">{{ $offering['full_description'] ?: $offering['short_description'] }}</p>

            @if ($gallery->count() > 1)
                <div class="dialog-gallery" aria-label="Galeri {{ $offering['name'] }}">
                    @foreach ($gallery->take(6) as $galleryMedia)
                        <img src="{{ $galleryMedia['url'] }}" alt="{{ $galleryMedia['alt_text'] }}" loading="lazy" decoding="async">
                    @endforeach
                </div>
            @endif

            @if (count($offering['variants'] ?? []))
                <section class="detail-section">
                    <h3>Varian</h3>
                    @foreach ($offering['variants'] as $group)
                        <div class="info-group">
                            <strong>{{ $group['name'] }}</strong>
                            <ul>
                                @foreach ($group['values'] as $value)
                                    <li><span>{{ $value['name'] }}</span>@if ($value['price_minor'])<span>Rp {{ number_format($value['price_minor'], 0, ',', '.') }}</span>@endif</li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </section>
            @endif

            @if (count($offering['option_groups'] ?? []))
                <section class="detail-section">
                    <h3>Opsi tambahan</h3>
                    <p class="section-note">Ditampilkan sebagai informasi. Konfirmasi ketersediaan kepada staf.</p>
                    @foreach ($offering['option_groups'] as $group)
                        <div class="info-group">
                            <strong>{{ $group['name'] }}</strong>
                            @if ($group['description'])<p>{{ $group['description'] }}</p>@endif
                            @if (($group['min_selections'] ?? 0) > 0 || ($group['max_selections'] ?? null))
                                <p class="section-note">
                                    @if (($group['min_selections'] ?? 0) > 0 && ($group['max_selections'] ?? null))
                                        Pilih {{ $group['min_selections'] }}-{{ $group['max_selections'] }} opsi.
                                    @elseif (($group['min_selections'] ?? 0) > 0)
                                        Pilih minimal {{ $group['min_selections'] }} opsi.
                                    @else
                                        Pilih maksimal {{ $group['max_selections'] }} opsi.
                                    @endif
                                </p>
                            @endif
                            <ul>
                                @foreach ($group['values'] as $value)
                                    <li><span>{{ $value['name'] }}</span>@if ($value['price_delta_minor'])<span>+Rp {{ number_format($value['price_delta_minor'], 0, ',', '.') }}</span>@endif</li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </section>
            @endif

            @if (count($offering['inclusions'] ?? []))
                <section class="detail-section">
                    <h3>Yang termasuk</h3>
                    <ul class="inclusion-list">
                        @foreach ($offering['inclusions'] as $inclusion)
                            <li>{{ $inclusion }}</li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if ($offering['ingredients'] || count($offering['allergens'] ?? []) || $offering['serving_note'])
                <section class="detail-section detail-section--facts">
                    <h3>Informasi menu</h3>
                    @if ($offering['ingredients'])<p><strong>Bahan:</strong> {{ $offering['ingredients'] }}</p>@endif
                    @if (count($offering['allergens'] ?? []))<p><strong>Alergen:</strong> {{ implode(', ', $offering['allergens']) }}</p>@endif
                    @if ($offering['serving_note'])<p><strong>Catatan:</strong> {{ $offering['serving_note'] }}</p>@endif
                </section>
            @endif

        </div>
    </div>
</dialog>
