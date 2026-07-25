import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8091';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
await page.locator('input[type="email"]').fill('owner@sagamenu.local');
await page.locator('input[type="password"]').fill('password');
await page.locator('button[type="submit"]').click();
await page.waitForURL(/\/admin(?:\/)?$/);

await page.goto(`${baseUrl}/admin/catalogs`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Buat catalog/i }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: 'storage/app/qa/pilot-create-catalog.png' });
const dialog = page.locator('div[role="dialog"].fi-modal-open').last();
console.log(JSON.stringify({
    url: page.url(),
    buttons: await page.getByRole('button').allTextContents(),
    links: await page.getByRole('link').allTextContents(),
    dialogCount: await page.locator('div[role="dialog"]').count(),
    dialogOpenCount: await page.locator('div[role="dialog"].fi-modal-open').count(),
    labels: await dialog.locator('label').allTextContents(),
    dialogButtons: await dialog.getByRole('button').allTextContents(),
    inputs: await dialog.locator('input').evaluateAll((inputs) => inputs.map((input) => ({ name: input.name, type: input.type, value: input.value }))),
    errors,
}, null, 2));

await browser.close();
