# COYABAG Workflow & CI/CD

## 1) Alur kerja tim (rekomendasi)

### Sprint ritme

- Sprint 1 minggu.
- Kapasitas dibagi:
  - 40% feature
  - 30% QA + fix
  - 20% docs
  - 10% release ops
- Review mingguan dengan screenshot build + checklist.

### Alur tiket

1. Planning: definisi outcome + acceptance criteria.
2. Dev: implement.
3. QA internal: lint + smoke test.
4. UX check: snapshot layar utama (desktop + mobile).
5. Merge: PR + checklist + reviewer.
6. Deploy staging: validasi oleh owner.
7. Deploy production: jika lolos sign-off.

## 2) Branching model

- `main` = production-ready
- `codex/<issue>-<slug>` = branch kerja
- Wajib:
  - deskriptif
  - satu ticket per PR
  - ukuran PR kecil

## 3) CI/CD minimum

### Frontend CI

- `npm install`
- `npm run build` (Vite)
- lint (jika diaktifkan)
- unit/e2e smoke test

### Backend CI

- `composer install --no-progress`
- `php artisan config:cache`
- `php artisan migrate --force --env=testing`
- `php artisan test`
- static analysis (opsional)

### Integrasi

- Jika monorepo, job dipisah:
  - `frontend` job
  - `laravel` job
- `preview` artifact untuk verifikasi visual.

## 4) Workflow lingkungan

- **Local:** `127.0.0.1:5173` untuk frontend, `127.0.0.1:8000` untuk backend.
- **Staging:** env terpisah dengan data dummy.
- **Production:** backup & rollback plan aktif.

### Environment variables wajib

- `APP_ENV`, `APP_KEY`
- `DB_*`
- `FILESYSTEM_DISK`
- `WHATSAPP_NUMBER`
- `MIDTRANS_SERVER_KEY` / `MIDTRANS_CLIENT_KEY` (jika dipakai)
- `FRONTEND_URL`

## 5) QA checklist sebelum release

#### Fungsional

- Halaman utama render normal
- Produk load + detail halaman
- Cart + checkout draft
- Checkout via WhatsApp
- Bag Finder memberi rekomendasi
- Our Product, About, Testimonials, Lookbook, FAQ

#### UX

- No overlap teks
- Mobile scroll antar section
- Tombol utama touch target cukup
- CTA konsisten
- Loading state + skeleton terlihat

#### Non-fungsional

- Loading time halaman utama < target internal
- 0 console error kritikal
- Form error message user-friendly
- SEO dasar (meta title/desc/fallback image)

## 6) Release checklist

- Database migration backup & rollback
- Static assets deploy
- Cache clear
- Queue worker aktif
- Notification test
- Link owner dashboard diverifikasi

## 7) Incident handling

- Semua issue produksi dicatat:
  - waktu
  - root cause
  - dampak
  - aksi
  - pencegahan
- Prioritas:
  - P0: order gagal, checkout error
  - P1: halaman utama rusak, keranjang tidak bisa tambah
  - P2: typo konten / typo promo

