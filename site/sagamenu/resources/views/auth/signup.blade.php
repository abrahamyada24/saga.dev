@extends('auth.layout')
@section('title', 'Daftar')
@section('content')
    <p class="eyebrow">Mulai free trial</p>
    <h2 id="auth-title">Buat akun Saga Menu</h2>
    <p class="intro">Siapkan business dan menu pertama. Publikasi tetap kamu kendalikan dari dashboard.</p>
    <form method="post" action="{{ route('saga-platform.signup') }}">
        @csrf
        <input type="hidden" name="idempotency_key" value="{{ $idempotencyKey }}">
        <div class="field"><label for="name">Nama pemilik</label><input id="name" name="name" value="{{ old('name') }}" autocomplete="name" required @error('name') aria-invalid="true" @enderror></div>
        <div class="field"><label for="email">Email</label><input id="email" type="email" name="email" value="{{ old('email') }}" autocomplete="email" required @error('email') aria-invalid="true" @enderror></div>
        <div class="field"><label for="organization_name">Nama business</label><input id="organization_name" name="organization_name" value="{{ old('organization_name') }}" autocomplete="organization" required @error('organization_name') aria-invalid="true" @enderror></div>
        <div class="two">
            <div class="field"><label for="business_type">Jenis business</label><select id="business_type" name="business_type"><option value="fnb" @selected(old('business_type') === 'fnb')>F&B</option><option value="service" @selected(old('business_type') === 'service')>Jasa</option><option value="product" @selected(old('business_type') === 'product')>Produk</option></select></div>
            <div class="field"><label for="timezone">Zona waktu</label><select id="timezone" name="timezone"><option value="Asia/Jakarta" @selected(old('timezone', 'Asia/Jakarta') === 'Asia/Jakarta')>WIB</option><option value="Asia/Makassar" @selected(old('timezone') === 'Asia/Makassar')>WITA</option><option value="Asia/Jayapura" @selected(old('timezone') === 'Asia/Jayapura')>WIT</option></select></div>
        </div>
        <div class="two">
            <div class="field"><label for="password">Password</label><input id="password" type="password" name="password" autocomplete="new-password" minlength="12" aria-describedby="password-hint" required><p class="field-hint" id="password-hint">Minimal 12 karakter.</p></div>
            <div class="field"><label for="password_confirmation">Ulangi password</label><input id="password_confirmation" type="password" name="password_confirmation" autocomplete="new-password" minlength="12" required></div>
        </div>
        <label class="check"><input type="checkbox" name="terms" value="1" required><span>Saya menyetujui ketentuan layanan dan <a href="{{ route('privacy') }}">kebijakan privasi</a> yang berlaku.</span></label>
        <button type="submit">Buat akun</button>
    </form>
    <p class="switch">Sudah punya akun? <a href="{{ route('saga-platform.login.show') }}">Masuk</a></p>
@endsection
