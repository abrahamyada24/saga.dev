# SagaMenu Dashboard Wizard Redesign Strategy

Tanggal: 26 Juli 2026

Status: implemented locally; prototype review deployed; production rollout remains gated

Fokus pertama: dashboard owner, pembuatan dan pengeditan menu, media upload, kategori, dan add-on

Fokus berikutnya: appearance editor, typography, warna, dan preset Store Display/Bio Menu

## 1. Audit Kondisi Sekarang

### Editor prototype

- Create dan edit menu memakai satu modal panjang.
- Semua field terlihat sekaligus sehingga tidak ada urutan kerja yang jelas.
- Foto dimasukkan melalui URL.
- Preview hanya berupa satu card kecil.
- Kategori, harga, status, add-on, dan informasi tambahan bercampur dalam satu layar.
- Belum ada upload progress, crop/focal point, retry, atau pemilihan dari Media Library.
- Belum ada autosave draft dan recovery saat editor tertutup.

### Editor Laravel/Filament

- Data menu sudah lebih lengkap, tetapi form masih berupa kumpulan section panjang.
- Create dan edit masih dibuka dari modal resource.
- Gallery hanya memilih asset yang sudah dibuat di Media Library.
- Upload file sudah tersedia di Media Library, tetapi user harus keluar dari editor menu.
- Kategori, add-on, variants, promo, visibility, dan F&B information belum disusun sebagai task-oriented flow.
- Draft dan published snapshot sudah terpisah, tetapi manfaat ini belum dijelaskan dengan baik di dalam editor.

### Typography

SagaMenu belum menggunakan Plus Jakarta Sans secara menyeluruh:

- prototype memakai Manrope;
- Filament/dashboard memakai Instrument Sans;
- public Store/Bio default memakai Instrument Sans;
- auth dan maintenance memakai Inter;
- public surface sudah mendukung font pilihan dan custom font, tetapi UX pengaturannya masih terpisah.

## 2. Keputusan UX Utama

### 2.1 Complex editor menjadi full-page

Pembuatan dan pengeditan menu tidak lagi menggunakan modal. Keduanya memakai editor page yang sama:

- `Menu / Tambah menu`
- `Menu / Edit menu`

Modal hanya digunakan untuk task pendek seperti membuat kategori baru, konfirmasi archive, atau menambahkan satu opsi.

### 2.2 Empat langkah utama

Wizard menu dibuat cukup pendek agar user tidak merasa sedang mengisi formulir administrasi.

1. Informasi dasar
2. Foto dan media
3. Pilihan dan detail
4. Review

Promo, jadwal ketersediaan, metadata, dan pengaturan lanjutan diletakkan dalam progressive disclosure, bukan dijadikan langkah wajib.

### 2.3 Draft-first

- Perubahan disimpan sebagai draft dan tidak langsung mengubah halaman customer.
- Setelah informasi minimum di langkah pertama lengkap, sistem membuat draft.
- Setelah draft mempunyai ID, perubahan berikutnya dapat autosave.
- Header selalu menampilkan `Menyimpan`, `Tersimpan`, `Gagal menyimpan`, atau `Ada perubahan`.
- User dapat memilih `Simpan draft dan keluar`.
- Publish tetap dilakukan dari flow terpisah.

### 2.4 Preview selalu terlihat

Desktop:

- 60-64% area untuk form.
- 36-40% area untuk sticky preview.
- Toggle preview `Bio Menu` dan `Store Display`.
- Zoom dan open full preview tetap tersedia.

Mobile dashboard:

- Form satu kolom.
- Preview dapat dibuka sebagai bottom sheet atau full-screen.
- Primary action berada pada sticky bottom action bar.

### 2.5 Simple first, advanced when needed

Field yang terlihat pada awal harus menjawab kebutuhan paling umum:

- nama;
- kategori;
- harga;
- deskripsi;
- foto;
- status tersedia/sold out.

Field variants, promo schedule, visibility per surface, allergens, badges, external information, SEO, dan metadata berada di bagian lanjutan.

## 3. Struktur Wizard Menu

### Step 1: Informasi Dasar

Field utama:

- Nama menu
- Kategori utama
- Harga
- Deskripsi singkat
- Status ketersediaan

Interaction:

- Slug dibuat otomatis dan disembunyikan dari owner biasa.
- Kategori dapat dibuat inline tanpa meninggalkan wizard.
- Currency mengikuti organisasi dan tidak perlu dipilih ulang.
- Harga memakai formatted currency input.
- Character count muncul mendekati batas.
- Preview langsung mengikuti nama, harga, deskripsi, dan status.

