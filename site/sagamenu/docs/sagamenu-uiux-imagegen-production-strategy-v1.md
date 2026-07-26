# SagaMenu UI/UX and ImageGen Production Strategy V1

Tanggal: 25 Juli 2026

Status: visual direction selected; anchor preview production pending

Surface: owner dashboard, Store Display, Bio Menu, auth/onboarding, account lifecycle
Sumber: enam referensi visual lokal, dokumen scope SagaMenu, prototype Vercel, dan surface Laravel/Filament yang tersedia

## Selected Visual Direction

- Keputusan: Editorial KV Ops, refinement nomor 2.
- Dipilih: 25 Juli 2026.
- Selected visual target: `docs/design-references/sagamenu-editorial-kv-ops-dashboard-selected-v1.png`.
- Ciri yang dikunci: dark sidebar, warm operational canvas, editorial story strip, semantic pastel metrics, lime publish action, cut-paper illustration, dan right-side preview/publish workspace.
- Status implementasi: belum diterapkan ke prototype atau Laravel/Filament.
- Next gate: menghasilkan anchor preview pack dengan selected visual target sebagai reference image.

## 1. Tujuan

Dokumen ini menjadi arahan kerja untuk:

1. Mengubah karakter visual referensi menjadi sistem UI SagaMenu yang fun tetapi tetap operasional.
2. Menentukan ukuran, penempatan, hierarchy, dan density setiap keluarga screen.
3. Menentukan screen dan state yang perlu dibuat sebagai preview sebelum implementasi.
4. Memisahkan aset yang tepat dibuat dengan ChatGPT ImageGen 2 dari aset yang harus dibuat di kode.
5. Menjaga konsistensi seluruh hasil ImageGen melalui satu visual DNA, asset manifest, naming, dan acceptance gate.

ImageGen dipakai untuk eksplorasi visual dan aset bitmap. Hasil preview bukan sumber kebenaran untuk copy, spacing final, accessibility, atau behavior. Sumber kebenaran implementasi tetap design tokens, komponen, dan acceptance test.

## 2. Batas Produk Yang Harus Tetap

- SagaMenu adalah pembuat e-menu/e-katalog preview-only, bukan sistem order, cart, POS, atau checkout.
- Add-on, modifier, variant, inclusion, dan harga tambahan tampil sebagai informasi.
- Store Display adalah pengalaman tablet landscape dengan kategori di atas.
- Bio Menu adalah pengalaman mobile link-in-bio.
- Owner dapat mengatur catalog, collection/category, offering/item, add-on, media, video, page, appearance, custom font, preview, publish, QR/share, team, dan analytics.
- Satu data draft menghasilkan dua public layout setelah publish.
- Font client boleh diunggah dalam format aman dengan fallback.
- Trial awal 14 hari. Harga keputusan produk saat ini Rp100.000/bulan atau Rp1.000.000/tahun.
- Account restricted menampilkan maintenance state, bukan data catalog.
- UI branded SagaMenu tetap digunakan untuk signup dan login.

## 3. Audit Enam Referensi

### R1 - Eduplex

- File: `cf1749b03232343876ebdf35582de80e.jpg`
- Ukuran: 736 x 552, rasio 4:3.
- Struktur: dark sidebar sekitar 18% lebar frame, main content sekitar 57%, right rail sekitar 25%.
- Karakter: lavender surround, ink sidebar, lime active state, white canvas, compact cards.
- Yang diambil: active navigation yang kuat, dashboard tiga zona, promo illustration sebagai aksen, row list yang rapat.
- Yang tidak diambil: radius besar pada semua card dan jumlah card dekoratif yang terlalu banyak.

### R2 - Jewellery

- File: `336055ecaef025de4fdf04079972d5c8.jpg`
- Ukuran: 1200 x 900, rasio 4:3.
- Struktur: top navigation, content 2/3, contextual profile rail 1/3.
- Karakter: cream canvas, pastel metric blocks, black semantic icons, portrait cutouts.
- Yang diambil: pastel dipakai sebagai data grouping, bukan background seluruh aplikasi; contextual right rail untuk preview/status.
- Yang tidak diambil: enam metric tile berwarna sekaligus pada semua dashboard dan UI yang terlalu menyerupai CRM customer.

### R3 - Timso

- File: `1c16bae9a511cedb4dc57f1d828c82b8.jpg`
- Ukuran: 720 x 1240, rasio 0,581.
- Struktur: editorial landing page vertikal, whitespace besar, section dengan ilustrasi sebagai anchor.
- Karakter: warm grey, black ink line art, neon lime, black CTA.
- Yang diambil: bahasa ilustrasi editorial, lime halo lokal, karakter yang terasa ramah, komposisi dengan ruang kosong.
- Yang tidak diambil: layout marketing panjang untuk owner dashboard dan lime glow sebagai background global.

