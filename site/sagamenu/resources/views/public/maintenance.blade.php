<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>Menu sedang maintenance - {{ $brandName }}</title>
    @vite(['resources/css/app.css'])
    <style>
        :root { color-scheme:light; --ink:#142019; --muted:#657068; --line:#d9dfda; --paper:#f3f5f1; --surface:#fff; --brand:#236354; --lime:#cbf45a; }
        * { box-sizing:border-box; }
        body { display:grid; min-height:100dvh; margin:0; place-items:center; padding:24px; background:var(--paper); color:var(--ink); font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif; letter-spacing:0; }
        main { display:grid; width:min(100%,560px); gap:24px; padding:32px; border:1px solid var(--line); border-radius:8px; background:var(--surface); box-shadow:0 18px 55px rgb(23 27 24 / 8%); }
        .brand { color:var(--brand); font-size:14px; font-weight:800; overflow-wrap:anywhere; }
        .status { display:grid; width:46px; height:46px; place-items:center; border-radius:8px; background:var(--lime); color:var(--ink); font-size:20px; font-weight:900; }
        .maintenance-art { width:min(100%,220px); aspect-ratio:1; margin:0 auto; object-fit:cover; }
        h1 { margin:0; font-size:30px; line-height:1.15; }
        p { margin:10px 0 0; color:var(--muted); line-height:1.65; }
        small { color:var(--muted); }
        @media (max-width:520px) { main { padding:25px 20px; } h1 { font-size:26px; } }
    </style>
</head>
<body>
<main aria-labelledby="maintenance-title">
    <div class="brand">{{ $brandName }}</div>
    <div class="status" aria-hidden="true">...</div>
    <img class="maintenance-art" src="{{ asset('assets/illustrations/maintenance.webp') }}" alt="" width="640" height="640">
    <div role="status" aria-live="polite">
        <h1 id="maintenance-title">Menu sedang maintenance</h1>
        <p>Kami sedang menyiapkan kembali tampilan menu. Silakan coba beberapa saat lagi.</p>
    </div>
    <small>Tidak ada pesanan atau data pelanggan yang diproses di halaman ini.</small>
</main>
</body>
</html>
