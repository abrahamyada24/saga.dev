# SagaMenu Dashboard Wizard V1 Knowledge Base

## Purpose

Dashboard wizard membantu operator membuat dan mengedit e-menu preview-only. SagaMenu tidak membuat order, cart, checkout, atau WhatsApp order.

## Menu Workflow

1. Informasi dasar: catalog, kategori, nama, harga, deskripsi, ketersediaan, dan featured.
2. Foto & media: upload JPG/PNG/WebP maksimum 5 MB atau pilih Media Library; gallery prototype maksimum empat gambar.
3. Pilihan & detail: variant, add-on, badge, allergen, dietary, ingredient, promo, dan surface visibility.
4. Review: validasi draft dan information-only external link.

Save hanya menyimpan draft. Customer baru melihat perubahan setelah catalog dipublish.

## Create and Edit Experience

### Tambah Menu

- `Tambah menu` memakai wizard linear empat langkah.
- Hanya satu langkah ditampilkan pada satu waktu.
- Informasi wajib divalidasi sebelum user meninggalkan langkah pertama.
- Langkah Review menjelaskan kelengkapan menu dan perbedaan draft dengan versi publik.
- `Buat menu sebagai draft` menyimpan lalu kembali ke daftar menu.
- `Buat & tambah lagi` menyimpan menu saat ini lalu membuka wizard baru yang kosong.
- `Simpan & lanjut nanti` hanya tersedia pada create wizard.

### Edit Menu

- `Edit menu` memakai focused single-page editor, bukan wizard.
- Informasi, Foto, serta Pilihan & detail ditampilkan dalam satu workspace.
- Navigator bagian membawa user langsung ke bagian yang ingin diperbarui.
- Stepper dan halaman Review tidak ditampilkan saat edit.
- Hanya ada satu aksi utama: `Simpan perubahan`.
- Validasi gagal membawa fokus kembali ke field bermasalah pada bagian Informasi.
- Setiap pembukaan editor dimulai dari posisi scroll paling atas.
- Footer menjelaskan bahwa versi publik tetap aman sampai draft diterbitkan.

## Draft Recovery

- `Simpan & lanjut nanti` menyimpan isian create prototype ke browser lalu menutup wizard.
- Draft menu baru dan draft edit disimpan terpisah.
- Draft edit dipetakan ke ID menu agar perubahan satu menu tidak memengaruhi menu lain.
- Ketika draft ditemukan, editor menampilkan `Draft dipulihkan dari browser` atau `Perubahan edit dipulihkan dari browser`.
- Menutup editor ketika autosave belum selesai meminta konfirmasi sebelum perubahan disimpan dan editor ditutup.
- `Buat menu sebagai draft` dipakai untuk menu baru.
- `Simpan perubahan` dipakai untuk memperbarui menu yang sudah ada.
- Menyimpan draft tidak menerbitkan perubahan ke customer.

## Dashboard Action Hierarchy

- Topbar mempunyai satu launcher `Preview menu`.
- Launcher tersebut menjadi entry global untuk `Bio Menu` dan `Store Display`.
- Topbar mempunyai satu CTA publikasi: `Tinjau & terbitkan` ketika ada draft dan `Publikasi` ketika versi publik sudah terbaru.
- Header halaman Ringkasan dan Menu tidak mengulang CTA preview atau publikasi.
- Halaman `Preview & Terbitkan` tetap mempunyai CTA final `Terbitkan perubahan` setelah pemeriksaan selesai.
- Preview yang berada di dalam Ringkasan, Tampilan, dan halaman publikasi adalah kontrol kontekstual untuk surface yang sedang ditinjau, bukan entry global tambahan.

## Menu Row Actions

- Perubahan ketersediaan dan `Edit` tetap tersedia sebagai aksi satu klik.
- `Duplikat menu` dan `Hapus menu` berada di dalam `Aksi lainnya`.
- Aksi hapus harus tetap diberi treatment destructive dan konfirmasi.
- Hanya satu overflow menu yang boleh terbuka pada satu waktu.
- Klik di luar atau Escape menutup overflow dan mengembalikan fokus.
- Dua baris terakhir membuka overflow ke atas agar tidak terpotong.
- Semua icon-only actions wajib memiliki accessible name pada desktop dan mobile.

## Media Rules