### R4 - Sophia Learning

- File: `a1ba43067ea8796dd0402ac12f567577.jpg`
- Ukuran: 1200 x 900, rasio 4:3.
- Struktur: icon rail sempit, content utama, profile/insight rail.
- Karakter: playful subject chips, visual thumbnail abstrak, greeting besar, campuran sans dan display.
- Yang diambil: category chips dengan glyph, thumbnail asset yang memorable, profile rail modular.
- Yang tidak diambil: display type pada panel operasional kecil dan chart dekoratif yang tidak menjawab tugas.

### R5 - Curely

- File: `7e0071fc6cba2de756d9c21b41946ac9.jpg`
- Ukuran: 1199 x 758, rasio 1,582.
- Struktur: black sidebar, content 2/3, schedule rail 1/3, dense information hierarchy.
- Karakter: cream canvas, pink/yellow/blue data surfaces, black primary action.
- Yang diambil: density yang tetap terbaca, warna per status/kelompok, action bar gelap, list-detail pattern.
- Yang tidak diambil: kepadatan data klinis pada MVP analytics SagaMenu.

### R6 - DoDo

- File: `f4fa4aa359ec79ce7294b09303f56497.jpg`
- Ukuran: 752 x 564, rasio 4:3.
- Struktur: narrow sidebar, modular main workspace, narrow agenda rail.
- Karakter: lime accent, black task card, illustrated category tiles, organic line marks.
- Yang diambil: micro-illustration di card penting, playful onboarding, satu black emphasis card per viewport.
- Yang tidak diambil: garis dekoratif yang masuk ke area interaksi atau setiap card memiliki gaya visual berbeda.

## 4. Sintesis: SagaMenu Fun Ops

SagaMenu tidak menyalin satu referensi. Sistem visualnya menggabungkan:

- Struktur operasional R1, R5, dan R6.
- Pastel semantic blocks R2.
- Bahasa ilustrasi editorial R3.
- Category glyph dan micro-assets R4.

Fun harus muncul dalam empat tempat:

1. Onboarding dan empty state.
2. Promo, trial, publish, dan milestone state.
3. Category glyph dan demo content.
4. Microcopy serta feedback transisi.

Fun tidak boleh mengurangi keterbacaan table, form, validation, permission, publish history, atau account status.

### Visual DNA

Nama internal: `SagaMenu Fun Ops v1`

- Mood: hangat, optimistis, modern, lokal, rapi.
- Illustration: editorial cut-paper 2D dengan outline hitam lembut, bentuk geometris sederhana, tekstur grain tipis.
- UI: warm canvas, white surfaces, deep ink navigation, pastel semantic panels, lime hanya untuk momentum positif.
- Photography: foto produk nyata tetap menjadi fokus pada public menu.
- Shape: card radius 7-8 px; pill hanya untuk status, filter, chip, dan segmented control.
- Shadow: sangat ringan; hierarchy utama berasal dari spacing, border, dan color block.
- Decorative marks: maksimum satu motif garis/shape per screen, tidak berada di belakang text atau control.

### Palette

| Token | Nilai | Fungsi |
|---|---:|---|
| Ink | `#171D1A` | sidebar, primary emphasis, text utama |
| Canvas | `#F3F5F1` | background aplikasi |
| Surface | `#FFFFFF` | form, table, panel |
| Soft surface | `#F8FAF8` | secondary grouping |
| Primary | `#236354` | action, focus, selected |
| Primary soft | `#E4F1EC` | selected row, info positive |
| Terracotta | `#B34F32` | brand accent/public menu |
| Lime | `#CBF45A` | milestone, trial, selected fun accent |
| Yellow | `#F4D35E` | warning ringan, attention |
| Pink | `#E9A7CB` | promo, creative/appearance |
| Blue | `#A9C6F5` | analytics, information |
| Mint | `#CDEBDD` | success, published |
| Danger | `#A23D3D` | destructive/error |
| Line | `#DCE2DE` | divider dan border |

Pastel maksimal mengisi 25-30% viewport dashboard. Ink, canvas, surface, dan product photography harus tetap dominan.

### Typography

- UI default: Manrope atau Instrument Sans.
- Data/table: 13-14 px, line-height 20 px.
- Body/form: 14-16 px, line-height 22-24 px.
- Section title: 18-24 px.
- Page title: 28-32 px desktop, 24-28 px mobile.
- Public menu title boleh menggunakan uploaded brand font dengan fallback.
- Letter spacing selalu 0.
- Display font tidak digunakan pada tabel, form label, status, atau error copy.

### Icon System

Jangan membuat action icon standar dengan ImageGen.

