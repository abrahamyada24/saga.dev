# Public Media Recovery

## Tujuan

Bio Menu dan Store Display harus tetap dapat dipahami saat gambar atau video dari storage/CDN gagal dimuat. Kegagalan media tidak boleh menghilangkan nama, harga, deskripsi, varian, add-on, atau informasi ketersediaan.

## Perilaku

| Kondisi | Perilaku customer |
| --- | --- |
| Gambar berhasil | Gambar tampil normal dan fallback tetap tersembunyi. |
| Gambar gagal | Gambar disembunyikan, fallback huruf tampil, dan fallback mendapat label aksesibel. |
| Video belum dimuat | Player memakai `preload="none"` agar halaman publik tetap ringan. |
| Video gagal | Player disembunyikan dan panel "Video belum dapat diputar" tampil. |
| Customer memilih coba lagi | Panel berubah menjadi "Memuat ulang video" dan browser memuat ulang sumber. |
| Video pulih | Panel status kembali tersembunyi dan player dapat digunakan. |

## Kontrak Implementasi

- Listener kegagalan dipasang pada elemen `video` dan setiap elemen `source`.
- Panel status menggunakan `role="status"` dan `aria-live="polite"`.
- Tombol retry memiliki tinggi minimum 40 px dan focus ring yang terlihat.
- Fallback gambar memperoleh `role="img"` serta `aria-label` hanya saat gambar gagal.
- Flow berlaku pada route `/m/{brand}/{catalog}` dan `/s/{brand}/{catalog}`.
- Tidak ada autoplay, eager video loading, atau pengiriman konten katalog ke Saga Platform.

## Pemeriksaan Operator

1. Buka detail menu yang memiliki video.
2. Putuskan URL media pada environment uji atau gunakan object yang tidak tersedia.
3. Pastikan panel gagal tampil tanpa menutupi detail menu.
4. Pilih `Coba lagi` dan pastikan state loading tampil.
5. Pulihkan URL media lalu pastikan player kembali tanpa reload halaman penuh.
6. Ulangi pada viewport mobile dan tablet.

## Rollback

Revert commit flow media recovery. Tidak ada migration, perubahan schema, queue, scheduler, atau konfigurasi provider yang perlu dipulihkan.
