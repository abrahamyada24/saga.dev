import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8000';
const email = process.env.SAGA_MENU_QA_EMAIL || 'owner@sagamenu.local';
const password = process.env.SAGA_MENU_QA_PASSWORD || 'password';
const output = 'storage/app/qa-dashboard-wizard';

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];

page.on('console', (message) => {
    if (message.type() === 'error') {
        errors.push(`console: ${message.text()}`);
    }
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
await page.locator('#form\\.email').fill(email);
await page.locator('#form\\.password').fill(password);
await page.getByRole('button', { name: /sign in|masuk/i }).click();
await page.locator('.sm-editorial-dashboard').waitFor();

await page.goto(`${baseUrl}/admin/offerings/create`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Tambah menu' }).waitFor();

const stepNames = ['Informasi dasar', 'Foto & media', 'Pilihan & detail', 'Review'];
const stepVisibility = {};
for (const name of stepNames) {
    stepVisibility[name] = await page.getByText(name, { exact: true }).first().isVisible();
}

const fileInput = page.locator('input[type="file"]').first();
const uploadComponentConfig = await fileInput.locator('xpath=../..').getAttribute('x-data');
const acceptsImages = Boolean(
    uploadComponentConfig?.includes('acceptedFileTypes')
    && uploadComponentConfig.includes('image'),
);
const livePreviewVisible = await page.locator('.sm-offering-editor-preview:visible').first().isVisible();
const draftSafetyVisible = await page.getByText('Belum terlihat publik', { exact: true }).filter({ visible: true }).first().isVisible();
const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const fontFamily = await page.locator('body').evaluate((element) => getComputedStyle(element).fontFamily);
const hasPhotoUrlField = await page.getByText(/photo url|url foto/i).count() > 0;

await page.screenshot({ path: `${output}/create-wizard-1440.png`, fullPage: true });

const editResponse = await page.goto(`${baseUrl}/admin/offerings/1/edit`, { waitUntil: 'networkidle' });
const editVisible = editResponse?.ok() && await page.getByRole('heading', { name: 'Edit menu' }).isVisible();

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${baseUrl}/admin/offerings/create`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Tambah menu' }).waitFor();
const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const mobilePreviewVisible = await page.locator('.sm-offering-editor-preview:visible').first().isVisible();
await page.screenshot({ path: `${output}/create-wizard-390.png`, fullPage: true });

await browser.close();

const result = {
    baseUrl,
    stepVisibility,
    uploadAccept: acceptsImages ? 'image/*' : null,
    livePreviewVisible,
    draftSafetyVisible,
    desktopOverflow,
    mobileOverflow,
    mobilePreviewVisible,
    fontFamily,
    hasPhotoUrlField,
    editVisible,
    errors,
};

const failed = Object.values(stepVisibility).some((visible) => !visible)
    || !acceptsImages
    || !livePreviewVisible
    || !draftSafetyVisible
    || desktopOverflow
    || mobileOverflow
    || !mobilePreviewVisible
    || !fontFamily.includes('Plus Jakarta Sans')
    || hasPhotoUrlField
    || !editVisible
    || errors.length > 0;

console.log(JSON.stringify({ failed, result }, null, 2));
process.exitCode = failed ? 1 : 0;
