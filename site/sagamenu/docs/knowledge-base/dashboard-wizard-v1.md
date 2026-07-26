# SagaMenu Dashboard Wizard V1 Knowledge Base

## Purpose

Dashboard wizard membantu operator membuat dan mengedit e-menu preview-only. SagaMenu tidak membuat order, cart, checkout, atau WhatsApp order.

## Menu Workflow

1. Informasi dasar: catalog, kategori, nama, harga, deskripsi, ketersediaan, dan featured.
2. Foto & media: upload JPG/PNG/WebP maksimum 5 MB atau pilih Media Library; gallery maksimum tujuh gambar.
3. Pilihan & detail: variant, add-on, badge, allergen, dietary, ingredient, promo, dan surface visibility.
4. Review: validasi draft dan information-only external link.

Save hanya menyimpan draft. Customer baru melihat perubahan setelah catalog dipublish.

## Media Rules

- URL foto bukan workflow yang didukung.
- Upload baru divalidasi sebagai JPG, PNG, atau WebP.
- Asset harus berasal dari organization yang sama dengan menu.
- Production wajib mengaktifkan malware scanner required mode.
- Primary image dapat diganti; gallery tidak boleh menduplikasi primary image.

## Category Rules

- Operator mengatur nama, deskripsi, dan visibility.
- Slug dibuat otomatis.
- Urutan diubah dari daftar.
- Kategori yang masih dipakai menu tidak dapat diarsipkan sampai menu dipindahkan.

## Add-on Rules

- Add-on bersifat informasional.
- Selection type: single atau multiple.
- Minimum dan maksimum pilihan dapat dicatat.
- Add-on inactive tidak masuk ke public snapshot.
- Harga adalah tambahan informasi, bukan transaksi.

## Appearance Rules

- Default font adalah Plus Jakarta Sans.
- Klien boleh menggunakan custom WOFF/WOFF2 melalui Media Library dan Custom Fonts.
- Invalid custom font harus kembali ke fallback.
- Bio Menu: editorial list atau photo grid.
- Store Display: editorial grid atau photo grid.
- Brand colors tetap shared antar-surface.

## Support Checklist

- Pastikan user berada pada organization yang benar.
- Pastikan catalog dan kategori tersedia.
- Pastikan file di bawah 5 MB dan bertipe JPG/PNG/WebP.
- Jelaskan bahwa save tidak sama dengan publish.
- Gunakan Preview sebelum Publish.
- Jika publish gagal, snapshot live sebelumnya harus tetap tersedia.

## Release Boundary

Prototype Vercel menggunakan demo `localStorage`. Laravel lokal sudah diuji, tetapi belum staging-ready atau production-ready. Saga Platform feature flag harus tetap off sampai central sandbox rehearsal dan release gates lulus.
