# SagaMenu UI/UX and Feature Deep Research

**Tanggal:** 29 Juli 2026
**Status:** Research baseline untuk perencanaan. Bukan klaim staging-ready atau production-ready.
**Produk:** SagaMenu, e-menu dan e-catalog preview-first untuk Bio Menu mobile dan Store Display tablet.
## 1. Ringkasan Eksekutif

SagaMenu sudah memiliki fondasi produk yang lebih matang daripada prototype SaaS biasa: katalog, kategori, add-on, media foto/video, preset tampilan, custom font, dua public surface, maintenance mode, publish snapshot, analytics agregat, serta model organisasi/outlet dan role di backend. Masalah utamanya bukan kekurangan layar, melainkan ketidakseimbangan antara **editorial setup experience** dan **operasi harian outlet**.

Tiga kebutuhan terpenting berikutnya adalah:

1. **Quick Operations:** owner atau staff harus dapat mengubah harga, ketersediaan, visibilitas, dan kategori beberapa item tanpa membuka editor panjang satu per satu.
2. **Publish Confidence:** sebelum publish, user harus memahami secara tepat apa yang berubah, surface mana yang terdampak, dan apa yang masih bermasalah.
3. **Fast Customer Discovery:** katalog panjang harus tetap mudah dipindai melalui kategori sticky di atas, search, filter kebutuhan makan, deep link, serta performa media yang terjaga.

Rekomendasi strategisnya adalah memperdalam SagaMenu sebagai **content operations system untuk menu publik**, bukan memperluasnya menjadi POS, ordering, cart, checkout, loyalty, atau CRM.

## 2. Batas Produk yang Dipertahankan

### Tetap menjadi bagian SagaMenu

- Customer melihat katalog tanpa login, nomor telepon, atau instalasi aplikasi.
- Bio Menu mobile untuk link in bio dan QR personal.
- Store Display tablet untuk perangkat di outlet.
- Kategori tetap berada di atas menu publik.
- Detail item berisi foto, video manual-play, deskripsi, harga, varian, add-on, allergen, dan dietary information.
- Dashboard mengelola konten, branding, preview, publish, QR/share, outlet, team, serta analytics agregat.
- Perubahan bersifat draft sampai user menerbitkan snapshot.
- Data katalog dan visitor analytics granular tetap berada di database produk.

### Bukan bagian SagaMenu

- Cart, checkout, pemesanan WhatsApp, POS, kitchen display, pembayaran, dan delivery.
- Forced login atau pengumpulan nomor telepon untuk melihat menu.
- Autoplay video bersuara.
- Visitor profiling atau personalisasi berbasis identitas.
- Pemindahan konten katalog, media, search term, atau visitor-level analytics ke Saga Platform.

## 3. Metode dan Bukti

Riset ini menggabungkan:

- audit source prototype dan fondasi Laravel;
- screenshot review pada desktop 1440 px dan mobile 390 px;
- end-to-end test prototype live;
- benchmark produk link-in-bio, digital menu, dan catalog management;
- WCAG 2.2 serta Core Web Vitals;
- sinyal komunitas sebagai hipotesis, bukan bukti kuantitatif.

### Validasi prototype saat riset

Pada 29 Juli 2026:

- suite `qa:sprints9-17` lulus seluruh 5 tugas pilot;
- suite E2E utama lulus create wizard, edit, upload file, duplicate, protected delete, appearance, maintenance, publish failure, publish success, analytics, serta public preview;
- tidak ditemukan horizontal overflow pada viewport desktop dan mobile yang diuji;
- tidak ditemukan console error atau page error;
- video tidak autoplay;
- pilot export tidak memuat field PII yang dilarang.

Prototype masih memakai browser storage dan data demonstrasi. Hasil ini adalah **local/prototype evidence**, bukan bukti integrasi Laravel, object storage, queue, email, billing, atau deployment production.

## 4. Current-State Map

