# SagaMenu Editorial Admin and Large Preview Sprint Strategy V1

Tanggal: 26 Juli 2026
Status: strategy ready for execution
Target: prototype Vercel lebih dahulu, lalu parity Laravel/Filament
Visual direction: Editorial KV Ops

## 1. Tujuan

Strategi ini mengubah owner dashboard SagaMenu menjadi editorial publishing
workspace dengan preview sebagai area kerja utama.

Hasil akhirnya harus memenuhi empat prinsip:

1. Owner selalu memahami apa yang sedang diedit, apa yang masih draft, dan apa
   yang sedang tampil ke customer.
2. Preview Store Display atau Bio Menu menggunakan 60-68% area kerja desktop.
3. Tidak ada tombol atau kontrol dekoratif yang terlihat interaktif tetapi tidak
   bekerja.
4. Setiap sprint lulus functional, visual, responsive, accessibility, dan
   regression gate sebelum diteruskan.

SagaMenu tetap merupakan e-menu dan e-catalog preview-only. Sprint ini tidak
menambahkan cart, checkout, WhatsApp order, POS, atau transaksi customer.

## 2. Baseline Yang Sudah Ada

### Sudah berfungsi pada prototype

- Navigasi Overview, Menu, Kategori, Add-on, Tampilan, Publish, dan Analytics.
- Tambah, edit, hapus, pencarian, filter, dan status tersedia/sold out item.
- Tambah, edit, visibility, dan naikkan urutan kategori.
- Tambah, edit, dan hapus grup add-on.
- Pemilihan preset, warna, serta upload font lokal.
- Preview Store Display dan Bio Menu.
- Search, category filter, dan item detail pada public preview.
- Draft state, maintenance state, publish success, copy link, reset demo, dan
  persistensi browser.
- Responsive desktop dan mobile owner dashboard.

### Gap yang harus ditutup

- Embedded preview terlalu kecil pada Overview.
- Appearance masih menampilkan dua device sekaligus sehingga ruang preview
  terpecah.
- Tab Store Display dan Bio Menu belum mengganti preview di dalam workspace.
- Pilihan layout item `Daftar` dan `Foto besar` belum mengubah public preview.
- Analytics period selector belum mengubah data.
- Drag handle kategori masih visual; reorder hanya mendukung naik satu posisi.
- Business switcher dan profile button belum mempunyai alur.
- Publish prototype belum memperlihatkan loading, failure, retry, dan old-live
  preservation secara fungsional.
- Upload media produk masih memakai URL; custom font prototype belum melalui
  storage dan validation backend.
- Prototype belum memisahkan draft snapshot dan published snapshot secara penuh.
- Laravel telah mempunyai theme dan resources, tetapi custom dashboard dan live
  preview besar belum parity dengan prototype.

## 3. Definition of Functionally Complete

Sebuah fitur hanya dianggap selesai bila:

- aksi berhasil pada happy path;
- loading, empty, validation, error, dan success state tersedia bila relevan;
- keyboard, focus, escape, dan touch interaction bekerja;
- perubahan tidak hilang setelah route change atau reload sesuai kontrak;
- preview memakai sumber state yang sama dengan editor;
- draft tidak mengubah published snapshot sebelum publish;
- semua tombol mempunyai handler, disabled reason, atau bukan elemen button;
- tidak ada console error, page error, broken image, atau horizontal overflow;
- automated test dan browser E2E untuk alur tersebut lulus.

## 4. Design Hierarchy

### 4.1 Hierarchy global

Urutan perhatian visual:

1. Active task dan live preview.
2. Primary action: Save draft atau Publish.
3. Draft/live status dan blocker.
4. Editor controls yang sedang relevan.
5. Contextual data seperti catalog health dan last published.
6. Analytics dan secondary settings.
7. Illustration sebagai editorial accent, bukan content utama.

Lime hanya digunakan untuk primary action, selected mode, dan positive
milestone. Product photography harus lebih dominan daripada illustration pada
screen preview.

### 4.2 Dashboard desktop, 1440 px

