import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8097';
const output = 'storage/app/qa-maintenance';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const target of [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-1024', width: 1024, height: 768 },
]) {
    const page = await browser.newPage({
        viewport: { width: target.width, height: target.height },
    });
    const errors = [];
    page.on('console', (message) => {
        const expectedMaintenanceResponse = message.text().includes('503 (Service Unavailable)');
        if (message.type() === 'error' && !expectedMaintenanceResponse) {
            errors.push(message.text());
        }
    });
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(`${baseUrl}/m/saga-coffee/main-menu`, {
        waitUntil: 'networkidle',
    });
    await page.screenshot({
        path: `${output}/${target.name}.png`,
        fullPage: true,
    });

    results.push({
        name: target.name,
        status: response?.status(),
        title: await page.title(),
        maintenanceVisible: await page.getByRole('heading', { name: 'Menu sedang maintenance' }).isVisible(),
        catalogContentLeaked: (await page.getByText('Iced Aren Latte').count()) > 0,
        horizontalOverflow: await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        ),
        errors,
    });
    await page.close();
}

await browser.close();

const failed = results.some((result) =>
    result.status !== 503
    || !result.maintenanceVisible
    || result.catalogContentLeaked
    || result.horizontalOverflow
    || result.errors.length > 0
);

console.log(JSON.stringify({ baseUrl, failed, results }, null, 2));
process.exitCode = failed ? 1 : 0;
