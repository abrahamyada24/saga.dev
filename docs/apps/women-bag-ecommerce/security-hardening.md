# COYABAG Security Hardening Plan

## 1) Risiko utama saat ini

- Checkout dan total masih bisa berubah di client jika tidak divalidasi server.
- Konten admin belum terkunci dalam alur terpusat.
- Webhook/payment tidak tervalidasi signature.
- Upload media belum lewat filter MIME/size.
- Sesi admin masih belum dikelola untuk produksi (prototype).

## 2) Target model keamanan

**P0:** Keamanan transaksi dan hak akses
**P1:** Keamanan data dan audit
**P2:** Monitoring dan resilience

## 3) Keamanan aplikasi (P0)

### Autentikasi & otorisasi

- Laravel auth untuk admin (`owner/admin/editor/staff`).
- Policy + Gate untuk tiap aksi sensitif:
  - edit produk
  - publish section
  - approve order
  - edit pricing/promo
- CSRF aktif untuk semua route state-changing.
- Password policy dan throttling login admin.

### Checkout & order

- Semua perhitungan `subtotal`, `disc`, `shipping`, `total` divalidasi ulang di backend.
- Promo diproses di backend, bukan hanya frontend.
- Gunakan idempotency key untuk create order agar tidak duplikat.
- Simpan order snapshot + user/customer info agar auditable.

### Input dan validasi

- Schema validator strict untuk semua endpoint:
  - slug
  - qty maksimal/minimal
  - nominal uang integer positif
  - phone/e-mail sanitasi

## 4) Keamanan media (P1)

- Upload allowlist MIME:
  - image/jpeg, image/png, image/webp
  - video/mp4 (hanya untuk video resmi)
- Max size file:
  - image 8MB
  - video 40MB (default, bisa diubah)
- Rename file random, strip metadata sensitif.
- Storage ACL: read public untuk media yang dipublish, private untuk draft.
- Virus/malware scan optional di fase awal.

## 5) Keamanan webhook & payment (P0/P1)

- Setiap webhook Midtrans diverifikasi signature.
- Seluruh event payment masuk antrian, bukan langsung update state.
- Transaction status tidak boleh di-set dari frontend redirect saja.
- Webhook handler harus idempotent.

## 6) Security headers

- Set header:
  - `Content-Security-Policy`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security` (production HTTPS)
- Cookie flags:
  - `HttpOnly`
  - `Secure`
  - `SameSite=Strict/Lax` sesuai use-case

## 7) Audit dan monitoring

- `activity_logs` untuk:
  - produk diubah
  - promo dibuat/dihapus
  - media upload
  - status order berubah
- Log untuk error, login gagal, webhook invalid.
- Alert sederhana untuk:
  - login spam admin
  - webhook gagal > 3x
  - stok menjadi negatif

## 8) Data pribadi (PII)

- Simpan minimal data customer untuk order.
- Jangan menampilkan phone/email di endpoint publik.
- Hapus data keranjang anonim secara berkala.
- Enkripsi field sensitif jika disimpan lebih dari kebutuhan.

## 9) Deployment security

- Semua env secret hanya dari `.env`.
- No hardcoded token di source.
- RLS (jika memakai Supabase) atau policy DB untuk row-level sensitif.
- Backup DB terenkripsi + test restore bulanan.

## 10) Kesiapan security sebelum go-live

- [ ] Auth & role berfungsi
- [ ] Server-side order validation aktif
- [ ] Promo dan webhook tervalidasi
- [ ] Upload media tervalidasi MIME/size
- [ ] Headers keamanan aktif
- [ ] Audit trail berjalan
- [ ] Test exploit sederhana:
  - unauthorized POST order
  - input qty negatif
  - promo expired/disallowed