Validation:

- Nama, kategori, dan price type wajib.
- Harga wajib jika price type bukan `free`, `contact`, atau `hidden`.
- Error muncul di dekat field dan stepper menandai langkah yang bermasalah.

### Step 2: Foto dan Media

Primary actions:

- Upload dari perangkat
- Pilih dari Media Library
- Ambil ulang atau ganti foto

Upload experience:

- Drag and drop serta file picker.
- JPG, PNG, dan WebP.
- Maksimum 5 MB.
- Progress bar per file.
- Preview sebelum disimpan.
- State uploading, processing, success, failed, retry, replace, dan remove.
- Maksimum satu primary image dan tujuh gallery images.

Image treatment:

- Original image dipertahankan.
- User memilih focal point, bukan memotong source secara permanen.
- Preview menunjukkan crop Store Display dan Bio Menu.
- Server membuat responsive derivatives dan thumbnail.
- Alt text otomatis diusulkan dari nama menu tetapi tetap dapat diedit.

Boundary:

- Input URL dihapus dari UI customer.
- URL lama tetap dapat dibaca untuk compatibility data seed/migration.
- Upload wajib scoped ke organization.
- Validator MIME, file signature, ukuran, dan malware scan tetap dipakai.
- Production memakai S3-compatible object storage, bukan filesystem VPS sebagai source utama.

Publish rule:

- Foto tidak wajib untuk layout list.
- Foto menjadi publish blocker jika surface memakai layout photo dan item tidak mempunyai fallback image yang valid.

### Step 3: Pilihan dan Detail

Bagian utama:

- Variants, misalnya Hot/Iced atau Regular/Large
- Add-on information
- Badge
- Informasi bahan, allergens, dietary, caffeine, spice, dan serving note

Interaction:

- Variant dan add-on memakai sortable rows.
- User dapat memilih grup add-on yang sudah ada.
- User dapat membuat grup add-on inline tanpa keluar dari menu.
- Setiap grup memperlihatkan aturan single/multiple dan jumlah opsi.
- Advanced detail dapat ditutup ketika tidak dipakai.
- Preview detail item memperbarui variant dan add-on secara langsung.

### Step 4: Review

Review dibagi menjadi:

- Ringkasan data menu
- Bio Menu preview
- Store Display preview
- Completeness checklist
- Warning yang tidak memblokir
- Error yang memblokir save/publish

Actions:

- Kembali dan perbaiki
- Simpan draft
- Simpan dan tambah menu berikutnya
- Simpan dan kembali ke daftar

Wizard ini tidak mempunyai tombol publish langsung. Tujuannya mencegah perubahan tidak sengaja muncul ke customer.

## 4. Edit Menu

Create dan edit memakai komponen yang sama. Perbedaannya:

- edit langsung membuka draft terbaru;
- header menunjukkan waktu terakhir disimpan;
- link ke live version tersedia jika item pernah dipublish;
- user dapat membandingkan `Draft` dan `Live`;
- perubahan destructive seperti archive mempunyai confirmation terpisah;
- duplicate dilakukan dari list atau menu actions, bukan di dalam wizard.

Edit dapat dibuka langsung ke langkah tertentu:

- klik foto membuka langkah Media;
- klik harga membuka Informasi Dasar;
- klik add-on membuka Pilihan dan Detail;
- attention item dari dashboard membuka field yang bermasalah.

## 5. Wizard Pendukung

Tidak semua CRUD harus menjadi wizard panjang.

### Category editor

Gunakan side sheet sederhana:

- Nama kategori
- Deskripsi opsional
- Visibility
- Urutan
- Jumlah menu yang menggunakan kategori

Delete harus diblokir jika kategori masih dipakai. User diberi pilihan memindahkan menu ke kategori lain.

### Add-on builder

Gunakan tiga bagian dalam full-height side sheet:

1. Nama dan aturan pilihan
2. Daftar opsi dan harga informasi
3. Menu yang menggunakan grup ini

Opsi dapat diurutkan, diduplicate, dinonaktifkan, dan ditambahkan inline.

### Catalog setup

Gunakan empat langkah hanya pada pembuatan katalog pertama:

1. Informasi bisnis
2. Surface yang digunakan
3. Brand dasar
4. Starter content dan review

Edit catalog setelah onboarding menggunakan settings page, bukan mengulang wizard.

