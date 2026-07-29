import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = 'qa';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const settle = () => page.waitForTimeout(450);
const errors = [];
page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/#menus`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Menu', exact: true }).waitFor();

const initialItems = await page.locator('[data-item-row]').count();
await page.locator('[data-select-item]').nth(0).check();
await page.locator('[data-select-item]').nth(1).check();
await page.getByRole('button', { name: 'Sold out', exact: true }).click();
const bulkSoldOutCount = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('sagamenu-prototype-editorial-kv-v2'));
    return state.items.slice(0, 2).filter((item) => item.availability === 'sold_out').length;
});
await page.getByRole('button', { name: 'Undo', exact: true }).click();
const bulkUndoWorked = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('sagamenu-prototype-editorial-kv-v2'));
    return state.items.slice(0, 2).every((item) => item.availability === 'available');
});

const firstPrice = page.locator('[data-inline-field="price"]').first();
await firstPrice.fill('41000');
await firstPrice.press('Tab');
const inlinePriceWorked = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('sagamenu-prototype-editorial-kv-v2'));
    return state.items[0].price === 41000;
});

await page.locator('[data-action="translate-item"]').first().click();
await page.getByRole('dialog').getByLabel('Nama · English').fill('Iced Palm Sugar Latte');
await page.getByRole('dialog').getByLabel('Deskripsi · English').fill('Espresso, milk, and Indonesian palm sugar.');
const transcript = page.getByRole('dialog').getByLabel('Transcript video');
if (await transcript.count()) await transcript.fill('A short look at how this drink is prepared.');
await page.getByRole('dialog').getByRole('button', { name: 'Simpan terjemahan' }).click();
const translationWorked = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('sagamenu-prototype-editorial-kv-v2'));
    return state.items[0].translations.en.name === 'Iced Palm Sugar Latte';
});

await page.locator('[data-action="schedule-item"]').first().click();
await page.getByRole('dialog').getByLabel('Mulai tampil').fill('2026-08-01T08:00');
await page.getByRole('dialog').getByLabel('Selesai tampil').fill('2026-08-31T22:00');
await page.getByRole('dialog').getByRole('button', { name: 'Simpan jadwal' }).click();
const scheduleWorked = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('sagamenu-prototype-editorial-kv-v2'));
    return state.items[0].schedule.startsAt === '2026-08-01T08:00';
});
await settle();
await page.screenshot({ path: `${output}/sprints-18-25-quick-ops.png`, fullPage: true });

await page.getByRole('button', { name: /Perubahan & Kesehatan/ }).click();
await page.getByRole('heading', { name: 'Perubahan & Kesehatan' }).waitFor();
const changeRows = await page.locator('.change-center-row').count();
await page.getByRole('tab', { name: /Catalog Health/ }).click();
const healthRows = await page.locator('.health-row').count();
await settle();
await page.screenshot({ path: `${output}/sprints-18-25-health.png`, fullPage: true });

await page.getByRole('button', { name: 'QR & Distribusi' }).click();
const qrBefore = await page.locator('.qr-route-card').count();
await page.getByRole('button', { name: 'Buat QR' }).click();
await page.getByRole('dialog').getByLabel('Nama QR').fill('Meja teras');
await page.getByRole('dialog').getByLabel('Sumber').fill('table-terrace');
await page.getByRole('dialog').getByRole('button', { name: 'Buat QR' }).click();
const qrAfter = await page.locator('.qr-route-card').count();
await settle();
await page.screenshot({ path: `${output}/sprints-18-25-distribution.png`, fullPage: true });

await page.getByRole('button', { name: 'Outlet & Tim' }).click();
await page.getByRole('button', { name: /Surabaya/ }).click();
const outletScopeWorked = await page.locator('.business-switcher small').getByText(/Surabaya/).isVisible();
await page.getByRole('button', { name: 'Undang anggota' }).click();
await page.getByRole('dialog').getByLabel('Nama').fill('Dina');
await page.getByRole('dialog').getByLabel('Email').fill('dina@example.test');
await page.getByRole('dialog').getByRole('button', { name: 'Kirim undangan' }).click();
const pendingMemberVisible = await page.getByText('dina@example.test').isVisible();
await settle();
await page.screenshot({ path: `${output}/sprints-18-25-workspace.png`, fullPage: true });

await page.getByRole('button', { name: 'Analytics' }).click();
await page.getByRole('heading', { name: 'Analytics to Action' }).waitFor();
const operationalInsights = await page.locator('.operational-insights article').count();
await settle();
await page.screenshot({ path: `${output}/sprints-18-25-analytics.png`, fullPage: true });

await page.evaluate(() => {
    const key = 'sagamenu-prototype-editorial-kv-v2';
    const stored = JSON.parse(localStorage.getItem(key));
    stored.items[0].schedule = { startsAt: '', endsAt: '' };
    localStorage.setItem(key, JSON.stringify(stored));
});
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Preview menu' }).click();
await page.getByRole('menuitem', { name: /Bio Menu/ }).click();
await page.locator('[data-action="public-locale"][data-locale="en"]').click();
const localizedPublicCard = await page.getByRole('heading', { name: 'Iced Palm Sugar Latte' }).isVisible();
await page.locator('[data-public-search]').fill('zzzz-no-result');
const zeroResultVisible = await page.locator('[data-public-zero]').isVisible();
const publicResultText = await page.locator('[data-public-result-count]').textContent();

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(250);
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
await settle();
await page.screenshot({ path: `${output}/sprints-18-25-public-mobile.png`, fullPage: true });

const unnamedButtons = await page.locator('button').evaluateAll((buttons) => buttons.filter((button) => {
    const name = button.getAttribute('aria-label') || button.textContent?.trim() || button.getAttribute('title');
    return !name;
}).length);

await browser.close();

const result = {
    baseUrl,
    initialItems,
    bulkSoldOutCount,
    bulkUndoWorked,
    inlinePriceWorked,
    translationWorked,
    scheduleWorked,
    changeRows,
    healthRows,
    qrCreated: qrAfter === qrBefore + 1,
    outletScopeWorked,
    pendingMemberVisible,
    operationalInsights,
    localizedPublicCard,
    zeroResultVisible,
    publicResultText,
    mobileOverflow,
    unnamedButtons,
    errors,
};

const failed = initialItems < 12
    || bulkSoldOutCount !== 2
    || !bulkUndoWorked
    || !inlinePriceWorked
    || !translationWorked
    || !scheduleWorked
    || changeRows < 1
    || qrAfter !== qrBefore + 1
    || !outletScopeWorked
    || !pendingMemberVisible
    || operationalInsights < 3
    || !localizedPublicCard
    || !zeroResultVisible
    || mobileOverflow
    || unnamedButtons
    || errors.length;

console.log(JSON.stringify(result, null, 2));
if (failed) process.exit(1);
