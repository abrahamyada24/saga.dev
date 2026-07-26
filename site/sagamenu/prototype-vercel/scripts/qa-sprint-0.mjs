import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const fixturePath = fileURLToPath(new URL('../assets/illustrations/empty-catalog.webp', import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleErrors = [];
const pageErrors = [];

page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(error.message));

await page.goto(`${baseUrl}/#menus`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

const addButton = page.getByRole('button', { name: 'Tambah menu' });
await addButton.click();
let editor = page.getByRole('dialog');

await editor.getByRole('button', { name: /Lanjut: Foto & media/ }).click();
const validation = {
    summary: await editor.getByText('Periksa informasi wajib.').isVisible(),
    nameMessage: await editor.getByText('Masukkan nama menu.').isVisible(),
    invalidState: await editor.locator('input[name="name"]').getAttribute('aria-invalid'),
    remainsOnStepOne: await editor.getByText('Langkah 1 dari 4').isVisible(),
};

await editor.locator('input[name="name"]').fill('Sprint Zero Cold Brew');
await editor.locator('select[name="categoryId"]').selectOption('coffee');
await editor.locator('input[name="price"]').fill('33000');
await editor.locator('textarea[name="description"]').fill('Cold brew ringan untuk acceptance test Sprint 0.');
await editor.locator('input[name="image"]').evaluate((input) => {
    input.value = 'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+';
    input.dispatchEvent(new Event('input', { bubbles: true }));
});
const unsafeDataImageRejected = await editor.locator('[data-editor-preview-image]').evaluate(
    (image) => image.src.startsWith('https://images.unsplash.com/'),
);
await editor.getByRole('button', { name: /Lanjut: Foto & media/ }).click();
await editor.locator('input[name="imageUpload"]').setInputFiles(fixturePath);
await editor.getByText('Foto selesai diproses dan tersimpan di draft').waitFor();

const uploadedValue = await editor.locator('input[name="image"]').inputValue();
const uploadPreview = await editor.locator('[data-editor-preview-image]').evaluate((image) => ({
    sourceMatches: image.src === document.querySelector('input[name="image"]').value,
    loaded: image.complete && image.naturalWidth > 0,
    sourcePrefix: image.src.slice(0, 24),
}));

await editor.getByRole('button', { name: 'Simpan & lanjut nanti' }).click();
await addButton.click();
editor = page.getByRole('dialog');
const createRecovery = {
    status: await editor.getByText('Draft dipulihkan dari browser').isVisible(),
    name: await editor.locator('input[name="name"]').inputValue(),
    imagePrefix: (await editor.locator('input[name="image"]').inputValue()).slice(0, 24),
};

await editor.getByRole('button', { name: /4\s*Review/ }).click();
const review = {
    rows: await editor.locator('[data-review-check]').count(),
    description: await editor.locator('[data-review-check="description"]').innerText(),
    availability: await editor.locator('[data-review-check="availability"]').innerText(),
    choices: await editor.locator('[data-review-check="choices"]').innerText(),
};
await editor.getByRole('button', { name: 'Buat menu sebagai draft' }).click();

let itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Zero Cold Brew' });
await itemRow.waitFor();
const createdImage = await itemRow.locator('img').evaluate((image) => ({
    sourcePrefix: image.src.slice(0, 24),
    loaded: image.complete && image.naturalWidth > 0,
}));

await itemRow.getByRole('button', { name: 'Edit Sprint Zero Cold Brew' }).click();
editor = page.getByRole('dialog');
await editor.locator('input[name="price"]').fill('36000');
await editor.getByText('Perubahan edit tersimpan di browser').waitFor();
await editor.getByRole('button', { name: 'Simpan & lanjut nanti' }).click();

itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Zero Cold Brew' });
await itemRow.getByRole('button', { name: 'Edit Sprint Zero Cold Brew' }).click();
editor = page.getByRole('dialog');
const editRecovery = {
    status: await editor.getByText('Perubahan edit dipulihkan dari browser').isVisible(),
    price: await editor.locator('input[name="price"]').inputValue(),
};

await editor.locator('input[name="price"]').fill('37000');
page.once('dialog', (dialog) => dialog.accept());
await editor.getByRole('button', { name: 'Tutup editor' }).click();
itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Zero Cold Brew' });
await itemRow.getByRole('button', { name: 'Edit Sprint Zero Cold Brew' }).click();
editor = page.getByRole('dialog');
const guardedCloseRecovery = await editor.locator('input[name="price"]').inputValue();

await editor.getByRole('button', { name: /4\s*Review/ }).click();
await editor.getByRole('button', { name: 'Simpan perubahan' }).click();
itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Zero Cold Brew' });
const finalRow = await itemRow.innerText();

await page.setViewportSize({ width: 390, height: 844 });
await addButton.click();
editor = page.getByRole('dialog');
await editor.getByRole('button', { name: /Lanjut: Foto & media/ }).click();
const mobileValidationVisible = await editor.getByText('Masukkan nama menu.').isVisible();
const mobileFooterVisible = await editor.locator('.item-wizard-footer').isVisible();
await editor.locator('input[name="name"]').fill('Draft mobile sementara');
await editor.getByRole('button', { name: 'Simpan & lanjut nanti' }).click();

await browser.close();

const result = {
    baseUrl,
    validation,
    upload: {
        unsafeDataImageRejected,
        processedAsWebp: uploadedValue.startsWith('data:image/webp;base64,'),
        preview: uploadPreview,
        createdImage,
    },
    createRecovery,
    review,
    editRecovery,
    guardedCloseRecovery,
    finalRow,
    mobileValidationVisible,
    mobileFooterVisible,
    consoleErrors,
    pageErrors,
};

console.log(JSON.stringify(result, null, 2));

const passed = [
    validation.summary,
    validation.nameMessage,
    validation.invalidState === 'true',
    validation.remainsOnStepOne,
    unsafeDataImageRejected,
    result.upload.processedAsWebp,
    uploadPreview.sourceMatches,
    uploadPreview.loaded,
    createRecovery.status,
    createRecovery.name === 'Sprint Zero Cold Brew',
    createRecovery.imagePrefix.startsWith('data:image/webp'),
    review.rows === 8,
    review.description.includes('Cold brew ringan'),
    createdImage.sourcePrefix.startsWith('data:image/webp'),
    createdImage.loaded,
    editRecovery.status,
    editRecovery.price === '36000',
    guardedCloseRecovery === '37000',
    finalRow.includes('Rp 37.000'),
    mobileValidationVisible,
    mobileFooterVisible,
    consoleErrors.length === 0,
    pageErrors.length === 0,
].every(Boolean);

process.exitCode = passed ? 0 : 1;