### Media Library

Gunakan grid visual, bukan tabel file:

- thumbnail;
- nama;
- dimensi;
- pemakaian;
- alt-text status;
- filter image/font/video;
- bulk delete hanya untuk asset yang tidak dipakai.

### Publish wizard

Tetap terpisah:

1. Quality check
2. Compare draft/live
3. Confirm surfaces
4. Publish result

Publish gagal tidak boleh mengganti active snapshot.

## 6. Editor Shell dan Design Hierarchy

### Header

- Breadcrumb
- Judul task, bukan nama database resource
- Draft/live badge
- Last saved status
- Close/exit

### Stepper

- Horizontal pada desktop lebar.
- Compact horizontal scroll pada tablet.
- Label singkat dan nomor langkah.
- Completed, current, warning, dan error state.

### Form area

- Maksimum dua kolom hanya untuk field pendek.
- Textarea, upload, repeater, dan option builder selalu full width.
- Satu section menjawab satu keputusan user.
- Bahasa UI menggunakan istilah `Menu`, `Kategori`, `Foto`, dan `Pilihan`, bukan istilah model internal.

### Footer

- `Kembali`
- `Simpan draft dan keluar`
- `Lanjut`
- Sticky tetapi tidak menutupi field.
- Escape/back navigation menampilkan unsaved-change confirmation bila draft belum tersimpan.

## 7. Typography Strategy

### Dashboard product UI

Gunakan Plus Jakarta Sans yang di-self-host:

- 400 Regular
- 500 Medium
- 600 Semibold
- 700 Bold

Dashboard, auth, onboarding, maintenance system page, toast, form, dialog, dan navigation memakai font ini secara konsisten.

Font pilihan customer tidak pernah mengubah dashboard chrome.

### Customer-facing menu

Default heading dan body juga menggunakan Plus Jakarta Sans, tetapi dapat diganti per catalog.

Font control dibagi menjadi:

- Heading font
- Body font
- Uploaded brand font
- Font weight
- Text scale: compact, standard, large

Custom font:

- WOFF2 direkomendasikan; WOFF untuk compatibility.
- Maksimum 1 MB per file.
- Family mempunyai beberapa weight dalam satu grouping.
- User mengonfirmasi memiliki hak penggunaan font.
- Font gagal dimuat memakai Plus Jakarta Sans fallback.
- Font hanya diterapkan pada preview dan public surface.

## 8. Appearance dan Preset, Setelah Wizard

Appearance editor bukan wizard. Bentuknya split workspace:

- control panel di kiri;
- preview besar di kanan;
- satu device aktif pada satu waktu;
- Store Display/Bio Menu switch;
- save draft dan reset preset.

Model pengaturan:

### Brand Kit global

- logo;
- primary, accent, paper, ink;
- heading font;
- body font;
- radius;
- image treatment.

### Surface preset

- Bio Menu layout preset;
- Store Display layout preset;
- density;
- card layout;
- header style;
- category navigation style.

Brand Kit tetap sama agar kedua surface konsisten. Layout surface boleh berbeda sesuai konteks device.

Preset existing tidak langsung dihapus. Preset baru dibuat setelah editor menu stabil dan harus mempunyai:

- token schema version;
- thumbnail yang akurat;
- contrast validation;
- Store Display preview;
- Bio Menu preview;
- fallback font;
- migration path ketika preset diperbarui.

## 9. State dan Microcopy

Wajib tersedia:

- initial loading;
- autosaving;
- saved;
- offline;
- upload processing;
- upload failed;
- invalid file;
- empty media;
- incomplete draft;
- publish warning;
- save failed;
- retry success;
- permission denied;
- session expired.

Contoh copy:

- `Tersimpan sebagai draft. Belum tampil ke customer.`
- `Foto sedang diproses. Anda dapat melanjutkan mengisi detail.`
- `Format foto tidak didukung. Gunakan JPG, PNG, atau WebP maksimal 5 MB.`
- `Perubahan live tetap aman karena publish belum dilakukan.`

## 10. Accessibility dan Interaction

- Semua field mempunyai visible label.
- Error terhubung dengan field melalui description.
- Upload dapat digunakan dengan keyboard.
- Reorder memiliki tombol naik/turun selain drag.
- Focus berpindah ke heading langkah setelah navigation.
- Dialog kecil mengembalikan focus ke trigger.
- Contrast warna preset harus minimal WCAG AA untuk text.
- Motion hanya transform/opacity dan mengikuti reduced motion.
- Target sentuh minimum 44 x 44 px.

