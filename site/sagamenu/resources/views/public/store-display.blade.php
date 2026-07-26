@extends('layouts.public')

@section('title', data_get($payload, 'seo.title').' - Store Display')

@section('body')
    @php
        $organization = $payload['organization'];
        $catalog = $payload['catalog'];
        $collections = collect($payload['collections'])->map(function ($collection) {
            $collection['offerings'] = collect($collection['offerings'])
                ->whereIn('visibility', ['both', 'store'])
                ->values()->all();
            return $collection;
        })->filter(fn ($collection) => count($collection['offerings']) > 0)->values();
        $qrRoute = $catalogModel->qrRoutes()->where('status', 'active')->first();
        $brandInitials = collect(preg_split('/\s+/', trim($organization['name'])))
            ->filter()
            ->take(2)
            ->map(fn ($word) => mb_strtoupper(mb_substr($word, 0, 1)))
            ->implode('');
    @endphp

    <main class="catalog-shell catalog-shell--store">
        <header class="store-header">
            <div class="brand-lockup">
                <span class="brand-mark" aria-hidden="true">{{ $brandInitials }}</span>
                <div>
                    <p class="surface-label">Store Display</p>
                    <h1>{{ $organization['name'] }}</h1>
                    <p>{{ $catalog['hero_subtitle'] }}</p>
                </div>
            </div>
            <div class="store-meta">
                <div>
                    <span class="meta-label">Jam buka</span>
                    <strong>{{ data_get($catalog, 'business_info.hours', 'Lihat informasi outlet') }}</strong>
                </div>
                @if ($qrRoute)
                    <a class="qr-link" href="{{ route('qr.redirect', ['code' => $qrRoute->code]) }}">
                        Lihat Bio Menu
                    </a>
                @endif
            </div>
        </header>

        <nav class="collection-rail" aria-label="Kategori menu">
            @foreach ($collections as $collection)
                <a class="{{ $loop->first ? 'is-active' : '' }}" href="#collection-{{ $collection['slug'] }}" data-collection-link="{{ $collection['slug'] }}">
                    {{ $collection['name'] }}
                </a>
            @endforeach
        </nav>

        <div class="catalog-content">
            @forelse ($collections as $collection)
                <section class="collection-section" id="collection-{{ $collection['slug'] }}" data-collection="{{ $collection['slug'] }}">
                    <div class="section-heading">
                        <div>
                            <p class="surface-label">{{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</p>
                            <h2>{{ $collection['name'] }}</h2>
                        </div>
                        @if ($collection['description'])
                            <p>{{ $collection['description'] }}</p>
                        @endif
                    </div>
                    <div class="offering-grid">
                        @foreach ($collection['offerings'] as $offering)
                            @include('public.partials.offering-card', ['offering' => $offering, 'mode' => 'store'])
                        @endforeach
                    </div>
                </section>
            @empty
                <section class="empty-state">
                    <img src="{{ asset('assets/illustrations/empty-catalog.webp') }}" alt="" width="640" height="640">
                    <h2>Catalog sedang diperbarui</h2>
                    <p>Silakan tanyakan menu yang tersedia kepada staf.</p>
                </section>
            @endforelse
        </div>

        <footer class="public-footer">
            <span>Informasi menu dapat berubah.</span>
            <a href="{{ route('privacy') }}">Privasi</a>
        </footer>
    </main>

    @foreach ($collections->flatMap(fn ($collection) => $collection['offerings'])->unique('slug') as $offering)
        @include('public.partials.offering-dialog', ['offering' => $offering, 'mode' => 'store'])
    @endforeach
@endsection
