@extends('auth.layout')
@section('title', 'Masuk')
@section('content')
    <p class="eyebrow">Dashboard business</p>
    <h2>Masuk ke Saga Menu</h2>
    <p class="intro">Gunakan akun pusat yang sudah terverifikasi.</p>
    <form method="post" action="{{ route('saga-platform.login') }}">
        @csrf
        <div class="field"><label for="email">Email</label><input id="email" type="email" name="email" value="{{ old('email') }}" autocomplete="email" required autofocus></div>
        <div class="field"><label for="password">Password</label><input id="password" type="password" name="password" autocomplete="current-password" required></div>
        <button type="submit">Masuk</button>
    </form>
    <p class="switch">Belum punya akun? <a href="{{ route('saga-platform.signup.show') }}">Mulai free trial</a></p>
@endsection
