import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = 'qa';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const settle = (page, duration = 380) => page.waitForTimeout(duration);
const errors = [];
desktop.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
desktop.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await desktop.goto(`${baseUrl}/#overview`, { waitUntil: 'networkidle' });
await desktop.evaluate(() => localStorage.clear());
await desktop.reload({ waitUntil: 'networkidle' });
await desktop.getByRole('heading', { name: 'Selamat datang, Andreas' }).waitFor();
await settle(desktop);
await desktop.screenshot({ path: `${output}/dashboard-editorial-1440.png`, fullPage: true });
const overviewPreviewRatio = await desktop.evaluate(() => {
    const preview = document.querySelector('.overview-editorial-workspace .live-preview-workspace');
    const workspace = document.querySelector('.overview-editorial-workspace');
    return preview && workspace ? preview.getBoundingClientRect().width / workspace.getBoundingClientRect().width : 0;
});
await desktop.locator('.overview-editorial-workspace [data-action="switch-embedded-preview"][data-mode="mobile"]').click();
await desktop.locator('.overview-editorial-workspace [data-live-preview][data-mode="mobile"]').waitFor();
await desktop.locator('.overview-editorial-workspace').getByRole('button', { name: 'Perbesar preview' }).click();
const previewZoomChanged = await desktop.locator('.overview-editorial-workspace .zoom-value').getByText('110%').isVisible();
await desktop.locator('.overview-editorial-workspace').getByRole('button', { name: 'Kembalikan ukuran preview' }).click();

const dashboardAssetLoaded = await desktop.locator('.editorial-story-art').evaluate(
    (image) => image.complete && image.naturalWidth > 0,
);

await desktop.getByRole('button', { name: /^Menu & Katalog/ }).click();
await desktop.getByRole('heading', { name: 'Menu', exact: true }).waitFor();
const initialRows = await desktop.locator('[data-item-row]').count();
await desktop.getByRole('button', { name: 'Tambah menu' }).click();
await desktop.locator('[data-item-form] input[name="name"]').fill('Cold Brew Pandan');
await desktop.locator('[data-item-form] select[name="categoryId"]').selectOption('signature');
await desktop.locator('[data-item-form] input[name="price"]').fill('33000');
await desktop.locator('[data-item-form] textarea[name="description"]').fill('Cold brew ringan dengan aroma pandan.');
await desktop.locator('[data-item-form] button[type="submit"]').click();
await desktop.waitForURL(/#menus$/);
await desktop.locator('[data-item-row]').filter({ hasText: 'Cold Brew Pandan' }).waitFor();
const rowsAfterCreate = await desktop.locator('[data-item-row]').count();
await desktop.getByRole('button', { name: 'Duplikat Cold Brew Pandan' }).click();
await desktop.locator('[data-item-row]').filter({ hasText: 'Cold Brew Pandan Copy' }).waitFor();
const duplicateWorked = await desktop.getByText('Cold Brew Pandan Copy', { exact: true }).first().isVisible();
await settle(desktop);
await desktop.screenshot({ path: `${output}/menus-editorial-1440.png`, fullPage: true });

await desktop.getByRole('button', { name: 'Kategori', exact: true }).click();
await desktop.getByRole('heading', { name: 'Kategori', exact: true }).waitFor();
await desktop.getByRole('button', { name: 'Tambah kategori' }).click();
await desktop.locator('[data-simple-form] input[name="name"]').fill('Seasonal Test');
await desktop.locator('[data-simple-form] textarea[name="description"]').fill('Kategori sementara untuk QA.');
await desktop.locator('[data-simple-form] button[type="submit"]').last().click();
await desktop.getByText('Seasonal Test', { exact: true }).waitFor();
desktop.once('dialog', (dialog) => dialog.accept());
await desktop.getByRole('button', { name: 'Hapus Seasonal Test' }).click();
await desktop.getByText('Seasonal Test', { exact: true }).waitFor({ state: 'detached' });
await desktop.getByRole('button', { name: 'Hapus Signature' }).click();
const categoryDeleteProtected = await desktop.getByText('Kategori masih digunakan').isVisible();

await desktop.getByRole('button', { name: 'Tampilan' }).click();
await desktop.getByRole('heading', { name: 'Tampilan & branding' }).waitFor();
await desktop.getByRole('button', { name: 'Daftar', exact: true }).click();
const listLayoutWorked = await desktop.locator('.live-preview-workspace .public-menu.is-layout-list').isVisible();
await desktop.locator('.live-preview-workspace [data-action="switch-embedded-preview"][data-mode="mobile"]').click();
const embeddedMobileWorked = await desktop.locator('.live-preview-workspace[data-mode="mobile"]').isVisible();
await settle(desktop, 3400);
await desktop.screenshot({ path: `${output}/appearance-editorial-1440.png`, fullPage: true });
const appearanceOverflow = await desktop.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);

await desktop.getByRole('button', { name: 'Preview & Publish' }).click();
await desktop.getByRole('heading', { name: 'Preview & Publish' }).waitFor();
await desktop.getByRole('switch', { name: 'Mode maintenance' }).click();
await desktop.getByRole('button', { name: 'Bio Menu' }).first().click();
await desktop.getByRole('heading', { name: 'Menu sedang maintenance' }).waitFor();
const maintenanceVisible = await desktop.getByRole('heading', { name: 'Menu sedang maintenance' }).isVisible();
await desktop.locator('.maintenance-card > img').evaluate((image) => image.decode());
const maintenanceAssetLoaded = await desktop.locator('.maintenance-card > img').evaluate(
    (image) => image.complete && image.naturalWidth > 0,
);
await desktop.screenshot({ path: `${output}/maintenance-editorial.png`, fullPage: true });
await desktop.getByRole('button', { name: 'Kembali ke dashboard' }).click();
await desktop.getByRole('button', { name: 'Preview & Publish' }).click();
await desktop.getByRole('switch', { name: 'Mode maintenance' }).click();