| Area | Status | Bukti dan interpretasi |
|---|---|---|
| Menu list, search, category/status filter | VERIFIED prototype | `prototype-vercel/app.js:825`, rapi untuk lookup tetapi belum mendukung bulk action atau inline editing. |
| Create menu | VERIFIED prototype | Empat langkah dengan draft recovery, upload file, media, add-on, varian, dan review. |
| Edit menu | VERIFIED prototype | Focused edit tanpa mengulang wizard; section navigation tersedia. |
| Availability per item | VERIFIED prototype | Satu tombol per row untuk available/sold out. Belum ada multi-select. |
| Category ordering/visibility | VERIFIED prototype | Category rail, visibility toggle, up/down controls. |
| Media library | VERIFIED prototype | Search, usage filter, missing-alt state, image/video. Processing state dan bulk cleanup belum matang. |
| Appearance and presets | VERIFIED prototype | Identitas, tipografi, bentuk, preset, custom font, preview tablet/mobile. |
| Publish safety | VERIFIED prototype | Preflight, draft/live separation, safe failure, version history preview. Diff masih berupa ringkasan generik. |
| Public mobile/tablet | VERIFIED prototype | Search, category rail di atas, cards, detail, media/video, maintenance. |
| Analytics | VERIFIED prototype demo | Period 7/30/90, views, detail opens, search, QR, channel. Datanya fixture-like dan insight belum actionable. |
| Organization, location, membership | VERIFIED backend foundation | Model/migration tersedia, tetapi prototype belum menunjukkan workflow multi-outlet dan permission secara lengkap. |
| Immutable snapshot and restore | VERIFIED backend foundation | Fondasi publish/version tersedia; exposure UI perlu diperdalam. |
| QR routes | VERIFIED backend foundation | Distribusi QR tersedia; source labeling, branded export, dan scan validation belum menjadi workflow utuh. |
| Custom domain lifecycle | UNAVAILABLE | Belum ditemukan flow DNS verification, certificate, status, dan rollback yang lengkap. |
| Content translation | UNAVAILABLE | Locale organisasi tidak sama dengan translated content per field/surface. |
| Bulk catalog operations | UNAVAILABLE | Tidak ditemukan selection model, batch mutation, atau bulk undo. |
| Catalog import | UNAVAILABLE | Tidak ditemukan CSV/XLSX mapping, validation, dan import preview. |

## 5. Evaluasi UI/UX per Journey

### 5.1 Dashboard

**Yang baik**

- Hierarki editorial kuat dan lebih berkarakter dibanding admin SaaS generik.
- Preview dan “Perlu perhatian” memiliki prioritas lebih tinggi daripada chart dekoratif.
- Trial, draft, media, dan publish state mudah ditemukan.

**Yang perlu diperbaiki**

- “Perlu perhatian” harus berasal dari validator nyata, bukan angka demonstrasi.
- Setiap attention item perlu target tindakan, owner, severity, dan status penyelesaian.
- Multi-outlet membutuhkan business/outlet switcher yang lebih eksplisit.
- Pilot mode harus role-gated dan tidak muncul pada workspace customer production.

### 5.2 Menu and Catalog

**Yang baik**

- Tabel dapat dipindai, status jelas, dan row action tidak berlebihan.
- Edit, duplicate, delete, dan toggle availability telah dibedakan.
- Search dan filter sudah memberi fondasi operasional.

**Yang perlu diperbaiki**

- Tidak ada checkbox selection dan batch action.
- Perubahan harga/kategori/status masih membutuhkan terlalu banyak perpindahan konteks.
- Filter belum dapat disimpan sebagai view, misalnya “Sold out hari ini” atau “Foto belum lengkap”.
- Toast bertumpuk dapat menutup area kerja pada operasi beruntun.
- Mobile admin tidak seharusnya memampatkan seluruh desktop editor; perlu mode kerja cepat tersendiri.

### 5.3 Create and Edit

**Yang baik**

- Create dan edit sudah memiliki mental model berbeda.
- Create menggunakan progressive disclosure; edit membuka section yang relevan.
- Upload file menggantikan field URL.
- Preview langsung dan draft recovery mengurangi ketakutan kehilangan data.

**Yang perlu diperbaiki**

- Pada editor panjang, preview kanan perlu sticky dan tersinkron dengan section aktif.
- Preview membutuhkan toggle `Card` dan `Detail`, bukan hanya device.
- User perlu melihat field mana yang berubah dari versi live.
- Media processing, crop/focal point, alt text, video caption/transcript, dan retry perlu status yang lebih jelas.
- Variants/add-ons membutuhkan preview struktur sebelum disimpan.

