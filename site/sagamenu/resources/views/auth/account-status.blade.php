@extends('auth.layout')
@section('title', 'Status akun')
@section('content')
    @php
        $copy = match ($status) {
            'past_due' => ['Pembayaran perlu diperbarui', 'Akses dashboard ditahan sampai status pembayaran dikonfirmasi. Konten menu lokal tidak dihapus.'],
            'expired' => ['Masa akses telah berakhir', 'Aktifkan kembali langganan untuk membuka dashboard. Konten menu lokal tetap tersimpan.'],
            'suspended' => ['Akun sedang ditangguhkan', 'Akses dashboard dihentikan sementara. Hubungi pengelola Saga Menu untuk pemeriksaan status akun.'],
            'cancelled' => ['Langganan telah dibatalkan', 'Dashboard dapat digunakan kembali setelah langganan diaktifkan ulang. Konten lokal tidak dihapus otomatis.'],
            'provisioning_failed' => ['Dashboard belum berhasil disiapkan', 'Data pendaftaran sudah diterima, tetapi setup dashboard perlu diperiksa ulang.'],
            default => ['Akun belum dapat dibuka', 'Status akun belum dapat diverifikasi. Coba masuk kembali beberapa saat lagi.'],
        };
    @endphp
    <div class="status-panel">
        <div class="status-mark" aria-hidden="true">!</div>
        <div>
            <p class="eyebrow">Status akun</p>
            <h2 id="auth-title">{{ $copy[0] }}</h2>
            <p class="intro">{{ $copy[1] }}</p>
        </div>
        <div class="status-actions">
            <a href="{{ route('saga-platform.login.show') }}">Kembali ke halaman masuk</a>
            <a href="{{ route('privacy') }}">Lihat kebijakan data</a>
        </div>
    </div>
@endsection
