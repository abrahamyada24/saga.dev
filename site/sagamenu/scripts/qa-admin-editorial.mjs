import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8000';
const email = process.env.SAGA_MENU_QA_EMAIL || 'owner@sagamenu.local';
const password = process.env.SAGA_MENU_QA_PASSWORD || 'password';
const output = 'storage/app/qa-editorial-admin';

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];

page.on('console', (message) => {
    if (message.type() === 'error') {
        const { url } = message.location();
        errors.push(`console: ${message.text()}${url ? ` (${url})` : ''}`);
    }
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
await page.locator('#form\\.email').fill(email);
await page.locator('#form\\.password').fill(password);
await page.getByRole('button', { name: /sign in|masuk/i }).click();
await page.locator('.sm-editorial-dashboard').waitFor();

const workspace = page.locator('.sm-editorial-workspace');
const preview = page.locator('.sm-live-preview');
const previewRatio = await workspace.evaluate((element) => {
    const previewElement = element.querySelector('.sm-live-preview');
    return previewElement.getBoundingClientRect().width / element.getBoundingClientRect().width;
});
const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const unnamedButtons = await page.getByRole('button').evaluateAll((buttons) => buttons.filter(
    (button) => !(button.getAttribute('aria-label') || button.textContent.trim() || button.getAttribute('title')),
).length);

const iframe = preview.locator('iframe');
await iframe.waitFor();
await page.waitForTimeout(1000);
const storeFrame = iframe.contentFrame();
await storeFrame.getByText('Store Display', { exact: true }).waitFor();
const storeUrl = await iframe.getAttribute('src');
const storeHasNoOverflow = await storeFrame.locator('body').evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
);

const resetZoom = page.getByRole('button', { name: 'Reset ukuran preview' });
const zoomBefore = await resetZoom.textContent();
await page.getByRole('button', { name: 'Perbesar preview' }).click();
const zoomAfter = await resetZoom.textContent();

await page.getByRole('button', { name: 'Bio Menu', exact: true }).click();
await page.waitForTimeout(700);
const mobileUrl = await iframe.getAttribute('src');
const mobileFrame = iframe.contentFrame();
await mobileFrame.getByText('Bio Menu', { exact: true }).waitFor();
const fullPreviewHref = await page.getByRole('link', { name: 'Buka preview penuh' }).getAttribute('href');

await page.screenshot({ path: `${output}/admin-editorial-1440.png`, fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
const mobileDashboardOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const previewVisibleOnMobile = await preview.isVisible();
const modeControlsVisible = await page.getByRole('button', { name: 'Store Display', exact: true }).isVisible()
    && await page.getByRole('button', { name: 'Bio Menu', exact: true }).isVisible();
await page.screenshot({ path: `${output}/admin-editorial-390.png`, fullPage: true });

await browser.close();

const result = {
    baseUrl,
    previewRatio,
    desktopOverflow,
    mobileDashboardOverflow,
    unnamedButtons,
    storeUrl,
    mobileUrl,
    fullPreviewHref,
    storeHasNoOverflow,
    zoomBefore: zoomBefore?.trim(),
    zoomAfter: zoomAfter?.trim(),
    previewVisibleOnMobile,
    modeControlsVisible,
    errors,
};

const failed = previewRatio < 0.58
    || desktopOverflow
    || mobileDashboardOverflow
    || unnamedButtons > 0
    || !storeUrl?.endsWith('/store')
    || !mobileUrl?.endsWith('/mobile')
    || mobileUrl !== fullPreviewHref
    || !storeHasNoOverflow
    || zoomBefore === zoomAfter
    || !previewVisibleOnMobile
    || !modeControlsVisible
    || errors.length > 0;

console.log(JSON.stringify({ failed, result }, null, 2));
process.exitCode = failed ? 1 : 0;