### 5.4 Appearance and Branding

**Yang baik**

- Editor kiri dan preview besar kanan mendukung exploratory design.
- Bio Menu dan Store Display memiliki preset berbeda, tetapi tetap memakai data katalog yang sama.
- Custom font dan fallback telah dipertimbangkan.

**Yang perlu diperbaiki**

- Hubungan `Simpan tampilan` dengan `Terbitkan` perlu ditunjukkan sebagai draft lifecycle yang sama.
- Perlu contrast check, fallback preview, dan peringatan font licensing/format/weight.
- Preset membutuhkan thumbnail yang mewakili konten nyata, bukan hanya bentuk abstrak.
- Perlu preview locale, teks panjang, missing image, sold-out, dan low-quality media.
- Perubahan preset harus menampilkan dampak terhadap crop, density, dan keterbacaan.

### 5.5 Publish and Versioning

**Yang baik**

- Draft tidak langsung mengganti versi live.
- Safe failure menjaga versi lama tetap aktif.
- Scope Bio Menu dan Store Display terlihat.

**Yang perlu diperbaiki**

- “7 perubahan” harus dapat dibuka menjadi before/after per field.
- User perlu membatalkan perubahan tertentu tanpa membuang seluruh draft.
- Version history perlu preview versi lama, change author, note, dan restore impact.
- Publish gate harus menggunakan hasil catalog health aktual.
- Perlu scheduled publish dan timezone, tetapi setelah immediate publish stabil.

### 5.6 Public Customer Experience

**Yang baik**

- Mobile-native, tanpa PDF pinch/zoom dan tanpa forced account.
- Category rail berada di atas.
- Search mencakup nama, deskripsi, rasa, dan bahan.
- Foto dominan, detail informatif, dan video tidak autoplay.

**Yang perlu diperbaiki**

- Category rail panjang membutuhkan overflow menu dan sticky behavior yang stabil.
- Tambahkan filter allergen/dietary yang informatif, bukan kontrol order.
- Search harus memiliki zero-result recovery dan clear button.
- Deep link ke kategori/item dibutuhkan untuk promo dan social sharing.
- Scroll position harus pulih setelah menutup detail.
- Katalog besar membutuhkan responsive image variants, lazy loading, dan pagination/virtualization yang tidak merusak browse flow.
- Video memerlukan caption/transcript atau ringkasan tekstual.

### 5.7 Analytics

**Yang baik**

- Metrik berfokus pada discovery: views, detail opens, search, QR, dan channel.
- Tidak memerlukan identitas visitor.

**Yang perlu diperbaiki**

- Pisahkan performa Bio Menu dan Store Display.
- Tambahkan QR source label seperti counter, table, entrance, Instagram, dan Google Business.
- Tampilkan zero-result search, item detail opens, video plays, dan catalog health trend.
- Insight harus dapat ditindaklanjuti dan menjelaskan basis datanya.
- Empty state perlu menjelaskan kapan data akan tersedia dan bagaimana event dihitung.

## 6. Temuan Benchmark

### 6.1 Link-in-bio builders

