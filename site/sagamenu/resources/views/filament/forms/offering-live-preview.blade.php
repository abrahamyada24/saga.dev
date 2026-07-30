<aside class="sm-offering-editor-preview" aria-label="Preview menu">
    <header>
        <div>
            <span>Live preview</span>
            <strong>Bio Menu</strong>
        </div>
        <span class="sm-draft-pill">Draft</span>
    </header>
    <div class="sm-offering-preview-card">
        <div class="sm-offering-preview-image">
            <x-filament::icon icon="heroicon-o-photo" />
            <span>Foto yang dipilih tampil di upload preview</span>
        </div>
        <div>
            <strong>{{ $name }}</strong>
            <b>{{ $price > 0 ? 'Rp '.number_format($price, 0, ',', '.') : 'Harga belum diisi' }}</b>
            <p>{{ $description }}</p>
            <span class="is-{{ $availabilityState['tone'] }}">
                {{ $availabilityState['label'] }}
            </span>
        </div>
    </div>
    <div class="sm-editor-safety">
        <x-filament::icon icon="heroicon-o-shield-check" />
        <span><strong>Belum terlihat publik</strong><small>Perubahan baru tampil setelah catalog dipublish.</small></span>
    </div>
</aside>