- Sidebar: 232-248 px.
- Top bar: 72 px.
- Workspace horizontal padding: 28-32 px.
- Grid: 12 kolom, gap 16 px.
- Editorial status line: 12 kolom, tinggi 72-96 px.
- Large live preview: 7-8 kolom atau 60-68% area konten.
- Attention rail: 4-5 kolom atau 32-40% area konten.
- Recent items: full width di bawah preview dan attention.
- Illustration maksimal 20% dari editorial status line.

Preview tablet memakai aspect ratio 16:10 dan memenuhi lebar container. Preview
mobile menggunakan frame 390 x 844 yang diskalakan secara proporsional, berada
di tengah, dan dibatasi maksimum 72vh.

### 4.3 Appearance workspace desktop

- Control rail: 4 kolom, 340-420 px, sticky.
- Preview workspace: 8 kolom, minimum 620 px.
- Device segmented control: di toolbar preview.
- Hanya satu device tampil pada satu waktu.
- `Open full preview`, zoom, dan fit-to-frame tersedia sebagai icon controls.
- Draft indicator dan last saved berada dekat toolbar, bukan menjadi card baru.

### 4.4 Tablet owner, 834-1194 px

- Sidebar menjadi icon rail atau drawer.
- Preview berada di atas editor saat lebar efektif kurang dari 900 px.
- Preview tablet tetap menggunakan aspect ratio, bukan fixed height.
- Controls menjadi dua kolom bila ruang cukup.
- Tidak ada horizontal scrolling untuk form atau action.

### 4.5 Mobile owner, 390 px

- Owner mobile adalah companion workflow.
- Tugas utama: status item, harga singkat, preview, dan publish.
- Preview muncul sebagai full-screen mode.
- Form menjadi satu kolom.
- Primary action minimum 44 px dan dapat sticky selama tidak menutup validation.
- Dense table berubah menjadi list.

## 5. Component Hierarchy

```text
AdminShell
|-- PrototypeNotice
|-- Sidebar
|-- UtilityBar
|-- PageHeader
|-- EditorialStatusLine
|-- EditorialWorkspace
|   |-- LivePreviewWorkspace
|   |   |-- PreviewToolbar
|   |   |-- DeviceSwitcher
|   |   |-- ZoomControls
|   |   |-- DraftStatus
|   |   `-- PreviewViewport
|   `-- ContextEditor
|       |-- SettingSection
|       |-- InlineValidation
|       `-- SaveStatus
|-- AttentionList
|-- RecentContentList
`-- ToastRegion
```

Preview renderer tidak boleh diduplikasi. Overview, Appearance, Publish, dan
full-screen preview harus memakai renderer dan state contract yang sama.

## 6. Motion System

### 6.1 Motion tokens

| Token | Durasi | Penggunaan |
| --- | ---: | --- |
| `motion-instant` | 100 ms | pressed dan focus feedback |
| `motion-fast` | 160 ms | hover, toggle, tab indicator |
| `motion-base` | 220 ms | modal, preview switch, toast |
| `motion-slow` | 320 ms | first-load editorial composition |

Easing utama:

```css
--ease-standard: cubic-bezier(.2, .8, .2, 1);
--ease-exit: cubic-bezier(.4, 0, 1, 1);
```

### 6.2 Animation contract

| Interaction | Motion |
| --- | --- |
| Route/page change | opacity 0 to 1 dan translateY 8 px ke 0, 180-220 ms |
| Preview device switch | crossfade dan scale .985 ke 1, 220 ms |
| Preview content update | affected region highlight, maksimal 600 ms |
| Modal/drawer open | opacity dan translateY/translateX, 220-240 ms |
| Modal close | 160-180 ms dengan exit easing |
| Toast | translateY 8 px dan opacity, dismiss setelah 4 detik |
| Toggle | thumb transform, 160 ms |
| Category reorder | FLIP-like transform, 220 ms |
| Save state | text/icon transition, tidak mengubah ukuran toolbar |
| Skeleton | shimmer hanya selama loading |
| Publish progress | determinate steps; tidak memakai fake endless loader |

