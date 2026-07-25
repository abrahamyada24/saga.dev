import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = 'qa';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
desktop.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
desktop.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await desktop.goto(`${baseUrl}/#overview`, { waitUntil: 'networkidle' });
await desktop.evaluate(() => localStorage.clear());
await desktop.reload({ waitUntil: 'networkidle' });
await desktop.getByRole('heading', { name: 'Ringkasan' }).waitFor();
await desktop.screenshot({ path: `${output}/dashboard-1440.png`, fullPage: true });

await desktop.getByRole('button', { name: /^Menu/ }).click();
await desktop.getByRole('heading', { name: 'Menu', exact: true }).waitFor();
const initialRows = await desktop.locator('[data-item-row]').count();
await desktop.getByRole('button', { name: 'Tambah menu' }).click();
await desktop.locator('[data-item-form] input[name="name"]').fill('Cold Brew Pandan');
await desktop.locator('[data-item-form] select[name="categoryId"]').selectOption('signature');
await desktop.locator('[data-item-form] input[name="price"]').fill('33000');
await desktop.locator('[data-item-form] textarea[name="description"]').fill('Cold brew ringan dengan aroma pandan.');
await desktop.locator('[data-item-form] button[type="submit"]').click();
await desktop.getByText('Cold Brew Pandan', { exact: true }).waitFor();
const rowsAfterCreate = await desktop.locator('[data-item-row]').count();
await desktop.screenshot({ path: `${output}/menus-1440.png`, fullPage: true });

await desktop.getByRole('button', { name: 'Publish & Share' }).click();
await desktop.getByRole('heading', { name: 'Publish & Share' }).waitFor();
await desktop.getByRole('switch', { name: 'Maintenance mode' }).click();
await desktop.getByRole('button', { name: 'Bio Menu' }).first().click();
await desktop.getByRole('heading', { name: 'Menu sedang maintenance' }).waitFor();
const maintenanceVisible = await desktop.getByRole('heading', { name: 'Menu sedang maintenance' }).isVisible();
await desktop.screenshot({ path: `${output}/maintenance-mobile.png`, fullPage: true });
await desktop.getByRole('button', { name: 'Kembali ke dashboard' }).click();
await desktop.getByRole('switch', { name: 'Maintenance mode' }).click();

await desktop.getByRole('button', { name: 'Bio Menu' }).first().click();
await desktop.getByRole('button', { name: /Lihat detail Iced Aren Latte/ }).click();
const detailHeading = desktop.getByRole('dialog').getByRole('heading', { name: 'Iced Aren Latte' });
await detailHeading.waitFor();
const detailVisible = await detailHeading.isVisible();
await desktop.screenshot({ path: `${output}/mobile-detail-1440.png`, fullPage: true });
await desktop.getByRole('button', { name: 'Tutup detail' }).click();
const mobileOverflow = await desktop.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
await desktop.getByRole('button', { name: /Tablet/ }).click();
await desktop.getByText('Store Display', { exact: true }).waitFor({ state: 'attached' }).catch(() => {});
await desktop.screenshot({ path: `${output}/tablet-preview-1440.png`, fullPage: true });
const tabletCards = await desktop.locator('.tablet-menu-card').count();
const loadedImages = await desktop.locator('.tablet-menu-card img').evaluateAll((images) =>
    images.filter((image) => image.complete && image.naturalWidth > 0).length,
);
await desktop.getByRole('button', { name: 'Kembali ke dashboard' }).click();
await desktop.getByRole('button', { name: 'Publish & Share' }).click();
await desktop.getByRole('button', { name: 'Publish sekarang' }).click();
const publishSuccess = await desktop.getByText(/Versi \d+ sekarang aktif/).isVisible();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileErrors = [];
mobile.on('console', (message) => {
    if (message.type() === 'error') mobileErrors.push(`console: ${message.text()}`);
});
mobile.on('pageerror', (error) => mobileErrors.push(`pageerror: ${error.message}`));
await mobile.goto(`${baseUrl}/#overview`, { waitUntil: 'networkidle' });
await mobile.getByRole('button', { name: 'Buka navigasi' }).click();
const mobileNavVisible = await mobile.getByRole('button', { name: /^Menu/ }).isVisible();
const dashboardOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
await mobile.screenshot({ path: `${output}/dashboard-mobile-390.png`, fullPage: true });

await browser.close();

const result = {
    baseUrl,
    initialRows,
    rowsAfterCreate,
    maintenanceVisible,
    detailVisible,
    tabletCards,
    loadedImages,
    mobileOverflow,
    mobileNavVisible,
    dashboardOverflow,
    errors,
    mobileErrors,
};

const failed = initialRows < 10
    || rowsAfterCreate !== initialRows + 1
    || !maintenanceVisible
    || !detailVisible
    || tabletCards < 8
    || loadedImages < Math.floor(tabletCards / 2)
    || mobileOverflow
    || !mobileNavVisible
    || dashboardOverflow
    || !publishSuccess
    || errors.length > 0
    || mobileErrors.length > 0;

console.log(JSON.stringify({ failed, result }, null, 2));
process.exitCode = failed ? 1 : 0;