- Action/navigation: Lucide atau Heroicons yang sudah konsisten di stack, 18 px default.
- Icon button desktop: 36 x 36 px; touch target minimum 44 x 44 px pada public/mobile.
- Sidebar icon: 20 px; active rail 40 px tinggi.
- Status icon: 16 px.
- Empty-state illustration: ImageGen, bukan icon.
- Category glyph custom: ImageGen boleh digunakan sebagai demo/brand asset, lalu dirapikan menjadi raster set konsisten.
- QR, chart, progress, skeleton, spinner, toggle, checkbox, upload progress, dan badges dibuat dengan komponen/kode.

## 5. Layout System

### Owner Dashboard Desktop

Target frame preview: 1440 x 1024.

- Sidebar: 232 px fixed.
- Top utility bar: 72 px.
- Content padding: 28 px kiri/kanan, 24 px atas/bawah.
- Grid: 12 kolom, gap 16 px.
- Page gap vertikal: 24 px.
- Section gap: 16 px.
- Primary content: 8-9 kolom.
- Context rail: 3-4 kolom, minimum 296 px, maksimum 336 px.
- KPI card: minimum 176 px tinggi 120-140 px.
- Table row: 64-72 px bila memakai thumbnail; 48-56 px tanpa thumbnail.
- Search: tinggi 40 px, lebar 280-360 px.
- Primary button: tinggi 40 px.
- Form field: tinggi 44 px.
- Drawer editor: 520-600 px.
- Modal: 640-760 px lebar, maksimum 80vh.

Dashboard overview tidak boleh berisi lebih dari empat KPI primer. `Needs Attention`, onboarding, dan publish status lebih penting daripada chart dekoratif.

### Owner Dashboard Tablet

Target frame preview: 1194 x 834 landscape dan 834 x 1194 portrait.

- Sidebar berubah menjadi icon rail 72 px atau drawer.
- Content padding 24 px.
- Grid 8 kolom, gap 16 px.
- Context rail pindah ke bawah jika lebar efektif kurang dari 900 px.
- Form editor memakai full-height drawer maksimum 560 px.

### Owner Dashboard Mobile

Target frame preview: 390 x 844.

- Top bar: 56 px.
- Content padding: 16 px.
- Bottom navigation: 64 px untuk Overview, Menu, Preview, Publish.
- Fitur lain masuk menu `Lainnya`.
- Field dan CTA minimum 44 px.
- Complex table berubah menjadi list row, bukan table yang digeser horizontal.
- Primary action boleh sticky di bawah, tetapi tidak menutup validasi atau keyboard.

Mobile owner adalah companion surface. Tugas utama: ubah status tersedia/sold out, edit harga singkat, preview, dan publish.

### Store Display

Target utama: 1024 x 768 dan 1194 x 834 landscape.

- Header: 72-80 px.
- Category rail: sticky di bawah header, tinggi 48-56 px, horizontal scroll.
- Content padding: 24-32 px.
- Menu grid: 4 kolom pada 1194 px, 3 kolom pada 1024 px.
- Gap: 16-20 px.
- Card: rasio foto 4:3, minimum lebar 220 px, text area 88-112 px.
- Product photo mengisi 65-72% card.
- Detail overlay: 720-860 px lebar atau split overlay 42/58.
- Detail video: 16:9; tidak autoplay dengan suara.
- Kategori tidak ditempatkan di sidebar kiri.

### Bio Menu

Target utama: 390 x 844.

- Brand header/cover: 156-184 px.
- Search: tinggi 44 px.
- Category rail: sticky, tinggi 48 px.
- Content padding: 16 px.
- Menu card list: tinggi 112-128 px, thumbnail 96-112 px.
- Photo grid variant: dua kolom, gap 12 px, foto 1:1 atau 4:3.
- Item detail: full-height bottom sheet dengan radius hanya di sudut atas, media 4:3 atau video 16:9.
- Detail CTA hanya command navigasi seperti tutup, share, atau lihat media; tidak ada order.

## 6. Information Architecture Owner

### Primary Navigation

1. Overview
2. Catalogs
3. Collections
4. Offerings
5. Options
6. Media Library
7. Appearance
8. Preview & Publish
9. QR & Share
10. Analytics

### Secondary Navigation

- Team
- Subscription
- Invoices
- Support
- Organization

### SagaDev/Admin Only

- Organizations
- Audit Log
- Backups
- Support queue
- Subscription diagnostics
- Publish history diagnostics

System labels dapat ditampilkan lebih ramah untuk owner:

- Catalogs -> Menu & Katalog
- Collections -> Kategori
- Offerings -> Item
- Options -> Add-on & Pilihan

Nama domain internal tetap canonical di code/schema.

## 7. Screen Preview Inventory

### A. Auth and Account

