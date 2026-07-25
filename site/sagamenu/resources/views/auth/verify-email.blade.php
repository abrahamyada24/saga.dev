@extends('auth.layout')
@section('title', 'Verifikasi email')
@section('content')
    <p class="eyebrow">Verifikasi email</p>
    <h2>Aktifkan akunmu</h2>
    <p class="intro">Buka tautan dari email, atau masukkan token verifikasi di bawah.</p>
    <form method="post" action="{{ route('saga-platform.verify') }}">
        @csrf
        <div class="field"><label for="verification_token">Token verifikasi</label><input id="verification_token" name="verification_token" value="{{ old('verification_token', $token) }}" autocomplete="one-time-code" required></div>
        <button type="submit">Verifikasi dan siapkan dashboard</button>
    </form>
    @if ($canRetryProvisioning)
        <form method="post" action="{{ route('saga-platform.provisioning.retry') }}">@csrf<button class="secondary" type="submit">Coba siapkan dashboard lagi</button></form>
    @endif
    <p class="switch"><a href="{{ route('saga-platform.signup.show') }}">Kembali ke pendaftaran</a></p>
@endsection
