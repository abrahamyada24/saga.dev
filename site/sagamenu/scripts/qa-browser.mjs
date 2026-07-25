import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8091';
const output = 'storage/app/qa';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

async function inspectPublic(name, path, viewport) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    const metrics = await page.evaluate(() => ({
        title: document.title,
        cards: document.querySelectorAll('[data-offering-open]').length,
        collections: document.querySelectorAll('[data-collection]').length,
        images: document.querySelectorAll('.offering-card img').length,
        loadedImages: [...document.querySelectorAll('.offering-card img')].filter((image) => image.complete && image.naturalWidth > 0).length,
        viewportWidth: window.innerWidth,
        gridTemplateColumns: document.querySelector('.offering-grid') ? getComputedStyle(document.querySelector('.offering-grid')).gridTemplateColumns : null,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }));

    const firstTrigger = page.locator('[data-offering-open]').first();
    await firstTrigger.click();
    await page.locator('dialog[open]').waitFor();
    await page.screenshot({ path: `${output}/${name}-detail.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await page.locator(`[data-offering-dialog]`).first().waitFor({ state: 'hidden' });
    metrics.focusReturned = await firstTrigger.evaluate((element) => document.activeElement === element);

    if (await page.locator('[data-catalog-search]').count()) {
        await page.locator('[data-catalog-search]').fill('menu-yang-tidak-ada-123');
        await page.waitForTimeout(450);
        metrics.zeroResultVisible = await page.locator('[data-search-empty]').isVisible();
    }

    results.push({ name, status: response?.status(), errors, ...metrics });
    await page.close();
}

await inspectPublic('mobile-390', '/m/saga-coffee/main-menu', { width: 390, height: 844 });
await inspectPublic('store-tablet-portrait-768', '/s/saga-coffee/main-menu', { width: 768, height: 1024 });
await inspectPublic('store-tablet-1024', '/s/saga-coffee/main-menu', { width: 1024, height: 768 });
await inspectPublic('store-desktop-1440', '/s/saga-coffee/main-menu', { width: 1440, height: 900 });

const admin = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const adminErrors = [];
admin.on('console', (message) => {
    if (message.type() === 'error') adminErrors.push(message.text());
});
admin.on('pageerror', (error) => adminErrors.push(error.message));
const loginResponse = await admin.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
await admin.locator('input[type="email"]').fill('owner@sagamenu.local');
await admin.locator('input[type="password"]').fill('password');
await admin.locator('button[type="submit"]').click();
await admin.waitForURL(/\/admin(?:\/)?$/, { timeout: 15_000 });
await admin.waitForLoadState('networkidle');
await admin.screenshot({ path: `${output}/admin-dashboard.png`, fullPage: true });
const dashboardTitle = await admin.title();
const dashboardOverflow = await admin.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
const catalogLink = admin.locator('a[href*="/admin/catalogs"]').first();
await catalogLink.click();
await admin.waitForLoadState('networkidle');
await admin.screenshot({ path: `${output}/admin-catalogs.png`, fullPage: true });
results.push({
    name: 'admin-owner',
    loginStatus: loginResponse?.status(),
    title: dashboardTitle,
    url: admin.url(),
    horizontalOverflow: dashboardOverflow,
    errors: adminErrors,
});

await browser.close();

const failed = results.some((result) =>
    (result.status && result.status !== 200)
    || result.horizontalOverflow
    || result.cards === 0
    || result.collections === 0
    || (result.images > 0 && result.loadedImages === 0)
    || result.zeroResultVisible === false
    || result.focusReturned === false
    || result.errors.length > 0
);

console.log(JSON.stringify({ baseUrl, failed, results }, null, 2));
process.exitCode = failed ? 1 : 0;