| ID | Screen | State yang harus dibuat |
|---|---|---|
| AUTH-01 | Login branded | default, invalid credentials, loading |
| AUTH-02 | Signup branded | default, validation, submitting |
| AUTH-03 | Verify email | waiting, verifying, invalid/expired link |
| AUTH-04 | Provisioning | creating workspace, retry available, failed |
| AUTH-05 | Trial activated | success, 14-day summary |
| AUTH-06 | Account status | active, trial ending, expired, suspended, cancelled |
| AUTH-07 | Maintenance | restricted account, safe generic copy |
| AUTH-08 | Session expired | re-login prompt |

### B. Onboarding

| ID | Screen | State yang harus dibuat |
|---|---|---|
| ONB-01 | Welcome checklist | 0%, partial, complete |
| ONB-02 | Business profile | default, logo upload, validation |
| ONB-03 | First catalog | template choice, blank start |
| ONB-04 | First category | empty, category created |
| ONB-05 | First item | image upload, details, add-on |
| ONB-06 | Theme setup | preset, color, uploaded font |
| ONB-07 | First preview | tablet/mobile segmented preview |
| ONB-08 | First publish | checklist, publishing, success |

### C. Overview

| ID | Screen | State yang harus dibuat |
|---|---|---|
| DSH-01 | Operational overview | healthy published catalog |
| DSH-02 | Needs attention | missing image, draft, expiring trial |
| DSH-03 | New organization | onboarding empty state |
| DSH-04 | Draft-heavy | unpublished changes and blockers |
| DSH-05 | Maintenance mode | account/content unavailable |
| DSH-06 | Mobile quick actions | sold out, price, preview, publish |

### D. Catalog and Category

| ID | Screen | State yang harus dibuat |
|---|---|---|
| CAT-01 | Catalog list | default, empty, archived |
| CAT-02 | Catalog editor | create, edit, duplicate |
| CAT-03 | Collection/category list | ordered, hidden, empty |
| CAT-04 | Reorder categories | drag state, saved |
| CAT-05 | Delete category | safe delete, blocked by items |
| CAT-06 | Search/filter | results, zero result |

### E. Offering and Detail

| ID | Screen | State yang harus dibuat |
|---|---|---|
| ITM-01 | Item list | photo rows, list rows, bulk action |
| ITM-02 | Item editor basic | create, validation, saved |
| ITM-03 | Media and video | uploading, processing, failed |
| ITM-04 | Pricing/status | active, sold out, coming soon, hidden |
| ITM-05 | Description/info | ingredients, allergen, duration/inclusion |
| ITM-06 | Duplicate/archive | confirmation, completed |
| ITM-07 | Long content | long name, long description, missing photo |

### F. Add-on and Modifier

| ID | Screen | State yang harus dibuat |
|---|---|---|
| OPT-01 | Option group list | default, empty |
| OPT-02 | Group editor | single/multi choice, min/max |
| OPT-03 | Option value editor | label, informational price |
| OPT-04 | Attach to item | none, selected, conflict |
| OPT-05 | Delete group | confirmation, blocked/in use |

### G. Media

| ID | Screen | State yang harus dibuat |
|---|---|---|
| MED-01 | Media library | grid, list, empty |
| MED-02 | Upload queue | queued, progress, processing |
| MED-03 | Upload failure | type, size, malware/unsafe rejection |
| MED-04 | Crop/thumbnail | portrait, landscape, focal point |
| MED-05 | Video preview | thumbnail, loading, failed playback |
| MED-06 | Asset in use | usage references before delete |

### H. Appearance

| ID | Screen | State yang harus dibuat |
|---|---|---|
| APP-01 | Theme presets | Warm Minimal, Bold Street, Clean Premium |
| APP-02 | Color editor | valid, contrast warning |
| APP-03 | Font library | curated, uploaded |
| APP-04 | Font upload | uploading, success, invalid type, fallback |
| APP-05 | Live dual preview | tablet/mobile segmented control |
| APP-06 | Unsaved appearance | draft indicator, reset confirmation |

### I. Preview and Public

| ID | Screen | State yang harus dibuat |
|---|---|---|
| PUB-01 | Store Display home | category top rail, photo grid |
| PUB-02 | Store item detail | photo, video, description, options |
| PUB-03 | Store search | results, zero result |
| PUB-04 | Store unavailable | sold out, coming soon |
| PUB-05 | Bio Menu home | sticky category, list/photo mode |
| PUB-06 | Bio item detail | full-height sheet |
| PUB-07 | Bio search | results, zero result |
| PUB-08 | Empty public catalog | no published items |
| PUB-09 | Missing media | neutral placeholder |
| PUB-10 | Public maintenance | branded maintenance without catalog data |

### J. Publish, QR, and Share