Aturan:

- Animate hanya `transform` dan `opacity`.
- Tidak ada perpetual decorative animation pada dashboard operasional.
- Tidak ada parallax, magnetic control, atau motion yang mengganggu input.
- Hover tidak menjadi satu-satunya feedback.
- `prefers-reduced-motion: reduce` menghapus movement dan mempertahankan state
  change melalui opacity atau perubahan copy.
- Layout tidak boleh bergeser saat save status, badge, toast, atau error muncul.

## 7. Sprint Map

Estimasi adalah hari kerja fokus untuk satu implementer. Sprint boleh
diparalelkan hanya jika write scope dan test scope tidak bertabrakan.

### Sprint 0 - Baseline Lock and Test Map

Durasi: 0,5-1 hari

Tujuan:

- Mengunci state prototype sebelum perubahan besar.
- Menentukan control inventory dan E2E baseline.

Pekerjaan:

- Daftar seluruh route, button, select, toggle, input, dialog, dan link.
- Tandai setiap control sebagai working, partial, dead, atau intentionally
  unavailable.
- Capture dashboard dan Appearance pada 1440, 1024, dan 390 px.
- Bekukan fixture demo dan localStorage schema version.
- Tambahkan test id hanya pada elemen yang sulit ditarget secara semantik.

Gate:

- Existing static check dan browser QA lulus.
- Tidak ada perubahan behavior.
- Baseline screenshot dan control inventory tersimpan.

### Sprint 1 - Editorial Shell and Information Hierarchy

Durasi: 1,5-2 hari

Tujuan:

- Menjadikan dashboard terasa seperti publishing studio.

Fitur:

- Editorial status line yang lebih ringkas.
- Large preview sebagai region utama Overview.
- Attention rail untuk draft, sold out, missing media/alt text, dan trial.
- Recent items full-width di bawah workspace.
- Metadata horizontal untuk status catalog, bukan metric card berulang.
- Business switcher dan profile control diberi popover sederhana atau diubah
  menjadi non-interactive identity block pada prototype.

Animasi:

- Page enter.
- Active navigation indicator.
- Attention row feedback.
- Reduced-motion fallback.

Gate:

- Large preview mengambil minimal 60% region kerja desktop.
- H1, status, preview, dan action mempunyai urutan visual yang jelas.
- Tidak ada nested card, overlap, atau desktop/mobile overflow.
- Semua control shell memiliki behavior.

### Sprint 2 - Shared Live Preview Engine

Durasi: 2-2,5 hari

Tujuan:

- Satu renderer preview untuk seluruh owner workflow.

Fitur:

- Shared preview state: `device`, `layoutMode`, `zoom`, `fitMode`, `draftVersion`.
- Segmented control Store Display dan Bio Menu.
- One-device-at-a-time embedded preview.
- `Fit`, zoom out, zoom in, reset zoom, dan open full screen.
- Preview tetap sinkron saat nama, warna, foto, harga, status, kategori, atau
  add-on berubah.
- Empty, maintenance, zero search result, sold out, missing media, dan item
  detail dapat direview dari preview.
- Preview iframe/container memiliki fixed aspect ratio dan tidak mengubah layout.

Animasi:

- Device crossfade.
- Focused content update highlight.
- Full-screen preview transition.

Gate:

- Tidak ada renderer berbeda yang menghasilkan tampilan inkonsisten.
- Switching device mempertahankan selected category bila masih valid.
- Search dan detail bekerja pada embedded dan full preview.
- Zoom tidak merusak pointer/keyboard interaction.

### Sprint 3 - Catalog, Category, and Add-on Completeness

Durasi: 2-3 hari

Tujuan:

- Menutup semua fungsi pengelolaan konten utama.

Fitur item:

- Create, edit, duplicate, archive/delete, status, photo, description, price,
  badge, allergen, variant, dan add-on attachment.
- Search dan filter yang mempertahankan state selama route aktif.
- Confirmation dan safe recovery untuk destructive action.
- Empty dan no-result state.

