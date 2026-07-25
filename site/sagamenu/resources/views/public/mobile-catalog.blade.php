@extends('layouts.public')

@section('title', data_get($payload, 'seo.title').' - Mobile Catalog')

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
    @endphp

    <main class="catalog-shell catalog-shell--mobile">
        <header class="mobile-header">
            <div class="brand-mark" aria-hidden="true">S</div>
            <p class="surface-label">Mobile Catalog</p>
            <h1>{{ $organization['name'] }}</h1>
            <p>{{ $catalog['hero_subtitle'] }}</p>
            <dl class="business-strip">
                <div>
                    <dt>Buka</dt>
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
            </label>
            <nav class="collection-rail collection-rail--mobile" aria-label="Kategori menu">
                @foreach ($collections as $collection)
                    <a href="#collection-{{ $collection['slug'] }}" data-collection-link="{{ $collection['slug'] }}">
                        {{ $collection['name'] }}
                    </a>
                @endforeach
            </nav>
        </div>

        <div class="catalog-content">
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
                            @include('public.partials.offering-card', ['offering' => $offering, 'mode' => 'mobile'])
                        @endforeach
                    </div>
                </section>
            @empty
                <section class="empty-state">
                    <h2>Catalog sedang diperbarui</h2>
                    <p>Coba buka kembali beberapa saat lagi.</p>
                </section>
            @endforelse

            <section class="search-empty" data-search-empty hidden>
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
