import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8017';
const output = 'storage/app/qa-editorial';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const errors = [];
const mobileErrors = [];

const tablet = await browser.newPage({ viewport: { width: 1024, height: 768 } });
tablet.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
tablet.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await tablet.goto(`${baseUrl}/s/saga-coffee/main-menu`, { waitUntil: 'networkidle' });
await tablet.getByRole('heading', { name: 'Saga Coffee Demo' }).waitFor();
const tabletCategories = await tablet.locator('[data-collection-link]').count();
const tabletCards = await tablet.locator('.offering-card--store').count();
const tabletOverflow = await tablet.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const tabletCardPositions = await tablet.locator('.offering-card--store').evaluateAll((cards) =>
    cards.slice(0, 4).map((card) => Math.round(card.getBoundingClientRect().top)),
);
const tabletUsesThreeColumns = tabletCardPositions.length >= 4
    && tabletCardPositions[0] === tabletCardPositions[1]
    && tabletCardPositions[1] === tabletCardPositions[2]
    && tabletCardPositions[3] > tabletCardPositions[2];
await tablet.screenshot({ path: `${output}/laravel-store-tablet-1024.png`, fullPage: true });

await tablet.locator('[data-offering-open]').first().click();
await tablet.getByRole('dialog').waitFor();
const tabletDetailHasOptions = await tablet.getByRole('dialog').getByText('Opsi tambahan').isVisible();
const tabletHasOrderCta = await tablet.getByRole('dialog').getByText(/WhatsApp|Pesan sekarang|Checkout/i).count() > 0;
await tablet.screenshot({ path: `${output}/laravel-store-detail-1024.png`, fullPage: true });
await tablet.getByRole('button', { name: 'Tutup detail' }).click();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (message) => {
    if (message.type() === 'error') mobileErrors.push(`console: ${message.text()}`);
});
mobile.on('pageerror', (error) => mobileErrors.push(`pageerror: ${error.message}`));

await mobile.goto(`${baseUrl}/m/saga-coffee/main-menu`, { waitUntil: 'networkidle' });
await mobile.getByText('Bio Menu', { exact: true }).waitFor();
const mobileCategories = await mobile.locator('[data-collection-link]').count();
const mobileCards = await mobile.locator('.offering-card--mobile').count();
const mobileOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const categoryAboveFirstCard = await mobile.evaluate(() => {
    const category = document.querySelector('[data-collection-link]');
    const card = document.querySelector('.offering-card--mobile');
    return Boolean(category && card && category.getBoundingClientRect().top < card.getBoundingClientRect().top);
});
await mobile.screenshot({ path: `${output}/laravel-bio-mobile-390.png`, fullPage: true });

await mobile.locator('[data-offering-open]').first().click();
await mobile.getByRole('dialog').waitFor();
const mobileDialogOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const mobileDetailHasOptions = await mobile.getByRole('dialog').getByText('Opsi tambahan').isVisible();
const mobileHasOrderCta = await mobile.getByRole('dialog').getByText(/WhatsApp|Pesan sekarang|Checkout/i).count() > 0;
await mobile.screenshot({ path: `${output}/laravel-bio-detail-390.png`, fullPage: true });

await browser.close();

const result = {
    baseUrl,
    tabletCategories,
    tabletCards,
    tabletOverflow,
    tabletUsesThreeColumns,
    tabletDetailHasOptions,
    tabletHasOrderCta,
    mobileCategories,
    mobileCards,
    mobileOverflow,
    mobileDialogOverflow,
    categoryAboveFirstCard,
    mobileDetailHasOptions,
    mobileHasOrderCta,
    errors,
    mobileErrors,
};

const failed = tabletCategories < 3
    || tabletCards < 8
    || tabletOverflow
    || !tabletUsesThreeColumns
    || !tabletDetailHasOptions
    || tabletHasOrderCta
    || mobileCategories < 3
    || mobileCards < 8
    || mobileOverflow
    || mobileDialogOverflow
    || !categoryAboveFirstCard
    || !mobileDetailHasOptions
    || mobileHasOrderCta
    || errors.length > 0
    || mobileErrors.length > 0;

console.log(JSON.stringify({ failed, result }, null, 2));
process.exitCode = failed ? 1 : 0;