| ID | Screen | State yang harus dibuat |
|---|---|---|
| PBL-01 | Pre-publish checklist | ready, blockers, warnings |
| PBL-02 | Publishing | progress and non-blocking explanation |
| PBL-03 | Publish success | version, timestamp, view links |
| PBL-04 | Publish failed | old live version preserved, retry |
| PBL-05 | Publish history | current, previous, restore confirmation |
| PBL-06 | Unpublish | confirmation and maintenance consequence |
| SHR-01 | QR and links | tablet, mobile, copy, download |
| SHR-02 | QR empty | no published catalog |
| SHR-03 | Link copied | compact success feedback |

### K. Analytics

| ID | Screen | State yang harus dibuat |
|---|---|---|
| ANL-01 | Analytics summary | views, opens, popular items, source |
| ANL-02 | New catalog | zero-data state |
| ANL-03 | Partial data | delayed rollup or unavailable period |
| ANL-04 | Date/filter | 7/30/90 days, outlet/catalog |
| ANL-05 | Popular items | ranked list, no ranking |
| ANL-06 | Source summary | QR, Bio link, direct |

Analytics harus tetap ringkas. Tidak menampilkan visitor-level data atau raw personal activity.

### L. Team, Subscription, and Support

| ID | Screen | State yang harus dibuat |
|---|---|---|
| TMS-01 | Team list | owner/editor, empty editor |
| TMS-02 | Invite | form, sending, sent, expired |
| TMS-03 | Permission denied | editor tries owner-only action |
| SUB-01 | Trial status | day count, 3-day warning, expired |
| SUB-02 | Plan choice | monthly/yearly |
| SUB-03 | Payment state | pending, paid, failed |
| SUB-04 | Quota state | near limit, reached |
| SUP-01 | Support list | empty, open, resolved |
| SUP-02 | Support form | submit, success, failure |

## 8. Universal State Matrix

Setiap feature wajib memilih state yang relevan dari matrix ini.

| State | Pattern UI | ImageGen asset? |
|---|---|---|
| Default | real component | tidak |
| Hover/focus/pressed | component token | tidak |
| Loading page | skeleton menjaga layout | tidak |
| Loading action | spinner + verb aktif | tidak |
| Upload progress | progress bar + queue row | tidak |
| Processing media | code-native placeholder | optional micro illustration |
| Empty-first-use | illustration + one primary action | ya |
| Empty-filter | icon + clear filter | tidak |
| Zero search | compact illustration/glyph | optional |
| Validation error | inline field error | tidak |
| Server error | illustration + retry/reference ID | ya |
| Offline | illustration + cached-state copy | ya |
| Permission denied | illustration + back action | ya |
| Success | toast for small action, illustration for milestone | milestone saja |
| Warning | inline/banner | tidak |
| Destructive confirm | modal + explicit object name | optional compact illustration |
| Maintenance | full public/account state | ya |
| Quota reached | contextual locked state | ya |
| Session expired | modal/auth screen | optional |

Loading tidak boleh dibuat sebagai gambar statis. Skeleton harus mengikuti ukuran layout aktual agar tidak terjadi layout shift.

## 9. Asset Production Matrix

### Generated With ImageGen

| Family | Master size | Export target | Jumlah awal | Penggunaan |
|---|---:|---:|---:|---|
| Onboarding scenes | 1600 x 1200 | 800 x 600 WebP | 4 | welcome, first menu, appearance, publish |
| Empty states | 1200 x 900 | 480 x 360 / 320 x 240 | 8 | catalog, category, item, option, media, analytics, team, search |
| Error/attention states | 1200 x 900 | 480 x 360 / 320 x 240 | 6 | server, offline, permission, upload, publish, quota |
| Success milestones | 1200 x 900 | 480 x 360 / 320 x 240 | 5 | trial, first item, font, publish, QR |
| Maintenance scene | 1536 x 1024 | responsive WebP | 2 | public and account |
| Category glyph | 512 x 512 | 96, 64, 48 WebP/PNG | 12 | demo template categories |
| Promo/trial micro asset | 768 x 512 | 384 x 256 | 3 | dashboard rail |
| Demo offering photo | 1600 x 1200 | 800 x 600 WebP | 24 | coffee/F&B demo |
| Demo service photo | 1600 x 1200 | 800 x 600 WebP | 12 | photobooth/salon/service demo |
| Demo video thumbnail | 1280 x 720 | 640 x 360 WebP | 8 | offering video preview |
| Editorial line accent | 1200 x 300 | responsive WebP | 3 | sparse decoration |

### Must Be Code-Native

