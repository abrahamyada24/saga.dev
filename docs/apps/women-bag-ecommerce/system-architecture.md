# COYABAG System Architecture (Frontend-Backend)

Dokumen ini jadi acuan arsitektur agar implementasi tetap konsisten saat pindah dari prototype ke production.

## 1) Arsitektur satu sisi

### Komponen

- **Public frontend:** React + Vite (atau Inertia React), halaman customer.
- **Admin dashboard:** Laravel + Filament (owner-friendly CRUD).
- **API layer:** Laravel routes/controllers/services.
- **Database:** PostgreSQL/MySQL.
- **Object storage:** untuk foto/video produk, lookbook, testimonial, gallery.
- **Worker queue:** konversi gambar/video thumbnail, notifikasi, sinkron status payment.

### Arsitektur target

```
Browser (Pelanggan)
  -> Inertia/React Frontend
    -> Laravel API
      -> PostgreSQL DB
      -> Storage (foto/video)
      -> External service (WhatsApp deep-link, Midtrans, logging)
```

## 2) Batasan (Contract) antara Frontend dan Backend

### Resource utama

- `/api/home`: section hero, home blocks, featured products
- `/api/products`: list paginasi + filter
- `/api/products/{slug}`: detail + variant + gallery + specs
- `/api/product-series`: listing seri untuk halaman Our Product
- `/api/testimonials`: review feed
- `/api/lookbook`: materi visual/editorial
- `/api/about-sections`: konten brand
- `/api/settings/public`: WA, Shopee link, sosial media
- `/api/orders/draft`: simpan snapshot order sebelum bayar
- `/api/promo/validate`: validasi kode promo

### Data checkout

Order payload minimum:

```json
{
  "customer": { "name": "", "phone": "", "email": "", "address": "" },
  "items": [{ "product_id": "", "variant_id": "", "qty": 1, "price": 0 }],
  "shipping": { "method": "", "cost": 0, "estimate_days": 1 },
  "promo_code": "optional",
  "notes": "optional"
}
```

Frontend tidak melakukan perhitungan harga final final sebagai otoritas final.

## 3) Data source strategy

- Product/variant dan konten awal dari dummy boleh dipakai untuk demo.
- Di production, data harus berasal dari backend only.
- Untuk fase transisi, gunakan adapter:
  - `getProducts()` -> API jika tersedia, fallback ke local seed.

## 4) Dashboard owner (MVP)

1. Ringkasan cepat
2. Produk + varian (stok, warna, harga, status)
3. Media library (upload reorder)
4. Landing section preset
5. Testimonials & Lookbook
6. Promo & settings
7. Pesanan (draft + WhatsApp/paid status)

## 5) Teknologi yang dipilih dan mengapa

### Laravel (wajib)

- CRUD cepat via Filament
- ACL role-based lebih terstruktur
- Queue, event, webhook robust
- Bagus untuk pemilik non-teknis via admin panel

### Inertia React

- Menjaga visual dan interaksi React
- Mengurangi ketergantungan API split deployment
- Cocok untuk integrasi cepat setelah prototype disetujui

## 6) Deployment topologi

- **Frontend + Admin + API:** satu aplikasi Laravel (disarankan production lama) agar admin dan data terpusat.
- **CDN:** menyajikan assets statis (JS/CSS/media).
- **Database backup:** backup harian + retention terukur.

## 7) Dependensi kunci

- Laravel 11/12
- Inertia + Vue/React stack
- Spatie Media Library (media)
- Spatie Permission (role)
- Midtrans SDK (V2 payment)
- Playwright/Cypress untuk E2E

## 8) Acceptance arsitektur

Arsitektur dianggap valid bila:

- Semua halaman customer membaca dari endpoint terpusat (tanpa hardcode produk permanen).
- Admin dapat publish/unpublish konten.
- Checkout menghasilkan order + snapshot.
- Harga/stok tidak bisa di-spoof dari client.
- Deploy production tidak memerlukan runtime manual yang rentan.
