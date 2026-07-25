<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>@yield('title') - Saga Menu</title>
    <style>
        :root { color-scheme: light; --ink:#171b18; --muted:#657068; --line:#d9dfda; --paper:#f3f5f1; --surface:#fff; --brand:#28665b; --accent:#b64f2f; }
        * { box-sizing:border-box; }
        body { min-height:100vh; margin:0; background:var(--paper); color:var(--ink); font-family:Inter,ui-sans-serif,system-ui,sans-serif; letter-spacing:0; }
        .auth-shell { display:grid; grid-template-columns:minmax(260px,.75fr) minmax(420px,1.25fr); min-height:100vh; }
        .auth-brand { display:flex; flex-direction:column; justify-content:space-between; padding:42px; background:#183f39; color:#fff; }
        .brand-name { font-size:22px; font-weight:800; }
        .brand-copy { max-width:370px; }
        .brand-copy h1 { margin:0 0 14px; font-size:42px; line-height:1.08; }
        .brand-copy p { margin:0; color:#c9dbd6; line-height:1.65; }
        .auth-main { display:grid; place-items:center; padding:32px; }
        .auth-card { width:min(100%,520px); padding:34px; border:1px solid var(--line); border-radius:8px; background:var(--surface); box-shadow:0 18px 55px rgb(23 27 24 / 8%); }
        .eyebrow { margin:0 0 8px; color:var(--brand); font-size:12px; font-weight:800; text-transform:uppercase; }
        h2 { margin:0; font-size:28px; line-height:1.2; }
        .intro { margin:10px 0 26px; color:var(--muted); line-height:1.55; }
        .field { display:grid; gap:7px; margin-top:16px; }
        label { font-size:13px; font-weight:750; }
        input,select { width:100%; min-height:46px; padding:0 13px; border:1px solid var(--line); border-radius:6px; background:#fff; color:var(--ink); font:inherit; }
        input:focus,select:focus { outline:3px solid rgb(40 102 91 / 15%); border-color:var(--brand); }
        .two { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .check { display:flex; align-items:flex-start; gap:9px; margin-top:18px; color:var(--muted); font-size:13px; line-height:1.45; }
        .check input { width:17px; min-height:17px; margin-top:1px; }
        button { width:100%; min-height:48px; margin-top:22px; border:0; border-radius:6px; background:var(--brand); color:#fff; font:inherit; font-weight:800; cursor:pointer; }
        button:hover { background:#1f5048; }
        button:focus-visible,a:focus-visible { outline:3px solid rgb(182 79 47 / 30%); outline-offset:3px; }
        .status,.errors { margin:0 0 18px; padding:12px 14px; border-radius:6px; font-size:13px; line-height:1.5; }
        .status { background:#e7f2ed; color:#225548; }
        .errors { background:#fbece7; color:#8c311f; }
        .errors ul { margin:0; padding-left:18px; }
        .switch { margin:22px 0 0; color:var(--muted); font-size:14px; text-align:center; }
        .field-hint { margin:0; color:var(--muted); font-size:12px; line-height:1.45; }
        .status-panel { display:grid; gap:18px; }
        .status-mark { display:grid; width:44px; height:44px; place-items:center; border-radius:8px; background:#fbece7; color:var(--accent); font-size:20px; font-weight:900; }
        .status-actions { display:grid; gap:10px; }
        .status-actions a { display:grid; min-height:46px; place-items:center; border:1px solid var(--line); border-radius:6px; text-decoration:none; }
        a { color:var(--brand); font-weight:750; }
        .secondary { background:#fff; color:var(--ink); border:1px solid var(--line); }
        @media (max-width:800px) { .auth-shell { grid-template-columns:1fr; } .auth-brand { min-height:210px; padding:28px 24px; } .brand-copy h1 { font-size:30px; } .auth-main { padding:24px 16px; } .auth-card { padding:25px 20px; } }
        @media (max-width:480px) { .two { grid-template-columns:1fr; gap:0; } }
    </style>
</head>
<body>
<div class="auth-shell">
    <aside class="auth-brand" aria-label="Saga Menu">
        <div class="brand-name">Saga Menu</div>
        <div class="brand-copy">
            <h1>Menu digital yang terasa seperti brand-mu.</h1>
            <p>Kelola tampilan tablet dan link-in-bio dari satu dashboard.</p>
        </div>
        <small>Preview-only menu & catalog</small>
    </aside>
    <main class="auth-main">
        <section class="auth-card" aria-labelledby="auth-title">
            @if (session('status')) <div class="status" role="status" aria-live="polite">{{ session('status') }}</div> @endif
            @if ($errors->any())
                <div class="errors" id="form-errors" role="alert"><ul>@foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>
            @endif
            @yield('content')
        </section>
    </main>
</div>
</body>
</html>