- Navigation/action icons.
- Loading spinner and skeleton.
- Toast, banner, badge, chip, progress, toggle, checkbox, segmented control.
- Chart, QR, calendar, pagination, table, filter, search.
- Focus rings and accessibility states.
- Missing-image placeholder frame.
- Status and permission symbols.
- Product logo lockup unless a separate logo exploration is approved.

## 10. Proposed Initial Asset Set

### Empty States

1. `empty-catalog`: owner berdiri di depan papan menu kosong.
2. `empty-category`: rak label kategori belum diisi.
3. `empty-item`: tray/display kosong siap menerima produk.
4. `empty-option`: kartu pilihan/add-on belum terhubung.
5. `empty-media`: frame foto dan video kosong.
6. `empty-analytics`: chart bertunas setelah menu dibagikan.
7. `empty-team`: satu owner menyiapkan kursi untuk rekan.
8. `empty-search`: kaca pembesar di antara card menu.

### Error and Attention

1. `error-server`: menu board terputus tetapi data tetap aman.
2. `error-offline`: tablet tanpa koneksi dengan cached preview cue.
3. `error-permission`: kunci/role boundary yang ramah.
4. `error-upload`: foto/video tidak lolos tray upload.
5. `error-publish`: jalur publish terhenti; live menu lama tetap berdiri.
6. `error-quota`: rak media penuh, tidak menggambarkan kehilangan data.

### Success and Confirmed

1. `success-trial`: workspace aktif 14 hari.
2. `success-first-item`: satu card produk sudah terisi.
3. `success-font`: karakter huruf brand masuk ke preview.
4. `success-publish`: draft berpindah aman ke display tablet dan mobile.
5. `success-qr`: jalur QR menghubungkan tablet/mobile.

### Maintenance

1. `maintenance-public`: storefront ditutup sementara, tanpa menampilkan catalog.
2. `maintenance-account`: owner melihat status account dan jalur bantuan.

## 11. ImageGen Preview Strategy

### Rule 1 - Lock Direction Before Coverage

Jangan generate puluhan screen sebelum bahasa visual dipilih. Sesi visual pertama harus menghasilkan tepat tiga preview independen untuk screen yang sama: owner overview 1440 x 1024.

Tiga arah:

1. `Ink Lime Studio`: sidebar ink, lime active, cream canvas, editorial line art.
2. `Pastel Counter`: sidebar light/ink rail, semantic pastel blocks, contextual right rail.
3. `Editorial Cafe Ops`: warm canvas, stronger typography, illustration-first attention panel, restrained black action.

Ketiganya harus memakai feature, copy, dan data yang sama agar pemilihan benar-benar membandingkan visual system.

### Rule 2 - Generate Anchor Screens

Setelah satu arah dipilih:

1. Owner overview desktop.
2. Item list desktop.
3. Item editor desktop.
4. Appearance dual preview.
5. Pre-publish checklist.
6. Analytics summary.
7. Store Display tablet.
8. Store item detail.
9. Bio Menu mobile.
10. Bio item detail.

Anchor screens mengunci grid, component style, typography, public branding, dan density.

### Rule 3 - Generate Workflow Families

Generate per workflow, bukan per feature secara acak:

- Auth -> verification -> provisioning -> trial.
- Onboarding -> first item -> appearance -> preview -> publish.
- Catalog -> category -> item -> add-on -> media.
- Draft -> preview -> publish -> QR/share.
- Analytics -> subscription -> team/support.
- Public browse -> search -> detail -> unavailable/maintenance.

### Rule 4 - Generate State Sheets Only After Component Lock

State sheet boleh dibuat sesudah selected direction direkonstruksi di Figma/kode. Full-screen state sheet dari ImageGen hanya untuk mood dan illustration placement, bukan spesifikasi komponen.

### Rule 5 - Asset-Only Generation Last

Ilustrasi final dibuat setelah:

- palette disetujui;
- style direction dipilih;
- area aset pada layout memiliki ukuran nyata;
- light/dark backdrop diketahui;
- filename dan role masuk asset manifest.

## 12. Prompt System

### Master UI Preview Prompt

```text
Use case: ui-mockup
Asset type: SagaMenu product UI preview
Primary request: Design the requested SagaMenu screen as a real operational SaaS interface, not a marketing page and not a device mockup.
Product: SagaMenu, an Indonesian preview-only e-menu and e-catalog builder for restaurants, coffee shops, photobooths, salons, and service businesses.
User goal: Let an owner manage catalog content and let customers browse menu details without ordering.
Visual DNA: SagaMenu Fun Ops v1; warm operational canvas, deep ink navigation, white surfaces, semantic pastel blocks, restrained lime accent, editorial cut-paper micro illustrations with soft black outlines and subtle grain.
Layout: exact target frame <WIDTH x HEIGHT>; stable grid; cards have 7-8 px radius; no nested cards; dense but readable; clear primary action; realistic spacing.
Typography: Manrope-like UI type, readable Indonesian labels, zero letter spacing.
Color palette: #171D1A, #F3F5F1, #FFFFFF, #236354, #B34F32, #CBF45A, #F4D35E, #E9A7CB, #A9C6F5, #CDEBDD.
Content constraints: preview-only; no WhatsApp order, cart, quantity control, checkout, payment CTA, or POS controls.
Reference images: use all six attached references as moodboard inspiration only; do not copy their logos, text, brand identities, or exact compositions.
Avoid: gradient orbs, bokeh, glassmorphism, huge rounded cards, excessive shadows, illegible microcopy, floating marketing sections, duplicated cards, purple-dominated palette, decorative charts, clipped text, UI inside a laptop/phone frame.
```

