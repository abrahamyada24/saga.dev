@extends('layouts.public')

@section('title', data_get($payload, 'seo.title').' - Bio Menu')

@section('body')
    @php
        $organization = $payload['organization'];
        $catalog = $payload['catalog'];
        $collections = collect($payload['collections'])->map(function ($collection) {
            $collection['offerings'] = collect($collection['offerings'])
                ->whereIn('visibility', ['both', 'mobile'])
                ->values()->all();
            return $collection;
        })->filter(fn ($collection) => count($collection['offerings']) > 0)->values();
        $brandInitials = collect(preg_split('/\s+/', trim($organization['name'])))
            ->filter()
            ->take(2)
            ->map(fn ($word) => mb_strtoupper(mb_substr($word, 0, 1)))
            ->implode('');
        $priorityImageSlug = $collections
            ->flatMap(fn ($collection) => $collection['offerings'])
            ->first(fn ($offering) => collect($offering['media'])->contains(
                fn ($media) => $media['role'] === 'primary_image' && filled($media['url']),
            ))['slug'] ?? null;
        $priorityImageRendered = false;
    @endphp

    <main class="catalog-shell catalog-shell--mobile">
        <header class="mobile-header">
            <div class="mobile-brand-row">
                <div class="brand-mark" aria-hidden="true">{{ $brandInitials }}</div>
                <div class="header-controls">
                    @if (count($availableLocales ?? []) > 1)
                        <nav class="locale-switch" aria-label="Bahasa menu">
                            @foreach ($availableLocales as $localeOption)
                                <a href="{{ request()->fullUrlWithQuery(['lang' => $localeOption]) }}" aria-current="{{ $localeOption === $locale ? 'true' : 'false' }}">{{ strtoupper($localeOption) }}</a>
                            @endforeach
                        </nav>
                    @endif
                    <span class="open-status">Buka sekarang</span>
                </div>
            </div>
            <p class="surface-label">Bio Menu</p>
            <h1>{{ $organization['name'] }}</h1>
            <p>{{ $catalog['hero_subtitle'] }}</p>
            <dl class="business-strip">
                <div>
                    <dt>Jam buka</dt>
                    <dd>{{ data_get($catalog, 'business_info.hours', 'Cek outlet') }}</dd>
                </div>
                <div>
                    <dt>Lokasi</dt>
                    <dd>{{ data_get($catalog, 'business_info.address', $organization['address']) }}</dd>
                </div>
            </dl>
        </header>

        <div class="mobile-tools">
            <label class="search-field">
                <span class="sr-only">Cari menu</span>
                <input type="search" placeholder="Cari menu, rasa, atau bahan" data-catalog-search autocomplete="off">
                <button type="button" data-search-clear aria-label="Hapus pencarian">Hapus</button>
            </label>
            <div class="dietary-filters" aria-label="Filter kebutuhan menu">
                <button class="is-active" type="button" data-dietary-filter="">Semua</button>
                <button type="button" data-dietary-filter="vegetarian">Vegetarian</button>
                <button type="button" data-dietary-filter="vegan">Vegan</button>
                <button type="button" data-dietary-filter="milk-free">Tanpa susu</button>
            </div>
            <p class="result-count" data-result-count aria-live="polite"></p>
            <nav class="collection-rail collection-rail--mobile" aria-label="Kategori menu">
                @foreach ($collections as $collection)
                    <a class="{{ $loop->first ? 'is-active' : '' }}" href="#collection-{{ $collection['slug'] }}" data-collection-link="{{ $collection['slug'] }}">
                        {{ $collection['name'] }}
                    </a>
                @endforeach
            </nav>
        </div>

        <div class="catalog-content" id="catalog-content">
            @forelse ($collections as $collection)
                <section class="collection-section" id="collection-{{ $collection['slug'] }}" data-collection="{{ $collection['slug'] }}">
                    <div class="section-heading section-heading--mobile">
                        <div>
                            <h2>{{ $collection['name'] }}</h2>
                            <p>{{ $collection['description'] }}</p>
                        </div>
                        <span>{{ count($collection['offerings']) }}</span>
                    </div>
                    <div class="offering-list">
                        @foreach ($collection['offerings'] as $offering)
                            @php
                                $priorityImage = ! $priorityImageRendered && $offering['slug'] === $priorityImageSlug;
                                $priorityImageRendered = $priorityImageRendered || $priorityImage;
                            @endphp
                            @include('public.partials.offering-card', [
                                'offering' => $offering,
                                'mode' => 'mobile',
                                'priorityImage' => $priorityImage,
                            ])
                        @endforeach
                    </div>
                </section>
            @empty
                <section class="empty-state">
                    <img src="{{ asset('assets/illustrations/empty-catalog.webp') }}" alt="" width="640" height="640">
                    <h2>Catalog sedang diperbarui</h2>
                    <p>Coba buka kembali beberapa saat lagi.</p>
                </section>
            @endforelse

            <section class="search-empty" data-search-empty hidden>
                <img src="{{ asset('assets/illustrations/empty-catalog.webp') }}" alt="" width="640" height="640">
                <h2>Menu tidak ditemukan</h2>
                <p>Coba kata yang lebih singkat atau pilih kategori di atas.</p>
                <button type="button" data-search-reset>Reset pencarian</button>
            </section>
        </div>

        <footer class="public-footer">
            <div>
                <strong>{{ $organization['name'] }}</strong>
                <span>{{ data_get($catalog, 'business_info.instagram') }}</span>
            </div>
            <a href="{{ route('privacy') }}">Privasi</a>
        </footer>
    </main>

    @foreach ($collections->flatMap(fn ($collection) => $collection['offerings'])->unique('slug') as $offering)
        @include('public.partials.offering-dialog', ['offering' => $offering, 'mode' => 'mobile'])
    @endforeach
@endsection