await desktop.getByRole('button', { name: 'Bio Menu' }).first().click();
await desktop.getByRole('button', { name: /Lihat detail Es Kopi Susu Aren/ }).click();
const detailHeading = desktop.getByRole('dialog').getByRole('heading', { name: 'Es Kopi Susu Aren' });
await detailHeading.waitFor();
const detailVisible = await detailHeading.isVisible();
await desktop.screenshot({ path: `${output}/bio-detail-editorial-1440.png`, fullPage: true });
await desktop.getByRole('button', { name: 'Tutup detail' }).click();
const mobilePreviewOverflow = await desktop.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);

await desktop.getByRole('button', { name: /Tablet/ }).click();
await desktop.screenshot({ path: `${output}/store-preview-editorial-1440.png`, fullPage: true });
const tabletCards = await desktop.locator('.tablet-menu-card').count();
const loadedImages = await desktop.locator('.tablet-menu-card img').evaluateAll((images) =>
    images.filter((image) => image.complete && image.naturalWidth > 0).length,
);
await desktop.getByRole('button', { name: 'Kembali ke dashboard' }).click();
await desktop.getByRole('button', { name: 'Preview & Publish' }).click();
await desktop.getByRole('button', { name: 'Uji safe failure' }).click();
await desktop.getByRole('heading', { name: 'Draft tidak dapat diterbitkan' }).waitFor();
const safeFailureVisible = await desktop.getByText(new RegExp(`Versi ${3} tetap aktif`)).isVisible();
await desktop.getByRole('button', { name: 'Coba lagi' }).click();
await desktop.getByRole('heading', { name: 'Berhasil diterbitkan', exact: true }).waitFor();
const publishSuccess = await desktop.getByText(/Versi v\d+ sekarang aktif/).first().isVisible();
await desktop.locator('.success-art').evaluate((image) => image.decode());
const successAssetLoaded = await desktop.locator('.success-art').evaluate(
    (image) => image.complete && image.naturalWidth > 0,
);
await desktop.screenshot({ path: `${output}/publish-success-editorial-1440.png`, fullPage: true });

const unnamedDesktopButtons = await desktop.getByRole('button').evaluateAll((buttons) =>
    buttons.filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).length,
);

await desktop.getByRole('button', { name: 'Analytics' }).click();
await desktop.getByRole('heading', { name: 'Analytics' }).waitFor();
const viewsBeforePeriodChange = await desktop.locator('.metric').first().locator('strong').textContent();
await desktop.getByRole('combobox', { name: 'Periode analytics' }).selectOption('7');
const viewsAfterPeriodChange = await desktop.locator('.metric').first().locator('strong').textContent();
const analyticsPeriodWorked = viewsBeforePeriodChange !== viewsAfterPeriodChange;

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileErrors = [];
mobile.on('console', (message) => {
    if (message.type() === 'error') mobileErrors.push(`console: ${message.text()}`);
});
mobile.on('pageerror', (error) => mobileErrors.push(`pageerror: ${error.message}`));
await mobile.goto(`${baseUrl}/#overview`, { waitUntil: 'networkidle' });
await mobile.getByRole('button', { name: 'Buka navigasi' }).click();
const mobileNavVisible = await mobile.getByRole('button', { name: /^Menu & Katalog/ }).isVisible();
const dashboardOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
await mobile.screenshot({ path: `${output}/dashboard-editorial-mobile-390.png`, fullPage: true });

await mobile.getByRole('button', { name: 'Tampilan' }).click();
await mobile.getByRole('heading', { name: 'Tampilan & branding' }).waitFor();
const appearanceMobileOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
await mobile.screenshot({ path: `${output}/appearance-editorial-mobile-390.png`, fullPage: true });

await browser.close();

const result = {
    baseUrl,
    initialRows,
    rowsAfterCreate,
    overviewPreviewRatio,
    previewZoomChanged,
    duplicateWorked,
    categoryDeleteProtected,
    listLayoutWorked,
    embeddedMobileWorked,
    safeFailureVisible,
    analyticsPeriodWorked,
    dashboardAssetLoaded,
    maintenanceVisible,
    maintenanceAssetLoaded,
    detailVisible,
    tabletCards,
    loadedImages,
    publishSuccess,
    successAssetLoaded,
    appearanceOverflow,
    mobilePreviewOverflow,
    dashboardOverflow,
    appearanceMobileOverflow,
    mobileNavVisible,
    unnamedDesktopButtons,
    errors,
    mobileErrors,
};

const failed = initialRows < 10
    || rowsAfterCreate !== initialRows + 1
    || overviewPreviewRatio < 0.58
    || !previewZoomChanged
    || !duplicateWorked
    || !categoryDeleteProtected
    || !listLayoutWorked
    || !embeddedMobileWorked
    || !safeFailureVisible
    || !analyticsPeriodWorked
    || !dashboardAssetLoaded
    || !maintenanceVisible
    || !maintenanceAssetLoaded
    || !detailVisible
    || tabletCards < 8
    || loadedImages < Math.floor(tabletCards / 2)
    || !publishSuccess
    || !successAssetLoaded
    || appearanceOverflow
    || mobilePreviewOverflow
    || dashboardOverflow
    || appearanceMobileOverflow
    || !mobileNavVisible
    || unnamedDesktopButtons > 0
    || errors.length > 0
    || mobileErrors.length > 0;

console.log(JSON.stringify({ failed, result }, null, 2));
process.exitCode = failed ? 1 : 0;
