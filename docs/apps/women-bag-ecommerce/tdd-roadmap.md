# COYABAG TDD Roadmap

## Prinsip

Setelah prototype, testing perlu dipisahkan menjadi:

1. Unit: utility/API logic (fungsi murni).
2. Integration: endpoint dan kontrak data.
3. UI: komponen dan alur checkout.
4. E2E: journey penuh dari home sampai checkout.

## 1) P0 – Test foundation (7–14 hari)

### Frontend

- Render smoke:
  - home load
  - `GET /api/products`
  - product card click
  - cart add/remove/update
  - checkout form wajib
- Utility test:
  - price formatter
  - slug builder
  - payload sanitizer

### Backend

- Endpoint test:
  - list products
  - product detail
  - promo validation
  - create order draft
- Validation test:
  - qty negatif
  - promo expired
  - produk tidak aktif
- Auth test:
  - role owner/admin/editor akses endpoint admin

### Output

- Semua test P0 wajib hijau sebelum mulai ubah fitur besar.

## 2) P1 – Behavior tests (2–3 minggu)

- Bag Finder result stabil untuk input kombinasi.
- Cart calculation mengikuti source of truth backend.
- Checkout draft menghasilkan data lengkap + status.
- Admin CRUD:
  - product create/update
  - variant + stock
  - upload media + relasi
  - section content draft/publish

## 3) P2 – UX/visual + regression (3–4 minggu)

- Playwright:
  - Home desktop
  - Home mobile
  - Product detail mobile sticky CTA
  - Gallery slider
  - Checkout form + thank-you state
- Cross-browser:
  - Chromium + Firefox dasar
- Snapshot/visual:
  - hero
  - product grid
  - checkout CTA

## 4) Struktur test yang disarankan

### Frontend folder

- `tests/unit`
- `tests/components`
- `tests/e2e`

### Backend folder

- `tests/Feature`
- `tests/Unit`

## 5) Data test

- Factory dummy untuk:
  - products
  - product variants
  - promo
  - order + order items
  - media references
- Gunakan seed khusus test, jangan bercampur produksi.

## 6) Acceptance per lapisan

- **Unit**: 80% helper function critical ter-cover.
- **Integration**: 100% endpoint kritis tested.
- **E2E**: 6–8 skenario utama passing.
- **Security tests**: setidaknya 10 skenario invalid input.

## 7) Kualitas dan regresi

- setiap PR harus menambah test jika mengubah business rule.
- refactor hanya jika test tetap hijau.
- test flakiness log dicatat di `docs/` agar bisa di-improve.

## 8) Tooling (awal)

- Frontend: Vitest/Jest + Playwright
- Backend: PHPUnit + Laravel testing
- Optional lint: ESLint/Stylelint untuk frontend, PHPStan/PHP-CS-Fixer untuk backend

## 9) Catatan waktu

- 1 minggu pertama fokus stabilitas P0.
- 2–3 minggu berikutnya ke integrasi P1.
- P2 jalankan paralel setelah alur checkout stabil.

