import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = 'qa';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.stack || error.message}`));

await page.goto(`${baseUrl}/#menus`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Tambah menu' }).click();
await page.waitForTimeout(300);

const dialog = page.locator('[data-item-editor]');
const opened = await dialog.evaluate((element) => element.open);
const display = await dialog.evaluate((element) => getComputedStyle(element).display);
const box = await dialog.boundingBox();

console.log(JSON.stringify({ opened, display, box, errors }, null, 2));
await browser.close();
process.exitCode = opened && box && errors.length === 0 ? 0 : 1;
