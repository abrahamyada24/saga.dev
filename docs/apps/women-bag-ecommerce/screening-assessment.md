# Screening Assessment COYABAG Website  
Tanggal referensi: 24 Juni 2026  

Dokumen ini untuk men-screenshot seluruh kesiapan proyek COYABEG/COYABAG (website customer + dashboard roadmap) dari sisi **frontend, backend, workflow, website, security, dan TDD**.

## Ringkasan Prioritas

- **P0 (Harus segera):** Penyatuan keputusan path proyek, checkout berbasis order data (server-side), dokumentasi status, dan baseline security minimal.
- **P1:** Integrasi backend Laravel/Inertia, produk real-time stock & variant, dan dashboard owner sederhana.
- **P2:** TDD terstruktur, CI/CD, dan hardening operasional.
- **P3:** Optimasi UX/animation, observability, dan performance.

## 1) Status Frontend (Saat ini vs target)

### Kondisi saat ini

- `coyabag-prototype/coyabag` berisi React + Vite yang sudah meng-cover: Home, Shop, Product Detail, Cart, Bag Finder, About, Our Product, Testimonials, Lookbook, FAQ/Policy.
- Data produk masih lokal/dummy.
- Cart/wishlist masih client-side.
- Checkout sementara berbasis pesan WhatsApp + tautan Shopee, dengan flow pembayaran manual/transfer dummy di UI.

### Gap utama

1. Data tidak berasal dari backend; tidak ada konsistensi antar sesi.
2. Validasi harga/stok masih client-side.
3. Checkout perlu dipindah dari “chat-only” ke order draft server-side supaya status bisa ditrack.
4. Responsif sudah ada tetapi perlu audit per halaman + device-level.

### Action untuk P0–P2

- **P0:** Buat layer API service (`/api/*`) di frontend, lalu fallback ke mock jika API belum ready.
- **P0:** Standardize route constants, agar tidak ada beda path saat deploy.
- **P1:** Ganti product cart source ke backend API (tanpa mengurangi UX existing).
- **P2:** Tambahkan test visual/manual checklist untuk 5 breakpoint utama dan 3 skenario utama checkout.

## 2) Status Backend

### Kondisi saat ini

- Belum ada backend production yang aktif untuk COYABAG di repo ini (berkas referensi ada di `docs/apps/women-bag-ecommerce/laravel-backend-plan.md`).
- Decision sudah ada untuk Laravel + Filament + Inertia.

### Gap utama

1. Belum ada service order, promo, media, dan CMS data terstruktur yang live.
2. Belum ada integrasi autentikasi admin yang final.
3. Belum ada webhook/payment pipeline siap pakai.

### Action untuk P0–P2

- **P0:** Finalize backend contract minimum:
  - Products (with variants & stock)
  - Landing sections
  - Testimonials
  - About/Lookbook
  - Orders (whatsapp draft + manual transfer placeholder)
- **P1:** Implement user/role + policy + activity log dasar.
- **P1:** Buat media endpoint + upload policy (type/size/role).
- **P2:** Integrasi Midtrans (atau gateway lokal) dengan webhook.

## 3) Status Website/Produk

### Kategori layar penting

- Home + gallery carousel
- Shop/Product list
- Product detail (galleries + related products)
- Cart/Checkout
- About/Our Product/Testimonials/Lookbook

### Gap utama

1. Konsistensi desain antar halaman belum 100% (beberapa kontrol CTA dan spacing masih perlu standarisasi).
2. Beberapa elemen mobile perlu alignment/scroll behavior tuning.
3. Konten halaman review/video/informasi belum diisi penuh data asli.

### Action untuk P0–P2

- **P0:** Freeze interaction style guide (spacing, button size, font usage).
- **P1:** Audit semua halaman per breakpoint dan verifikasi no-overlap.
- **P2:** Optimasi image format/weight, placeholder skeleton, dan lazy-load.

## 4) Security Screening

### Posisi sekarang

- Prototype-level; belum memuat kontrol anti-abuse, audit trail, dan verifikasi transaksi di server.
- Upload media belum masuk ke pipeline backend.

### Action

- **P0:** Terapkan security basics:
  - Server-side validation untuk cart/order total
  - Rate limit endpoint publik
  - CSP, CORS, secure headers (Laravel middleware)
  - Webhook signature verification untuk payment
- **P1:** Add audit log admin action + CSRF + session hardening.
- **P2:** WAF-like monitoring dan alert sederhana.

## 5) Workflow Screening

### Kondisi

- Banyak keputusan desain sudah terdokumentasi di `docs/apps/women-bag-ecommerce/*`.
- Belum ada satu “operating cadence” tunggal untuk dev, QA, release.

### Action

- **P0:** Set satu source checklist:
  - branch naming
  - PR template
  - screenshot-before/after
  - acceptance criteria per tiket
- **P1:** Buat sprint board (P0/P1/P2 per modul).
- **P2:** CI otomatis build/test lint/security scanning.

## 6) TDD / Testing Status

### Saat ini

- Belum ada test suite yang mengikat alur COYABAG secara sistematis.

### Action

- **P0:** Buat smoke test script:
  - halaman utama load
  - product card click -> detail
  - cart add/remove/update
  - checkout form -> WA draft
- **P1:** Tambah service layer test:
  - promo calc
  - product filter/recommendation
  - order payload validation
- **P2:** Playwright e2e untuk 3 alur checkout + 3 alur content admin.

## 7) Target Rilis Bertahap

- **Sprint 1 (2–3 hari):** Pemetaan dokumentasi final + API contract + mock service layer.
- **Sprint 2 (4–7 hari):** Laravel backend baseline + produk + promo + media.
- **Sprint 3 (5–7 hari):** Checkout order draft server-side + admin dashboard dasar.
- **Sprint 4 (3–5 hari):** Hardening + automation + acceptance.

## 8) Bukti deliverable yang harus ada di PR

- Setiap tiket menutup minimal:
  - daftar lintasan fungsional
  - screenshot perubahan
  - test result (manual atau otomatis)
  - dokumentasi rollback singkat

## 9) Link eksekusi selanjutnya

- `docs/apps/women-bag-ecommerce/system-architecture.md`
- `docs/apps/women-bag-ecommerce/security-hardening.md`
- `docs/apps/women-bag-ecommerce/workflow-cicd.md`
- `docs/apps/women-bag-ecommerce/tdd-roadmap.md`