Tambahkan blok spesifik screen:

```text
Screen: <ID and name>
Required regions: <ordered layout zones>
Required states: <state>
Visible copy: <short exact Indonesian labels>
Primary action: <one command>
Secondary actions: <commands>
Data density: <low/medium/high>
```

### Master Illustration Prompt

```text
Use case: stylized-concept
Asset type: SagaMenu <empty/error/success/onboarding> illustration
Primary request: Create one isolated editorial illustration for <STATE>.
Subject: <specific scene and objects>.
Style/medium: SagaMenu Fun Ops v1, editorial cut-paper 2D, soft black outline, simple geometric shapes, subtle paper grain, friendly but professional.
Composition: centered subject, generous padding, readable at 320 px, no tiny disconnected objects, no cropped edges.
Color palette: ink #171D1A, primary #236354, terracotta #B34F32, lime #CBF45A, yellow #F4D35E, pink #E9A7CB, blue #A9C6F5, mint #CDEBDD.
Scene/backdrop: perfectly flat solid chroma-key background selected for removal.
Constraints: no words, no letters, no UI, no logo, no watermark, no photorealism, no gradients, no cast shadow, no background decoration.
```

Untuk alpha, gunakan built-in ImageGen dengan chroma-key lalu jalankan helper removal. Jangan mengandalkan instruksi “transparent background” saja.

### Master Category Glyph Prompt

```text
Use case: stylized-concept
Asset type: SagaMenu category glyph
Primary request: Create one isolated category glyph representing <CATEGORY>.
Style/medium: simple editorial cut-paper 2D with soft black outline and two or three flat brand colors.
Composition: centered, front-facing, bold silhouette, readable at 48 px, equal visual weight with the rest of the set.
Constraints: no text, no badge container, no UI, no logo, no watermark, no cast shadow, no extra props.
```

## 13. Prompt Consistency Rules

- Setiap aset hanya memiliki satu subject utama.
- Jangan menggabungkan 2D line art, clay 3D, dan photorealism dalam satu illustration family.
- Gunakan seed/reference consistency melalui aset terpilih sebagai style reference pada call berikutnya.
- Satu call per aset atau per varian; jangan meminta contact sheet berisi banyak aset.
- Full-screen ideation: tepat tiga call independen dan tunggu pilihan user.
- Teks di mockup dibuat sesingkat mungkin. Copy final ditambahkan saat rekonstruksi Figma/kode.
- Aset tidak boleh memuat logo atau brand milik referensi.
- Product photography demo dipisah dari state illustration.
- Masing-masing prompt mencantumkan ukuran target dan posisi aset dalam screen.

## 14. Placement Rules

### Dashboard

- Illustration tidak lebih dari 180 x 140 px pada desktop overview.
- Satu hero/milestone asset maksimum per viewport.
- Empty-state asset 240-320 px tinggi di panel utama.
- Error asset 160-240 px; error copy dan recovery action tetap dominan.
- Category glyph 40-56 px pada tile; 24-32 px pada chip.

### Public Menu

- Product image selalu lebih besar daripada illustration.
- Illustration hanya untuk empty, maintenance, missing catalog, atau demo cover.
- Maintenance art maksimum 40% viewport; status copy tetap terlihat tanpa scroll.
- Missing image memakai code-native neutral placeholder agar tidak tampak seperti produk tertentu.

### Auth

- Desktop boleh split 55/45 dengan form minimum 420 px.
- Mobile hanya form dan micro illustration maksimum 120 px.
- Error auth tidak menggunakan karakter dramatis; gunakan inline message dan generic account-safe copy.

## 15. Naming and File Structure

```text
resources/assets/sagamenu/
  illustrations/
    onboarding/
    empty/
    error/
    success/
    maintenance/
  glyphs/
    categories/
  demo/
    offerings/
    services/
    video-thumbnails/
  accents/
```

Naming:

```text
sm-<family>-<state-or-subject>-<variant>-v01.<ext>
```

Contoh:

