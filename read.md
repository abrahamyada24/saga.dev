# COYABAG / COYABEG Website (Prototype Readme)

Repositori ini berisi prototype website e-commerce tas (COYABAG / COYABEG), termasuk:

- Frontend React + Vite (folder `coyabag-prototype/coyabag`)
- Dokumentasi riset, desain, dan roadmap fitur (folder `docs/apps/women-bag-ecommerce`)
- Foto aset produktif (folder `coyabag-photos`)
- Dokumentasi tambahan lintas produk (`docs/`)

## Tujuan proyek

- Menyediakan tampilan e-commerce yang premium-streetwear dengan fokus:
  - layout dan visual yang mirip referensi klien
  - performa dan UX ritel yang aman dipakai produk nyata
  - panel admin sederhana (rencana) untuk owner update produk/harga/promo/konten
  - alur checkout yang tetap sederhana dan clear

## Struktur utama

- `coyabag-prototype/coyabag/`
  - `src/main.jsx` : komponen inti, halaman, logic UI, data dummy
  - `src/styles.css` : style global + sistem visual
  - `public/` : aset publik (foto, font)
  - `dist/` : hasil build Vite siap deploy
- `docs/apps/women-bag-ecommerce/`
  - `planner.md` : konteks bisnis/arah eksekusi
  - `frontend.md` : spesifikasi UI/UX dan flow
  - `laravel-backend-plan.md` : rencana backend Laravel + Inertia
  - `database-schema-plan.md` : rancangan tabel awal
  - `owner-dashboard-plan.md` : desain flow dashboard untuk pemilik
  - `motion-interaction-spec.md` : animasi/interaksi utama
  - `layout-research-v2-streetwear-pages.md` : referensi layout
- `docs/apps/women-bag-ecommerce/screening-assessment.md`: audit readiness keseluruhan (frontend/back-end/workflow/security/TDD)
- `docs/apps/women-bag-ecommerce/system-architecture.md`: desain arsitektur frontend-backend
- `docs/apps/women-bag-ecommerce/security-hardening.md`: rencana security
- `docs/apps/women-bag-ecommerce/workflow-cicd.md`: alur kerja dan release pipeline
- `docs/apps/women-bag-ecommerce/tdd-roadmap.md`: test strategy dan acceptance

## Cara menjalankan lokal

1. Masuk folder:
   - `cd coyabag-prototype/coyabag`
2. Install dependensi:
   - `npm install`
3. Jalankan dev server:
   - `npm run dev -- --host 127.0.0.1 --port 5173` (atau port lain)
4. Build production:
   - `npm run build`
5. Preview build:
   - `npm run preview -- --host 127.0.0.1 --port 4173`

## Arsitektur saat ini (status saat ini: prototype)

- UI sudah berbasis single-page dengan data produk berbasis data lokal (dummy/mock).
- State utama (cart/wishlist) saat ini masih **client-side** (local storage).
- Checkout sudah memiliki:
  - halaman detail pesanan
  - pemilihan metode bayar (transfer dummy/manual + QR/nomor rekening placeholder)
  - konfirmasi pembayaran via WhatsApp (template message)
- Belum ada:
  - backend autentikasi user/owner
  - validasi transaksi server-side untuk keamanan harga, stok, dan order
  - manajemen aset produk yang persistent (CMS)

## Peta rencana (ringkas)

1. Frontend production polish
   - aksesibilitas, responsif, consistency button/spacing/type scale
   - motion ringan sesuai guideline (soft + stabil)
   - optimasi loading + image
2. Backend MVP
   - Laravel + Inertia (atau API stack yang disepakati)
   - database produk, varian warna, stok, transaksi, testimonial, promo
3. Checkout & payment workflow
   - validasi harga/stock server-side
   - order status state machine (`pending`, `paid`, `processing`, `shipped`, `completed`)
4. Dashboard owner
   - CRUD produk/kategori/media
   - manajemen harga, promo, banner, dan order
   - logging aktivitas dasar
5. Deployment & observability
   - Vercel (frontend) + server stack Laravel
   - basic logging, error tracking, environment config

## Standar operasional yang disarankan

- Gunakan Bahasa Indonesia untuk semua teks konten produk, detail, FAQ, dan halaman legal.
- Headline tetap pakai font serif (Instrument Serif), body/detail pakai Helvetica (sesuai keputusan terakhir).
- Semua perubahan desain harus melalui:
  - `docs/apps/women-bag-ecommerce/*`
  - pull request kecil dan terukur
  - screenshot hasil before/after

## Catatan deploy

- Untuk production, jangan langsung deploy asset mock sebagai final.
- Backup konten brand (foto, video, harga, SKU, stok, deskripsi) ke sumber konten terstruktur (CMS/DB) dulu.
- Setelah backend siap, aktifkan kontrol akses admin + rate limit endpoint sensitive.

## Quick links (untuk eksekusi)

- Dokumentasi utama: `docs/apps/women-bag-ecommerce/locked-decisions.md`
- Rencana backend: `docs/apps/women-bag-ecommerce/laravel-backend-plan.md`
- Rencana dashboard owner: `docs/apps/women-bag-ecommerce/owner-dashboard-plan.md`
- Audit menyeluruh: `docs/apps/women-bag-ecommerce/screening-assessment.md`
- Checklist keamanan: `docs/apps/women-bag-ecommerce/security-hardening.md`
- Workflow dan CI/CD: `docs/apps/women-bag-ecommerce/workflow-cicd.md`
- Roadmap TDD: `docs/apps/women-bag-ecommerce/tdd-roadmap.md`