[Linktree themes](https://linktr.ee/help/en/articles/5434137-choose-a-theme-for-your-linktree) memakai live preview yang selalu dekat dengan editor. [Link management](https://linktr.ee/help/en/collections/7076346-link-features-management) menekankan reorder, hide, archive, schedule, collection, dan layout per link. [Workspaces](https://linktr.ee/help/en/articles/13007538-manage-your-linktrees-and-teams-with-workspaces) memperlihatkan pentingnya scope akses dan publish terjadwal. [QR customization](https://linktr.ee/help/en/articles/5434152-create-a-qr-code-for-your-linktree) menunjukkan ekspektasi export PNG/SVG, warna/logo, dan scan count.

**Pelajaran untuk SagaMenu**

- Pertahankan live preview besar.
- Tambahkan schedule, collection-level visibility, dan QR source management.
- Jangan meniru generic block builder; SagaMenu harus tetap opinionated untuk struktur menu.

### 6.2 Digital menu products

[Menu Tiger](https://www.menutiger.com/features), [My Menu](https://www.mymenu.ee/), [MustHaveMenus](https://www.musthavemenus.com/feature/restaurant-digital-marketing.html), dan [Scanova](https://scanova.ma/en/guides/qr-menu) memperlihatkan pola yang berulang: update real-time, multi-language, dietary/allergen information, branded dynamic QR, multi-location, serta analytics. Sebagian kompetitor juga menawarkan ordering; bagian itu tidak perlu diadopsi karena bertentangan dengan boundary SagaMenu.

**Pelajaran untuk SagaMenu**

- Multi-language, accessibility, dan multi-outlet adalah kebutuhan scale yang relevan.
- Availability harus dapat diubah sangat cepat ketika outlet sibuk.
- QR bukan sekadar gambar; QR adalah distribution object dengan tujuan, label sumber, status, dan analytics.

### 6.3 Catalog operations

[Shopify bulk editor](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing) menggunakan pola memilih row dan property yang ingin diedit bersama. Ini cocok untuk katalog SagaMenu, selama UI tetap dibatasi pada properti operasional seperti availability, visibility, price, badge, dan category.

**Pelajaran untuk SagaMenu**

- Bulk action adalah fungsi operasional, bukan fitur enterprise tambahan.
- Batch edit harus memiliki preview perubahan, undo, dan audit log.

### 6.4 Standards

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) menambah perhatian pada focus visibility, target size, consistent help, redundant entry, dan accessible authentication. Target minimum baru adalah 24 x 24 CSS px pada kondisi yang dijelaskan dalam WCAG 2.2.

[Core Web Vitals](https://support.google.com/webmasters/answer/9205520?hl=en) menggunakan ambang “good” pada persentil ke-75: LCP maksimal 2,5 detik, INP maksimal 200 ms, dan CLS maksimal 0,1.

**Pelajaran untuk SagaMenu**

- Accessibility dan performance harus menjadi release gate, bukan polish terakhir.
- Public menu yang kaya foto/video harus memiliki asset budget dan real-device test.

## 7. Opportunity Map

### Job 1: “Saya harus mengubah menu saat outlet sedang sibuk”

Hambatan sekarang:

- edit item satu per satu;
- tidak ada bulk availability/price/category action;
- admin mobile masih membawa kompleksitas editor penuh.

Peluang:

- Quick Ops mode;
- saved filter;
- multi-select;
- batch action;
- undo dan change summary.

### Job 2: “Saya ingin yakin draft aman sebelum customer melihatnya”

Hambatan sekarang:

- diff masih ringkasan;
- quality issues belum berasal dari validator lengkap;
- restore/version history belum menjadi workflow utama.

Peluang:

- Draft Changes Center;
- field-level diff;
- Catalog Health;
- selective discard;
- preview old version and restore.

### Job 3: “Customer harus cepat menemukan yang cocok”

Hambatan sekarang:

- kategori panjang berpotensi overflow;
- belum ada dietary/allergen filter;
- belum ada deep link dan zero-result recovery;
- performa katalog besar belum memiliki budget formal.

Peluang:

- sticky category navigator;
- filter informatif;
- deep link;
- search recovery;
- responsive media pipeline.

### Job 4: “Satu brand harus mudah dikelola di beberapa outlet”

Hambatan sekarang:

- fondasi outlet dan role sudah ada, tetapi UI scope belum jelas;
- belum ada propagate/override/conflict flow.

Peluang:

- scope selector;
- duplicate/template catalog;
- per-outlet override;
- role-aware publish approval.

## 8. Prioritas Produk

Skor memakai empat dimensi internal: dampak user, frekuensi penggunaan yang diharapkan, pengurangan risiko, dan kompleksitas. Frekuensi masih hipotesis sampai pilot manusia selesai.

| Rank | Inisiatif | Prioritas | Alasan |
|---:|---|---|---|
| 1 | Quick Ops dan bulk edit | P0 | Mengurangi waktu operasi harian dan membuka penggunaan mobile admin yang realistis. |
| 2 | Draft Changes Center dan field diff | P0 | Mengurangi salah publish dan meningkatkan kepercayaan user. |
| 3 | Catalog Health validator | P0 | Mengubah “Perlu perhatian” menjadi tindakan nyata. |
| 4 | Long-catalog navigation dan search recovery | P0 | Berdampak langsung pada customer discovery. |
| 5 | Public performance/media budget | P0 | Foto/video adalah inti produk sekaligus risiko performa terbesar. |
| 6 | Multi-language content | P1 | Membuka hospitality dan service catalog dengan audience lebih luas. |
| 7 | Accessibility and dietary information | P1 | Memperbaiki inclusion dan kejelasan pilihan customer. |
| 8 | QR and Share Hub | P1 | Menghubungkan distribusi, attribution, dan surface secara operasional. |
| 9 | Scheduled visibility/publish | P1 | Berguna untuk promo, seasonal menu, dan jam outlet. |
| 10 | Multi-outlet propagation and overrides | P1 | Fondasi backend sudah ada; UI adalah gap untuk SaaS scale. |
| 11 | Role-aware collaboration and history | P1 | Mengurangi risiko perubahan lintas staff. |
| 12 | Analytics to Action | P1 | Mengubah data agregat menjadi keputusan konten. |
| 13 | CSV/XLSX import with mapping | P2 | Mempercepat migrasi katalog, tetapi bukan kebutuhan sebelum editing inti kuat. |
| 14 | Curated vertical presets | P2 | Membantu onboarding sesudah sistem preset dan content migration aman. |
| 15 | Custom domain | P2/Blocked | Membutuhkan lifecycle DNS, TLS, ownership verification, support, dan rollback. |

## 9. Detail Fitur yang Direkomendasikan

### P0. Quick Operations

- Row checkbox dan select all filtered.
- Inline edit untuk price, category, badge, availability, dan visibility.
- Batch action bar dengan affected-item count.
- Saved views: sold out, draft changed, missing media, missing alt, by category.
- Shift Mode mobile: search, filter, availability, price, dan publish shortcut saja.
- Undo toast yang tidak menutupi row target.
- Satu batch menghasilkan satu audit record dan satu draft change group.

### P0. Draft Changes Center

- Group perubahan: content, pricing, availability, structure, appearance, media.
- Field-level before/after.
- Filter per outlet, author, surface, dan severity.
- Discard one change, discard group, atau keep all.
- Preview draft vs live dengan synchronized scroll.
- Publish note dan optional approval untuk role editor.

### P0. Catalog Health

- Missing name, category, price, description, image, alt text.
- Broken image/video, unsupported format, oversized media, processing failure.
- Missing video caption/transcript.
- Contrast/font fallback issue.
- Empty category dan hidden category with live items.
- Scheduled item conflict dan outlet override conflict.
- Blocking vs warning classification.

### P0. Public Discovery

- Sticky category bar di atas.
- Overflow “Kategori lain” untuk category rail panjang.
- Search with clear, zero-result recovery, dan suggested categories.
- Dietary/allergen filters yang tidak mengubah produk menjadi ordering flow.
- Item/category deep links.
- Scroll restoration setelah detail ditutup.
- Image lazy loading, responsive sizes, thumbnail/poster variants, dan no-autoplay video.

### P1. Localization and Accessibility

- Locale switch pada public menu.
- Translation status per field dan fallback language.
- Preview per language dan long-text stress state.
- Alt text, caption/transcript, keyboard/focus test, reduced motion, contrast gate.
- Allergen/dietary vocabulary yang dapat disesuaikan tanpa klaim medis.

### P1. QR and Share Hub

- QR object mempunyai name, destination surface, outlet, campaign/source, status, dan active date.
- Export PNG dan SVG.
- Brand color/logo dengan contrast/scannability check.
- Link preview metadata untuk social sharing.
- Scan aggregate per source tanpa visitor identity.

### P1. Multi-outlet and Team

- Scope selector: outlet ini, outlet terpilih, semua outlet.
- Master catalog plus per-outlet override.
- Conflict review sebelum propagate.
- Permission matrix owner/manager/editor.
- Pending invitation, activity author, approval state, dan owner invariant.

### P1. Analytics to Action

- Surface split: Bio Menu versus Store Display.
- QR source breakdown.
- Detail-open rate, video play rate, zero-result search, sold-out views.
- Operational observations, misalnya “sering dibuka tetapi sold out”.
- Metric definitions dan data freshness.
- Tidak ada raw visitor identity dalam UI report.

## 10. Hal yang Harus Dipertahankan

- Editorial KV Ops sebagai bahasa visual admin.
- Sidebar yang tenang dan mudah dipindai.
- Preview lebih besar daripada control panel pada appearance/editor.
- Create wizard dan focused edit sebagai dua workflow berbeda.
- Category di atas public menu.
- Foto besar dengan detail drawer/modal.
- Draft/live separation dan safe publish failure.
- Maintenance screen yang aman.
- Plus Jakarta Sans sebagai default dashboard, dengan uploaded brand font hanya untuk surface yang dipilih.
- Video manual-play.
- Satu katalog untuk dua surface dengan preset independen.

## 11. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Scope melebar menjadi ordering platform | Gunakan product boundary sebagai acceptance gate setiap sprint. |
| Bulk edit menyebabkan perubahan massal yang salah | Preview batch, affected count, undo, audit group, dan role permission. |
| Multi-language menggandakan kompleksitas konten | Field fallback, translation status, dan satu canonical source. |
| Foto/video memperlambat menu publik | Asset budget, processing queue, responsive variants, lazy loading, CWV gate. |
| Analytics berubah menjadi visitor tracking | Event allowlist, aggregate reporting, retention policy, no PII. |
| Custom font merusak layout | Format/size/weight validation, fallback preview, timeout, dan contrast/readability gate. |
| Multi-outlet membingungkan ownership | Scope selector selalu terlihat dan publish summary menyebut outlet terdampak. |
| Prototype dianggap production-ready | Gate terpisah untuk Laravel integration, storage, queue, email, auth, security, staging, dan UAT. |

## 12. Success Metrics

Baseline harus diambil dalam Sprint 18. Target awal yang direkomendasikan:

- median waktu menandai 10 item sold out: maksimal 45 detik;
- median waktu mengubah harga 5 item: maksimal 90 detik;
- task success create menu lengkap: minimal 90%;
- task success edit satu field: minimal 95%;
- tidak ada accidental publish pada usability test;
- customer menemukan item target pada katalog 100 item: median maksimal 20 detik;
- zero-result search rate dapat diukur tanpa menyimpan PII;
- WCAG 2.2 AA pada critical flows;
- LCP maksimal 2,5 detik, INP maksimal 200 ms, CLS maksimal 0,1 pada persentil ke-75 ketika field data tersedia;
- tidak ada catalog content atau visitor-level analytics yang dikirim ke central report.

## 13. Research Gaps

Sebelum mengunci semua fitur P1, masih diperlukan:

1. Lima sesi usability dengan owner/manager/staff outlet.
2. Tiga sesi customer browse pada Bio Menu mobile.
3. Dua sesi customer browse pada tablet counter.
4. Pengukuran katalog 20, 100, dan 500 item.
5. Pengujian jaringan lambat dan perangkat Android kelas menengah.
6. Validasi vocabulary allergen/dietary bersama owner bisnis.
7. Validasi workflow multi-outlet dan approval dengan calon customer yang benar-benar memiliki lebih dari satu lokasi.

## 14. Source Map

### SagaMenu

- `prototype-vercel/app.js`
- `prototype-vercel/index.html`
- `prototype-vercel/styles.css`
- `prototype-vercel/scripts/qa.mjs`
- `prototype-vercel/scripts/qa-sprints-9-17.mjs`
- `docs/sagamenu-design-freeze-v1-2026-07-29.md`
- `docs/sagamenu-editorial-admin-large-preview-all-sprints-report-2026-07-26.md`
- `docs/saga-platform-integration-discovery.md`

### External

- [Linktree themes and live preview](https://linktr.ee/help/en/articles/5434137-choose-a-theme-for-your-linktree)
- [Linktree link management](https://linktr.ee/help/en/collections/7076346-link-features-management)
- [Linktree workspaces](https://linktr.ee/help/en/articles/13007538-manage-your-linktrees-and-teams-with-workspaces)
- [Linktree QR customization](https://linktr.ee/help/en/articles/5434152-create-a-qr-code-for-your-linktree)
- [Menu Tiger features](https://www.menutiger.com/features)
- [My Menu features](https://www.mymenu.ee/)
- [MustHaveMenus digital marketing](https://www.musthavemenus.com/feature/restaurant-digital-marketing.html)
- [Scanova QR menu guide](https://scanova.ma/en/guides/qr-menu)
- [Shopify bulk editor](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Core Web Vitals](https://support.google.com/webmasters/answer/9205520?hl=en)