- `sm-empty-catalog-owner-v01.webp`
- `sm-error-publish-safe-live-v01.webp`
- `sm-success-publish-dual-surface-v01.webp`
- `sm-glyph-category-coffee-v01.webp`

## 16. Image Optimization

- Master disimpan sebagai PNG bila membutuhkan alpha.
- Delivery memakai WebP; AVIF dapat ditambahkan setelah browser QA.
- Illustration desktop target 80-180 KB.
- Illustration mobile target 40-100 KB.
- Demo photo target 120-220 KB per 800 x 600.
- Video thumbnail target 80-160 KB.
- Gunakan `srcset`, explicit width/height, lazy loading, dan `object-fit`.
- Jangan memuat illustration milestone di atas fold jika screen tidak membutuhkannya.

## 17. Acceptance Gates

### Visual Gate

- Terlihat sebagai satu produk, bukan gabungan enam template.
- Dashboard tetap operasional dan tidak berubah menjadi landing page.
- Pastel dipakai secara semantic.
- Tidak ada layout overlap atau text clipping.
- Foto offering tetap menjadi visual utama public menu.

### UX Gate

- Primary action dapat ditemukan dalam 3 detik.
- Owner dapat menyelesaikan edit harga, sold out, preview, dan publish.
- Preview-only boundary jelas.
- State recovery memiliki tindakan konkret.
- Destructive action menyebut objek dan konsekuensi.

### Accessibility Gate

- Text contrast minimum WCAG AA.
- Focus state terlihat.
- Touch target minimum 44 x 44 px di public/mobile.
- Warna bukan satu-satunya pembeda status.
- Illustration memiliki alt text atau `alt=""` bila dekoratif.
- `prefers-reduced-motion` dihormati.

### Technical Gate

- Tidak ada action icon raster.
- Alpha asset tervalidasi tanpa chroma fringe.
- Asset tidak memuat teks penting.
- Width/height dan loading strategy dideklarasikan.
- Bundle dan Core Web Vitals tidak rusak oleh aset.
- Semua screen diuji pada desktop 1440 x 1024, tablet 1194 x 834/1024 x 768, dan mobile 390 x 844.

### Product Gate

- Tidak ada order/cart/checkout/WhatsApp order.
- Tidak ada visitor-level analytics.
- Restricted account tidak membocorkan catalog.
- Failed publish menjelaskan bahwa live snapshot lama tetap aktif.
- Trial, plan, dan account state memakai data canonical, bukan asumsi client.

## 18. Recommended Production Order

### Batch 0 - Style Calibration

- Tiga owner overview direction.
- Pilih satu.
- Catat keputusan palette, sidebar, typography, illustration, dan density.

Status: selesai. Editorial KV Ops refinement nomor 2 dipilih.

### Batch 1 - Core Anchors

- 10 anchor screens.
- Review desktop/tablet/mobile sebagai satu keluarga.
- Rekonstruksi komponen inti di Figma/kode.

### Batch 2 - Owner Workflow

- Auth/onboarding.
- Catalog/category/item/options/media.
- Appearance/preview/publish.

### Batch 3 - Public Workflow

- Store Display.
- Bio Menu.
- Detail, search, unavailable, maintenance.

### Batch 4 - Operational Workflow

- Analytics.
- Team.
- Subscription.
- Support.
- Permission and quota.

### Batch 5 - Asset Production

- Empty states.
- Errors.
- Success milestones.
- Maintenance.
- Category glyph.
- Demo content.

### Batch 6 - Design QA

- Screenshot comparison.
- Responsive checks.
- State coverage audit.
- Accessibility check.
- Asset weight/performance check.

## 19. Definition of Ready for Image Generation

Satu job ImageGen baru boleh dimulai jika memiliki:

- asset/screen ID;
- target surface dan viewport;
- tujuan user;
- state;
- required regions;
- ukuran target;
- visual DNA version;
- reference image role;
- exact copy bila benar-benar perlu;
- avoid list;
- output destination;
- acceptance reviewer.

## 20. Immediate Next Action

Visual direction sudah dipilih. Langkah berikutnya adalah membuat anchor preview pack dengan urutan:

1. Store Display home, 1194 x 834.
2. Bio Menu home, 390 x 844.
3. Item detail untuk Store Display.
4. Item detail untuk Bio Menu.
5. Owner item editor, 1440 x 1024.
6. Appearance dual preview, 1440 x 1024.
7. Pre-publish checklist dan publish result, 1440 x 1024.

Setelah anchor pack konsisten, selected direction direkonstruksi menjadi design tokens dan komponen pada prototype Vercel. Aset P0 baru digenerate berdasarkan slot nyata dari prototype tersebut. Jangan generate seluruh asset library sebelum anchor pack dan component dimensions dikunci.