Fitur kategori:

- Create, edit, visibility, move up/down, dan drag reorder yang nyata.
- Delete protection ketika masih dipakai item.
- Reassign flow sebelum category delete.

Fitur add-on:

- Create, edit, delete, single/multi choice, min/max, informational extra price,
  dan item attachment.
- In-use blocker sebelum delete.

Animasi:

- Row insert/delete.
- Reorder transform.
- Inline validation dan success feedback.

Gate:

- CRUD diuji dengan reload persistence pada prototype.
- Invalid price, duplicate slug/name, empty required field, dan in-use delete
  mempunyai pesan yang spesifik.
- Setiap perubahan langsung terlihat pada draft preview.
- Tidak ada order semantics pada public detail.

### Sprint 4 - Appearance and Brand Studio

Durasi: 2-2,5 hari

Tujuan:

- Membuat Appearance sebagai editor branding yang benar-benar live.

Fitur:

- Preset Editorial KV, Warm Minimal, dan Clean Premium.
- Primary, accent, paper, text contrast, heading font, body font, dan custom
  font.
- Layout item `Daftar` dan `Foto besar` berfungsi pada Store dan Bio sesuai
  device rules.
- Font upload validation: extension, MIME, size, decode, fallback, dan remove.
- Reset section dan reset all dengan confirmation.
- Unsaved/draft marker dan save status.
- Preview device, zoom, dan full-screen controls.

Animasi:

- Token transition maksimal 220 ms.
- Preview layout crossfade.
- Save status `Menyimpan`, `Tersimpan`, dan `Gagal`.

Gate:

- Setiap appearance control menghasilkan perubahan yang terlihat.
- Contrast warning tidak hanya mengandalkan warna.
- Font gagal tidak merusak fallback.
- Appearance reload mempertahankan state prototype.

### Sprint 5 - Publish, Maintenance, Share, and Analytics

Durasi: 2-3 hari

Tujuan:

- Menyelesaikan lifecycle draft sampai public snapshot.

Publish:

- Pre-publish checklist dengan blocker dan warning.
- Loading/progress, success, failure, retry, dan old-live preservation.
- Draft snapshot terpisah dari published snapshot.
- Publish version dan timestamp.
- Maintenance on/off dengan confirmation dan preview.

Share:

- Copy Store Display link.
- Copy Bio Menu link.
- QR preview dan download pada implementasi Laravel.
- Copy success feedback.

Analytics:

- Period selector 7/30/90 hari yang benar-benar mengubah fixture prototype.
- Views, detail opens, search, source, dan popular item aggregates.
- Empty, delayed, dan unavailable state.
- Tidak ada visitor-level analytics pada laporan central.

Animasi:

- Publish progress step transition.
- Success state entrance.
- Chart/bar update via transform.

Gate:

- Failed publish tidak mengubah published snapshot.
- Maintenance tidak membocorkan catalog content.
- Share controls menghasilkan URL device yang benar.
- Analytics filter mengubah label dan angka secara konsisten.

### Sprint 6 - States, Motion, Accessibility, and Responsive Hardening

Durasi: 2 hari

Tujuan:

- Menyatukan kualitas interaction seluruh screen.

Pekerjaan:

- Terapkan motion tokens dan reduced-motion behavior.
- Lengkapi loading, empty, error, success, disabled, focus, and offline-safe
  prototype state.
- Focus trap dialog, Escape close, focus return, live region, and accessible
  label.
- Touch target minimum 44 x 44 px pada mobile.
- Long Indonesian copy, long item name, missing image, dan 200% zoom test.
- Responsive review pada 1440 x 1000, 1024 x 768, 834 x 1194, dan 390 x 844.

Gate:

- Tidak ada unnamed button.
- Keyboard-only core workflow lulus.
- `prefers-reduced-motion` lulus.
- Tidak ada cumulative layout shift saat save, error, atau toast.
- Contrast dan visible focus memenuhi WCAG AA target.

### Sprint 7 - Prototype Acceptance and Vercel Review Release

Durasi: 1-1,5 hari

