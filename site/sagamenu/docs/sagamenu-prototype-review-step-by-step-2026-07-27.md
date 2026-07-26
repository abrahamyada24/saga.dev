# SagaMenu Prototype Review Runbook

Date: 27 July 2026

Review target: `https://sagamenu-prototype-review.vercel.app`

Boundary: demo data is stored only in the current browser through `localStorage`.

## 1. Start from a Clean Demo

1. Open the review URL on desktop.
2. Click `Reset demo` in the black prototype strip.
3. Confirm the dashboard returns to Bachelor Coffee with 12 menu items.

## 2. Test Media Library

1. Open `Media Library`.
2. Search for a menu or switch the filter to unused assets.
3. Open `Edit alt` and change the alt text.
4. Upload a JPG, PNG, or WebP using `Unggah asset`.
5. Confirm the new image appears as an unused asset.
6. Delete that unused asset.
7. Try deleting an image used by a menu.

Expected: unused media can be removed; used media is protected.

## 3. Create a Basic Menu

1. Open `Menu & Katalog`.
2. Click `Tambah menu`.
3. Complete Step 1 with name, category, price, description, and availability.
4. Upload the primary photo in Step 2.
5. Continue through Step 3 without advanced details.
6. Review the summary in Step 4.
7. Click `Buat menu sebagai draft`.

Expected: the item returns to the list as a draft and is not public yet.

## 4. Create and Continue

1. Repeat the create flow.
2. On Review, click `Buat & tambah lagi`.

Expected: the first menu is saved and a fresh empty create wizard opens.

## 5. Edit a Complex Menu

1. Close the new wizard and edit `Es Kopi Susu Aren`.
2. Notice that Edit is a single workspace, not the four-step create wizard.
3. Open `Foto`; set alt text and focal point, then add one gallery photo.
4. Open `Pilihan & detail`.
5. Add a required `Ukuran` variant with Regular and Large.
6. Reorder the connected add-ons.
7. Expand food details and fill ingredients, allergens, dietary, and serving note.
8. Click `Simpan perubahan`.

Expected: the list updates as draft; public version remains safe until publish.

## 6. Test Category and Add-on Safety

1. Open `Kategori`, then edit `Signature`.
2. Review the usage impact in the side sheet.
3. Try deleting `Signature`.
4. Open `Add-on & Pilihan`, edit a used group, and review its usage.
5. Try deleting the used group.

Expected: in-use records cannot be silently deleted.

## 7. Test Guided Catalog Setup

1. Open `Tampilan`.
2. Click `Setup terpandu`.
3. Review the four steps: business, surfaces, colors, starter category.
4. Change the tagline or starter category.
5. Click `Simpan setup`.

Expected: the setup becomes a draft and does not publish automatically.

## 8. Test Brand Kit

1. Upload a logo.
2. Change primary, accent, paper, or ink colors.
3. Check the contrast result.
4. Change radius and image treatment.
5. Try uploading a non-WOFF file as a font.
6. Apply `Photo Grid` to Bio Menu and `Menu Board` to Store Display.
7. Click `Simpan tampilan`.
8. Apply another preset and click `Batalkan perubahan`.

Expected: invalid font is rejected, saved presets return after cancel, and public preview updates without publishing.

## 9. Compare Bio and Store

1. Use the large preview switch on `Tampilan`.
2. Open the topbar `Preview menu`.
3. Open `Bio Menu`; inspect category navigation, cards, and menu detail.
4. Return and open `Store Display`.
5. Confirm categories are above the menu and cards are larger.

Expected: both surfaces share the brand but keep independent layouts.

## 10. Test Publish Safety

1. Open `Preview & Terbitkan`.
2. Uncheck both public surfaces and try to publish.
3. Re-enable Bio Menu and Store Display.
4. Click `Uji safe failure`.
5. Confirm the previous public version stays active.
6. Click `Coba lagi`.

Expected: zero selected surfaces is blocked; retry finishes with a publication success state.

## 11. Test Mobile Dashboard

1. Open the same URL at about 390 px width or on a phone.
2. Open the navigation menu.
3. Review Media Library and open an alt-text side sheet.
4. Open create and edit menu flows.
5. Confirm footer buttons remain visible and no content scrolls horizontally.

## 12. Record Final Feedback

For each issue, record:

- Screen and action.
- What you expected.
- What happened.
- Desktop or mobile.
- Screenshot.
- Severity: blocks task, confusing, or visual polish.

After the review, the next decision gate is whether to finalize the prototype visual system or move the approved workflows into persistent Laravel implementation.
