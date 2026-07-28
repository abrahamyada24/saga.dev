import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const fixturePath = fileURLToPath(new URL('../assets/illustrations/empty-catalog.webp', import.meta.url));
const output = fileURLToPath(new URL('../qa', import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleErrors = [];
const pageErrors = [];

page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(error.message));

await page.goto(`${baseUrl}/#media`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

const mediaCardsBefore = await page.locator('[data-media-card]').count();
await page.locator('[data-media-filter]').selectOption('unused');
const unusedCards = await page.locator('[data-media-card]:visible').count();
await page.locator('[data-media-filter]').selectOption('');

let unusedCard = page.locator('[data-media-card]').filter({ hasText: 'Belum dipakai' }).first();
await unusedCard.getByRole('button', { name: 'Edit alt' }).click();
let sheet = page.locator('[data-simple-dialog]');
const mediaSheet = {
    sideSheet: await sheet.evaluate((dialog) => dialog.classList.contains('is-side-sheet')),
    impactVisible: await sheet.locator('.impact-summary').isVisible(),
};
await sheet.locator('textarea[name="alt"]').fill('Coffee bar dengan mesin espresso dan pencahayaan hangat');
await sheet.getByRole('button', { name: 'Simpan alt text' }).click();
await page.getByText('Coffee bar dengan mesin espresso dan pencahayaan hangat').waitFor();

const usedCard = page.locator('[data-media-card]').filter({ hasText: 'Es Kopi Susu Aren' }).first();
await usedCard.locator('[data-action="remove-media"]').click();
const usedDeleteProtected = await page.getByText('Asset masih digunakan').isVisible();

await page.locator('[data-library-upload]').setInputFiles(fixturePath);
await page.getByText('Asset siap digunakan').waitFor();
const mediaCardsAfterUpload = await page.locator('[data-media-card]').count();
const uploadedCard = page.locator('[data-media-card]').filter({ hasText: 'empty catalog' }).first();
page.once('dialog', (dialog) => dialog.accept());
await uploadedCard.locator('[data-action="remove-media"]').click();
await page.getByText('Asset dihapus').waitFor();
const mediaCardsAfterRemove = await page.locator('[data-media-card]').count();
await page.waitForTimeout(350);
await page.screenshot({ path: `${output}/complete-wave-media-library.png` });

await page.getByRole('button', { name: /^Menu & Katalog/ }).click();
let itemRow = page.locator('[data-item-row]').filter({ hasText: 'Es Kopi Susu Aren' });
await itemRow.getByRole('button', { name: 'Edit Es Kopi Susu Aren' }).click();
let editor = page.locator('[data-item-editor]');
await editor.getByRole('button', { name: 'Media', exact: true }).click();
await editor.locator('input[name="imageAlt"]').fill('Es kopi susu aren dengan foam di gelas bening');
await editor.locator('input[name="focalX"]').fill('62');
await editor.locator('input[name="focalY"]').fill('44');
await editor.locator('[data-gallery-upload]').setInputFiles(fixturePath);
await editor.locator('[data-editor-gallery] article').waitFor();
const mediaEditor = {
    galleryCount: await editor.locator('[data-editor-gallery] article').count(),
    focalPosition: await editor.locator('[data-editor-preview-image]').evaluate((image) => image.style.objectPosition),
};

await editor.getByRole('button', { name: 'Pilihan & detail', exact: true }).click();
await editor.getByRole('button', { name: 'Tambah varian' }).click();
sheet = page.locator('[data-simple-dialog]');
await sheet.locator('input[name="name"]').fill('Ukuran');
await sheet.locator('input[name="required"]').check();
await sheet.locator('textarea[name="values"]').fill('Regular|0\nLarge|8000');
await sheet.getByRole('button', { name: 'Tambah varian' }).click();
await editor.getByText('Ukuran', { exact: true }).waitFor();
const variantBuilder = {
    cards: await editor.locator('.variant-group-card').count(),
    requiredCopy: await editor.locator('.variant-group-card').first().innerText(),
    attachedAddons: await editor.locator('input[name="addonGroupIds"]:checked').count(),
};
await editor.locator('.advanced-detail-editor summary').click();
await editor.locator('textarea[name="ingredients"]').fill('Espresso, susu segar, dan gula aren.');
await editor.locator('input[name="allergens"][value="Susu"]').check();
await editor.locator('input[name="dietary"][value="Halal"]').check();
await editor.locator('input[name="servingNote"]').fill('Paling nikmat disajikan dingin.');
await page.screenshot({ path: `${output}/complete-wave-complex-editor.png` });
await editor.getByRole('button', { name: 'Simpan perubahan' }).click();

await page.getByRole('button', { name: 'Preview menu' }).click();
await page.getByRole('menuitem', { name: /Bio Menu/ }).click();
await page.getByRole('button', { name: /Lihat detail Es Kopi Susu Aren/ }).click();
const detail = page.locator('[data-menu-detail]');
const publicDetail = {
    variantVisible: await detail.getByRole('heading', { name: /Ukuran/ }).isVisible(),
    largeVisible: await detail.getByText('Large', { exact: true }).isVisible(),
    ingredientsVisible: await detail.getByText(/Espresso, susu segar/).isVisible(),
    servingVisible: await detail.getByText(/Paling nikmat disajikan dingin/).isVisible(),
    galleryCount: await detail.locator('.detail-gallery img').count(),
};
await detail.getByRole('button', { name: 'Tutup detail' }).click();
await page.getByRole('button', { name: 'Kembali ke dashboard' }).click();

await page.getByRole('button', { name: 'Kategori', exact: true }).click();
await page.getByRole('button', { name: 'Edit Signature' }).click();
sheet = page.locator('[data-simple-dialog]');
const categorySheet = {
    sideSheet: await sheet.evaluate((dialog) => dialog.classList.contains('is-side-sheet')),
    usage: await sheet.locator('.impact-summary').innerText(),
};
await sheet.getByRole('button', { name: 'Simpan' }).click();
await page.getByRole('button', { name: 'Hapus Signature' }).click();
const categoryDeleteProtected = await page.getByText('Kategori masih digunakan').isVisible();

await page.getByRole('button', { name: 'Add-on & Pilihan' }).click();
await page.getByRole('button', { name: 'Edit Pilihan Susu' }).click();
sheet = page.locator('[data-simple-dialog]');
const addonSheet = {
    sideSheet: await sheet.evaluate((dialog) => dialog.classList.contains('is-side-sheet')),
    usage: await sheet.locator('.impact-summary').innerText(),
};
await sheet.getByRole('button', { name: 'Simpan' }).click();

await page.getByRole('button', { name: 'Tampilan' }).click();
await page.getByRole('button', { name: 'Setup terpandu' }).click();
sheet = page.locator('[data-simple-dialog]');
const onboarding = {
    steps: await sheet.locator('.setup-step-list li').count(),
    surfaces: await sheet.locator('input[name="surfaces"]').count(),
};
await sheet.locator('input[name="tagline"]').fill('Kopi, menu, dan cerita dalam satu tempat.');
await sheet.locator('input[name="starterCategory"]').fill('Seasonal Lab');
await sheet.getByRole('button', { name: 'Simpan setup' }).click();
await page.getByText('Setup katalog disimpan').waitFor();

await page.locator('[data-logo-upload]').setInputFiles(fixturePath);
await page.getByText('Logo diperbarui').waitFor();
await page.getByRole('button', { name: 'Tipografi' }).click();
await page.locator('[data-font-upload]').setInputFiles(fixturePath);
const invalidFontRejected = await page.getByText('Format font tidak didukung').isVisible();
await page.getByRole('button', { name: 'Bentuk' }).click();
await page.locator('[data-appearance-key="radius"]').selectOption('rounded');
await page.locator('[data-appearance-key="imageTreatment"]').selectOption('mono');
await page.getByRole('button', { name: 'Preset' }).click();
await page.getByRole('button', { name: 'Photo Grid' }).click();
await page.getByRole('button', { name: 'Menu Board' }).click();
await page.getByRole('button', { name: 'Simpan tampilan' }).click();
await page.getByText('Tampilan disimpan').waitFor();
const savedAppearance = {
    bioActive: await page.getByRole('button', { name: /Photo Grid/ }).evaluate((button) => button.classList.contains('is-active')),
    storeActive: await page.getByRole('button', { name: /Menu Board/ }).evaluate((button) => button.classList.contains('is-active')),
    logoStored: await page.locator('.brand-logo-preview img').count() === 1,
};

await page.getByRole('button', { name: 'Compact Cards' }).click();
await page.getByRole('button', { name: 'Batalkan perubahan' }).click();
const cancelRestored = await page.getByRole('button', { name: /Photo Grid/ }).evaluate((button) => button.classList.contains('is-active'));
await page.waitForTimeout(350);
await page.screenshot({ path: `${output}/complete-wave-brand-kit.png` });

await page.getByRole('button', { name: 'Preview & Terbitkan' }).click();
const surfaceChecks = page.locator('[data-publish-surface]');
await surfaceChecks.nth(0).uncheck();
await surfaceChecks.nth(1).uncheck();
await page.getByRole('button', { name: 'Terbitkan perubahan' }).click();
const noSurfaceBlocked = await page.getByText('Pilih surface publikasi').isVisible();
await surfaceChecks.nth(0).check();
await surfaceChecks.nth(1).check();
await page.getByRole('button', { name: 'Uji safe failure' }).click();
await page.getByRole('heading', { name: 'Draft tidak dapat diterbitkan' }).waitFor();
const liveVersionSafe = await page.getByText(/tetap aktif/).isVisible();
await page.getByRole('button', { name: 'Coba lagi' }).click();
await page.getByRole('heading', { name: 'Berhasil diterbitkan', exact: true }).waitFor();
const publishSucceeded = await page.getByText(/sekarang aktif/).first().isVisible();

await page.evaluate(() => {
    const key = 'sagamenu-prototype-editorial-kv-v2';
    const value = JSON.parse(localStorage.getItem(key));
    value.appearance.bioPreset = 'unknown-mobile';
    value.appearance.storePreset = 'unknown-tablet';
    localStorage.setItem(key, JSON.stringify(value));
});
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Tampilan' }).click();
await page.getByRole('button', { name: 'Preset' }).click();
const migrationFallback = {
    bio: await page.getByRole('button', { name: /Editorial List/ }).evaluate((button) => button.classList.contains('is-active')),
    store: await page.getByRole('button', { name: /Editorial Grid/ }).evaluate((button) => button.classList.contains('is-active')),
};

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'Buka navigasi' }).click();
await page.getByRole('button', { name: 'Media Library' }).click();
const mobileMedia = {
    cards: await page.locator('[data-media-card]').count(),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
};
await page.locator('[data-media-card]').first().getByRole('button', { name: 'Edit alt' }).click();
sheet = page.locator('[data-simple-dialog]');
const mobileSheet = {
    visible: await sheet.isVisible(),
    width: await sheet.evaluate((dialog) => Math.round(dialog.getBoundingClientRect().width)),
    overflow: await sheet.evaluate((dialog) => dialog.scrollWidth > dialog.clientWidth + 1),
};
await sheet.getByRole('button', { name: 'Tutup' }).click();
await page.screenshot({ path: `${output}/complete-wave-mobile.png` });