Tujuan:

- Menghasilkan prototype review yang dapat diuji Andreas.

Pekerjaan:

- Static check, E2E, screenshot capture, and visual comparison.
- Test seluruh control inventory.
- Deploy preview ke Vercel.
- Verifikasi URL production alias, assets, headers, and localStorage migration.
- Buat review checklist dan rollback note.

Gate:

- E2E prototype 100% lulus.
- Tidak ada P0/P1 visual finding.
- P2 hanya boleh tersisa bila didokumentasikan dan tidak menghambat review.
- Vercel deployment `READY` dan browser QA live lulus.

### Sprint 8 - Laravel and Filament Parity

Durasi: 3-4 hari

Tujuan:

- Memindahkan prototype yang sudah disetujui ke aplikasi utama.

Pekerjaan:

- Custom Filament dashboard atau custom page untuk editorial Overview.
- Shared Laravel preview endpoint menggunakan draft data.
- Live preview controls pada Catalog Appearance.
- Persist item, category, option, media, appearance, draft, dan published
  snapshot dari database produk.
- Authorization per organization/outlet.
- Media/custom font validation dan storage.
- Publish service tetap atomic dan idempotent.
- Feature flag Saga Platform tetap default off.

Gate:

- Prototype dan Laravel mempunyai hierarchy serta behavior setara.
- Tenant isolation, owner invariant, dan publish permission diuji.
- Public content memakai published snapshot, bukan mutable draft.
- Secret tidak masuk client bundle atau repository.

### Sprint 9 - Production Readiness Gate

Durasi: 1,5-2 hari

Tujuan:

- Menentukan apakah build siap staging, beta, atau masih local-only.

Pekerjaan:

- Full Laravel tests, Pint, Vite build, browser E2E, security audit, upload abuse
  checks, performance budget, and backup/rollback drill.
- Validate immutable source commit.
- Validate environment placeholders tanpa menampilkan secret.
- Check feature flag, signed central contract, session, provisioning, and
  account maintenance behavior.
- Changelog, KB, release notes, and operator runbook.

Gate:

- Tidak ada critical/high security issue.
- Tidak ada P0/P1 product or UX issue.
- Source commit immutable tersedia.
- Rollback, monitoring, support owner, dan release decision tercatat.
- Status akhir disebut secara jujur: local-ready, prototype-ready,
  staging-ready, beta-ready, atau production-ready.

## 8. Feature Acceptance Matrix

| Area | Happy path | Failure/edge path | E2E wajib |
| --- | --- | --- | --- |
| Navigation | Semua route terbuka | Unknown hash kembali ke Overview | Ya |
| Item | Create/edit/status/delete | Invalid field, cancel, missing media | Ya |
| Category | CRUD/reorder/visibility | In-use delete, first/last boundary | Ya |
| Add-on | CRUD/attach | Conflict, in-use delete | Ya |
| Appearance | Preset/color/font/layout | Invalid font, bad contrast, reset | Ya |
| Preview | Device/search/category/detail | Empty, zero result, maintenance | Ya |
| Publish | Checklist/publish/success | Blocked, failed, retry, old live | Ya |
| Share | Copy links/QR | Clipboard unavailable | Ya |
| Analytics | Filter and ranked data | Empty/delayed/unavailable | Ya |
| Persistence | Reload draft | Schema migration/corrupt local state | Ya |
| Responsive | Desktop/tablet/mobile | Long copy, zoom, narrow viewport | Ya |
| Accessibility | Keyboard/focus/live region | Reduced motion, validation focus | Ya |

## 9. Critical E2E Journey