## 11. Sprint Implementasi

### Wizard Sprint 1: Foundation

- Self-host Plus Jakarta Sans.
- Buat reusable full-page editor shell.
- Buat stepper, draft state, last-saved status, sticky preview, dan footer.
- Jadikan create/edit menu satu workflow.
- Tambahkan route dan policy test.

Gate:

- Create dan edit tidak lagi memakai modal panjang.
- User dapat keluar/kembali tanpa kehilangan draft.
- Dashboard dan auth memakai Plus Jakarta Sans.

### Wizard Sprint 2: Core Menu Flow

- Implement Step 1 dan Step 4.
- Currency input, inline category create, availability, validation, completeness.
- Draft/live explanation.

Gate:

- Owner baru dapat membuat menu dasar tanpa bantuan.
- User memahami bahwa save draft berbeda dengan publish.

### Wizard Sprint 3: Media Upload

- Inline uploader dan Media Library picker.
- Progress, retry, replace, remove, alt text, focal point.
- Responsive image derivative pipeline dan orphan cleanup.
- Tenant, MIME, signature, size, malware, and authorization tests.

Gate:

- Tidak ada URL input pada customer workflow.
- Upload dan retry lulus desktop/mobile.
- Cross-tenant asset tidak dapat dipilih.

### Wizard Sprint 4: Variants dan Add-on

- Implement Step 3.
- Inline add-on builder, variants, allergen/detail controls.
- Sortable plus keyboard ordering.

Gate:

- Detail preview sama dengan public renderer.
- Add-on dapat dibuat, dipilih, diurutkan, dan dilepas.

### Wizard Sprint 5: Supporting Editors

- Category side sheet.
- Add-on full-height builder.
- Media Library grid.
- Catalog onboarding wizard.
- Publish wizard refinement.

Gate:

- Semua create/edit workflow memakai pattern yang sama.
- Delete protection dan recovery path jelas.

### Appearance Sprint 6: Brand Kit

- Migrasikan public default ke Plus Jakarta Sans.
- Heading/body font selectors.
- Grouped custom font family upload.
- Color, contrast, logo, and theme token editor.

Gate:

- Custom font hanya memengaruhi preview/public surface.
- Invalid font fail closed ke Plus Jakarta Sans.

### Appearance Sprint 7: Surface Presets

- Buat preset baru.
- Pisahkan global Brand Kit dari Bio/Store layout preset.
- Tambahkan preview thumbnail dan reset.
- Tambahkan preset schema migration.

Gate:

- Store/Bio tetap konsisten secara brand meskipun layout berbeda.
- Preset lama tidak merusak catalog existing.

### Wizard Sprint 8: QA dan Release Gate

- Functional E2E semua wizard.
- Draft recovery and navigation tests.
- Upload security tests.
- Desktop, tablet, dan mobile visual regression.
- Keyboard and accessibility audit.
- Performance and object-storage rehearsal.
- Rollback and compatibility test.

## 12. Acceptance Metrics

- User dapat membuat menu dasar dalam kurang dari 3 menit.
- User dapat mengganti foto tanpa meninggalkan editor.
- Minimal 90% task create/edit selesai tanpa validation loop berulang.
- Tidak ada perubahan yang tampil live tanpa publish confirmation.
- Tidak ada URL foto pada normal customer workflow.
- Tidak ada cross-tenant media exposure.
- Tidak ada horizontal overflow pada 390 px, 768 px, 1024 px, dan 1440 px.
- Semua button dan field memiliki accessible name.
- Draft recovery berhasil setelah refresh atau session interruption.

## 13. Urutan Yang Direkomendasikan

Jangan membuat preset baru terlebih dahulu.

Urutan terbaik:

1. Kunci information architecture wizard.
2. Buat satu prototype high-fidelity untuk create/edit menu.
3. Uji prototype dengan tiga skenario nyata.
4. Implement editor shell dan core menu.
5. Implement media upload.
6. Implement variants/add-on dan supporting editor.
7. Stabilkan seluruh wizard.
8. Baru migrasikan typography public dan membangun preset Store/Bio.

Tiga skenario prototype:

1. Tambah kopi sederhana dengan satu foto dan satu harga.
2. Tambah menu dengan Hot/Iced, ukuran, dan add-on.
3. Edit menu live, ganti foto, tandai sold out, lalu simpan draft tanpa publish.
