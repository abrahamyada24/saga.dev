<x-filament-panels::page>
    @if (! $catalog)
        <section class="sm-editorial-empty">
            <span class="sm-editorial-kicker">Owner workspace</span>
            <h2>Pilih organization untuk membuka editorial workspace.</h2>
            <p>Owner melihat catalog organisasinya. SagaDev admin perlu memulai assist session agar data tenant tidak tercampur.</p>
        </section>
    @else
        <div
            class="sm-editorial-dashboard"
            x-data="{
                mode: 'store',
                zoom: 1,
                storeUrl: @js($storePreviewUrl),
                mobileUrl: @js($mobilePreviewUrl),
                get previewUrl() { return this.mode === 'store' ? this.storeUrl : this.mobileUrl },
                get previewScale() { return (this.mode === 'store' ? .62 : .72) * this.zoom },
                zoomIn() { this.zoom = Math.min(1.3, Math.round((this.zoom + .1) * 10) / 10) },
                zoomOut() { this.zoom = Math.max(.7, Math.round((this.zoom - .1) * 10) / 10) },
            }"
        >
            <section class="sm-editorial-status-line">
                <div>
                    <span class="sm-editorial-kicker">Workspace hari ini</span>
                    <h2>Menu siap ditinjau dalam satu kanvas.</h2>
                    <p>{{ $catalog->organization->name }} · {{ $catalog->name }}</p>
                </div>
                <dl>
                    <div><dt>Live version</dt><dd>v{{ $catalog->activeSnapshot?->version ?? 0 }}</dd></div>
                    <div><dt>Item aktif</dt><dd>{{ $activeCount }}</dd></div>
                    <div><dt>Sold out</dt><dd>{{ $soldOutCount }}</dd></div>
                    <div><dt>Tanpa media</dt><dd>{{ $missingMediaCount }}</dd></div>
                </dl>
                <img src="{{ asset('assets/illustrations/dashboard-story.webp') }}" alt="">
            </section>

            <section class="sm-editorial-workspace">
                <article class="sm-live-preview">
                    <header>
                        <div>
                            <span class="sm-editorial-kicker">Draft preview</span>
                            <h3 x-text="mode === 'store' ? 'Store Display' : 'Bio Menu'"></h3>
                            <p>Renderer publik yang sama, memakai data draft terbaru.</p>
                        </div>
                        <div class="sm-preview-tools">
                            <div class="sm-segmented" aria-label="Pilih perangkat preview">
                                <button type="button" x-on:click="mode = 'store'" x-bind:class="{ 'is-active': mode === 'store' }">
                                    <x-filament::icon icon="heroicon-o-computer-desktop" />
                                    <span>Store Display</span>
                                </button>
                                <button type="button" x-on:click="mode = 'mobile'" x-bind:class="{ 'is-active': mode === 'mobile' }">
                                    <x-filament::icon icon="heroicon-o-device-phone-mobile" />
                                    <span>Bio Menu</span>
                                </button>
                            </div>
                            <div class="sm-zoom-tools">
                                <button type="button" x-on:click="zoomOut()" aria-label="Perkecil preview"><x-filament::icon icon="heroicon-o-minus" /></button>
                                <button type="button" x-on:click="zoom = 1" x-text="`${Math.round(zoom * 100)}%`" aria-label="Reset ukuran preview"></button>
                                <button type="button" x-on:click="zoomIn()" aria-label="Perbesar preview"><x-filament::icon icon="heroicon-o-plus" /></button>
                                <a x-bind:href="previewUrl" target="_blank" rel="noopener" aria-label="Buka preview penuh"><x-filament::icon icon="heroicon-o-arrows-pointing-out" /></a>
                            </div>
                        </div>
                    </header>
                    <div class="sm-preview-stage" x-bind:class="mode === 'store' ? 'is-store' : 'is-mobile'">
                        <div class="sm-preview-device" x-bind:style="`transform: translateX(-50%) scale(${previewScale})`">
                            <iframe
                                x-bind:src="previewUrl"
                                title="Draft preview SagaMenu"
                                loading="eager"
                                referrerpolicy="same-origin"
                            ></iframe>
                        </div>
                    </div>
                    <footer>
                        <span>Draft preview tidak mengubah versi live.</span>
                        <span>Terakhir terbit {{ optional($catalog->last_published_at)->timezone('Asia/Jakarta')->format('d M Y, H.i') ?? 'belum pernah' }}</span>
                    </footer>
                </article>

                <aside class="sm-editorial-rail">
                    <section>
                        <header><div><h3>Perlu perhatian</h3><p>Prioritas kualitas catalog</p></div></header>
                        <a href="{{ $catalogsUrl }}">
                            <span class="is-pink"><x-filament::icon icon="heroicon-o-document-text" /></span>
                            <span><strong>{{ $catalog->status === 'published' ? 'Periksa draft sebelum publish' : 'Catalog masih berupa draft' }}</strong><small>Versi live tetap aman sampai publish berhasil.</small></span>
                        </a>
                        <a href="{{ $offeringsUrl }}">
                            <span class="is-yellow"><x-filament::icon icon="heroicon-o-eye-slash" /></span>
                            <span><strong>{{ $soldOutCount }} item sedang sold out</strong><small>Perbarui availability sesuai kondisi outlet.</small></span>
                        </a>
                        <a href="{{ $offeringsUrl }}">
                            <span class="is-blue"><x-filament::icon icon="heroicon-o-photo" /></span>
                            <span><strong>{{ $missingMediaCount }} item belum mempunyai media</strong><small>Foto produk membantu customer memindai menu.</small></span>
                        </a>
                    </section>
                    <section class="sm-publish-context">
                        <span><x-filament::icon icon="heroicon-o-shield-check" /></span>
                        <div><small>Snapshot aktif</small><strong>Versi {{ $catalog->activeSnapshot?->version ?? 0 }}</strong><p>Publish memakai transaksi atomik dan mempertahankan versi lama saat validasi gagal.</p></div>
                        <a href="{{ $catalogsUrl }}">Review dan publish</a>
                    </section>
                </aside>
            </section>

            <section class="sm-recent-offerings">
                <header>
                    <div><h3>Item terbaru</h3><p>{{ $offerings->count() }} dari {{ $catalog->offerings->count() }} item</p></div>
                    <a href="{{ $offeringsUrl }}">Lihat semua</a>
                </header>
                @forelse ($offerings as $offering)
                    @php
                        $media = $offering->media->first()?->mediaAsset;
                    @endphp
                    <a href="{{ $offeringsUrl }}" class="sm-offering-row">
                        @if ($media)
                            <img src="{{ $media->publicUrl() }}" alt="">
                        @else
                            <span class="sm-media-placeholder"><x-filament::icon icon="heroicon-o-photo" /></span>
                        @endif
                        <span><strong>{{ $offering->name }}</strong><small>{{ $offering->primaryCollection?->name ?? 'Tanpa kategori' }}</small></span>
                        <b>{{ $offering->price_label ?: 'Rp '.number_format((int) $offering->price_min_minor, 0, ',', '.') }}</b>
                        <span class="sm-status-badge {{ $offering->availability === 'available' ? 'is-active' : 'is-sold-out' }}">{{ $offering->availability === 'available' ? 'Aktif' : 'Sold out' }}</span>
                        <x-filament::icon icon="heroicon-o-pencil-square" />
                    </a>
                @empty
                    <div class="sm-editorial-empty is-inline"><p>Belum ada item. Tambahkan menu pertama dari halaman Menu & Katalog.</p></div>
                @endforelse
            </section>
        </div>
    @endif
</x-filament-panels::page>