const unnamedButtons = await page.getByRole('button').evaluateAll((buttons) =>
    buttons.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length,
);
const unnamedButtonDetails = await page.getByRole('button').evaluateAll((buttons) =>
    buttons
        .filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim())
        .map((button) => button.outerHTML),
);
await browser.close();

const result = {
    baseUrl,
    mediaCardsBefore,
    unusedCards,
    mediaSheet,
    usedDeleteProtected,
    mediaCardsAfterUpload,
    mediaCardsAfterRemove,
    mediaEditor,
    variantBuilder,
    publicDetail,
    categorySheet,
    categoryDeleteProtected,
    addonSheet,
    onboarding,
    invalidFontRejected,
    savedAppearance,
    cancelRestored,
    noSurfaceBlocked,
    liveVersionSafe,
    publishSucceeded,
    migrationFallback,
    mobileMedia,
    mobileSheet,
    unnamedButtons,
    unnamedButtonDetails,
    consoleErrors,
    pageErrors,
};
console.log(JSON.stringify(result, null, 2));

const passed = [
    mediaCardsBefore >= 13,
    unusedCards === 1,
    mediaSheet.sideSheet,
    mediaSheet.impactVisible,
    usedDeleteProtected,
    mediaCardsAfterUpload === mediaCardsBefore + 1,
    mediaCardsAfterRemove === mediaCardsBefore,
    mediaEditor.galleryCount === 1,
    mediaEditor.focalPosition === '62% 44%',
    variantBuilder.cards === 1,
    variantBuilder.requiredCopy.includes('Wajib'),
    variantBuilder.attachedAddons >= 1,
    publicDetail.variantVisible,
    publicDetail.largeVisible,
    publicDetail.ingredientsVisible,
    publicDetail.servingVisible,
    publicDetail.galleryCount === 1,
    categorySheet.sideSheet,
    categorySheet.usage.includes('Dipakai oleh'),
    categoryDeleteProtected,
    addonSheet.sideSheet,
    addonSheet.usage.includes('Dipakai oleh'),
    onboarding.steps === 4,
    onboarding.surfaces === 2,
    invalidFontRejected,
    savedAppearance.bioActive,
    savedAppearance.storeActive,
    savedAppearance.logoStored,
    cancelRestored,
    noSurfaceBlocked,
    liveVersionSafe,
    publishSucceeded,
    migrationFallback.bio,
    migrationFallback.store,
    mobileMedia.cards >= 13,
    !mobileMedia.overflow,
    mobileSheet.visible,
    mobileSheet.width <= 390,
    !mobileSheet.overflow,
    unnamedButtons === 0,
    consoleErrors.length === 0,
    pageErrors.length === 0,
].every(Boolean);

process.exitCode = passed ? 0 : 1;