- URL foto bukan workflow yang didukung.
- Upload baru divalidasi sebagai JPG, PNG, atau WebP.
- Prototype mengompresi upload menjadi WebP dan hanya menerima data image JPEG/PNG/WebP atau URL HTTP/HTTPS sebagai sumber preview.
- Foto utama mempunyai alt text serta focal point horizontal dan vertikal.
- Gallery prototype menerima maksimum empat foto, dengan replace/remove tanpa mengulang seluruh editor.
- Media Library menampilkan dimensi, jumlah pemakaian, status alt text, pencarian, filter, dan safe remove.
- Asset yang masih dipakai menu tidak dapat dihapus dari Media Library.
- Kegagalan proses foto menampilkan aksi retry dan tidak boleh mengganti foto lama dengan fallback kosong.
- Pesan `Foto selesai diproses dan tersimpan di draft` hanya boleh muncul setelah hasil kompresi benar-benar tersimpan.
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
- Menu dapat mempunyai variant group wajib atau opsional dengan price delta.
- Variant group dan add-on yang terhubung dapat diurutkan ulang.
- Detail publik dapat menampilkan bahan, alergen, dietary, caffeine, level pedas, dan catatan penyajian.
- Field advanced yang kosong tidak ditampilkan pada detail publik.

## Supporting Editor Rules

- Category, add-on, dan media metadata menggunakan side sheet, bukan generic database modal.
- Side sheet selalu menampilkan dampak penggunaan sebelum save atau delete.
- Category dan add-on yang masih dipakai tidak dapat terhapus diam-diam.
- Editor harus tetap dapat digunakan pada viewport 390 px tanpa horizontal overflow.

## Catalog Setup and Publish

- Setup terpandu mempunyai empat bagian: informasi bisnis, surface aktif, warna dasar, serta starter category.
- Setup hanya mengubah draft dan tidak menerbitkan menu.
- Publish mewajibkan konfirmasi minimal satu surface: Bio Menu atau Store Display.
- Publish dengan custom font mewajibkan konfirmasi lisensi font.
- Safe failure mempertahankan versi live sebelumnya dan menyediakan retry.
- Maintenance tetap merupakan presentasi publik generik; status akun atau billing tidak boleh dibocorkan.

## Appearance Rules

- Default font adalah Plus Jakarta Sans.
- Klien boleh menggunakan custom WOFF/WOFF2 melalui Brand Kit.
- Custom font memerlukan konfirmasi lisensi sebelum Brand Kit dapat disimpan atau diterbitkan.
- Invalid custom font harus kembali ke fallback.
- Bio Menu: Editorial List, Photo Grid, atau Compact Cards.
- Store Display: Editorial Grid, Menu Board, atau Gallery Wall.
- Preset Bio dan Store disimpan secara independen.
- Preset lama atau tidak dikenal dimigrasikan fail closed ke Editorial List dan Editorial Grid.
- Brand colors tetap shared antar-surface.
- Brand Kit mencakup logo, primary, accent, paper, ink, heading font, body font, radius, dan image treatment.
- Kontras warna teks terhadap paper diperiksa terhadap WCAG AA.
- Simpan Brand Kit tidak menerbitkan perubahan secara otomatis.

## Support Checklist

- Pastikan user berada pada organization yang benar.
- Pastikan catalog dan kategori tersedia.
- Pastikan file di bawah 5 MB dan bertipe JPG/PNG/WebP.
- Jika preview menampilkan foto fallback setelah upload, jangan lanjut publish; ulangi upload dan eskalasi sebagai kegagalan media.
- Jika draft edit tidak dipulihkan dengan nilai terakhir, jangan menganggap toast autosave sebagai bukti bahwa perubahan aman.
- Jelaskan bahwa save tidak sama dengan publish.
- Gunakan Preview sebelum menerbitkan.
- Gunakan istilah `terbitkan` pada UI Indonesia; `publish` hanya boleh muncul sebagai istilah teknis internal.
- Jika publish gagal, snapshot live sebelumnya harus tetap tersedia.

## Release Boundary

Prototype Vercel menggunakan demo `localStorage`. Upload, media processing, publish, dan migration di prototype adalah simulasi browser, bukan bukti object storage atau database production. Laravel lokal sudah diuji, tetapi belum staging-ready atau production-ready. Saga Platform feature flag harus tetap off sampai central sandbox rehearsal dan release gates lulus.