1. Reset demo dan verifikasi baseline.
2. Buka Menu, cari item, filter kategori, dan ubah menjadi sold out.
3. Tambah item dengan foto, deskripsi, badge, dan add-on.
4. Edit item dan verifikasi large preview berubah.
5. Buat kategori, reorder, sembunyikan, lalu uji in-use delete blocker.
6. Buat grup add-on dan attach ke item.
7. Buka Appearance, ganti preset, warna, font, dan layout.
8. Switch Store Display ke Bio Menu tanpa meninggalkan editor.
9. Uji search, category rail, item detail, dan zero result pada dua device.
10. Aktifkan maintenance dan pastikan content katalog tidak terlihat.
11. Nonaktifkan maintenance, jalankan publish failure, retry, lalu success.
12. Verifikasi published version, timestamp, copy link, dan QR.
13. Ganti analytics period dan verifikasi data berubah.
14. Reload browser dan verifikasi draft/published state yang seharusnya persisten.
15. Ulangi critical path dengan keyboard dan reduced motion.

## 10. Test Pyramid

### Static checks

- Duplicate ids dan invalid data attributes.
- Broken local asset references.
- Button tanpa accessible name.
- Button/action tanpa handler.
- Public order/cart/checkout copy guard.

### Unit and feature tests

- State reducer atau state transition.
- Draft versus published snapshot.
- Category and add-on integrity.
- Appearance validation.
- Publish blocker dan failure preservation.
- Tenant authorization pada Laravel.

### Browser E2E

- Critical journey di atas.
- Desktop 1440, tablet 1024, dan mobile 390.
- Console/page error capture.
- Overflow dan visible control checks.
- Screenshot evidence untuk hierarchy dan key states.

### Visual QA

- Bandingkan Overview dan Appearance terhadap approved editorial target.
- Periksa typography, spacing, color tokens, image quality, dan copy.
- Iterasi sampai tidak ada P0/P1/P2 actionable mismatch.

## 11. Performance Budget

- Initial prototype asset transfer target di bawah 2 MB selain demo product
  photography.
- Illustration WebP masing-masing target di bawah 120 KB.
- Large preview interaction target 60 fps pada device yang wajar.
- Preview update target terlihat di bawah 200 ms untuk local state.
- Tidak ada layout animation berbasis width/height.
- Lazy load media yang berada di luar viewport.

## 12. Risks and Mitigation

| Risiko | Mitigasi |
| --- | --- |
| Preview besar membuat editor sempit | Sticky 340-420 px rail dan responsive stack |
| Renderer terduplikasi | Satu shared renderer dan preview state contract |
| Animasi terasa lambat | Token maksimum 320 ms dan reduced motion |
| Banyak button tetapi handler tertinggal | Automated action inventory |
| Draft langsung mengubah live | Pisahkan draft dan published snapshot |
| Font/media berbahaya | Server validation, size/MIME allowlist, safe storage |
| Prototype dianggap production | Prototype banner dan readiness label eksplisit |
| Laravel drift dari prototype | Parity matrix dan shared acceptance scenarios |
| Scope melebar ke ordering | Automated copy/feature guard untuk order/cart/checkout |

## 13. Recommended Execution Order

Urutan wajib:

```text
Sprint 0
  -> Sprint 1
  -> Sprint 2
  -> Sprint 3 dan Sprint 4
  -> Sprint 5
  -> Sprint 6
  -> Sprint 7
  -> Andreas review gate
  -> Sprint 8
  -> Sprint 9
```

Sprint 3 dan Sprint 4 dapat berjalan paralel hanya jika implementasinya memakai
write scope yang terpisah. Sprint 8 tidak dimulai sebelum prototype Sprint 7
disetujui, supaya Laravel tidak mengejar desain yang masih berubah.

## 14. Final Deliverables

- Updated interactive Vercel prototype.
- Editorial Overview dengan large live preview.
- Appearance Brand Studio one-device-at-a-time.
- Complete control inventory tanpa dead button.
- Motion tokens dan reduced-motion implementation.
- E2E suite dan screenshot evidence.
- Design QA report.
- Laravel/Filament parity implementation.
- Security, release, rollback, KB, and changelog documentation.

## 15. Decision

Rekomendasi utama adalah memulai dari Sprint 0-2. Ketiga sprint tersebut
mengunci hierarchy dan shared preview engine yang menjadi dependency seluruh
fitur berikutnya. CRUD, appearance, publish, dan Laravel parity tidak boleh
membuat renderer preview sendiri.
