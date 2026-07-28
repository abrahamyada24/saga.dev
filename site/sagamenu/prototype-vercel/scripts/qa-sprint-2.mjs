import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = fileURLToPath(new URL('../qa', import.meta.url));
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

await page.getByRole('button', { name: 'Tambah menu' }).click();
let editor = page.locator('[data-item-editor]');
const createMode = {
    mode: await editor.getAttribute('data-mode'),
    title: await editor.locator('[data-editor-title]').textContent(),
    context: await editor.locator('[data-editor-context]').textContent(),
    stepperVisible: await editor.locator('.item-wizard-steps').isVisible(),
    stepCount: await editor.locator('[data-action="item-step"]').count(),
    editNavigationHidden: await editor.locator('[data-edit-sections]').isHidden(),
    createFooterVisible: await editor.locator('[data-create-footer]').isVisible(),
    editFooterHidden: await editor.locator('[data-edit-footer]').isHidden(),
    visiblePanels: await editor.locator('[data-wizard-panel]:visible').count(),
};

await editor.locator('input[name="name"]').fill('Sprint Two Espresso Tonic');
await editor.locator('select[name="categoryId"]').selectOption('coffee');
await editor.locator('input[name="price"]').fill('34000');
await editor.locator('textarea[name="description"]').fill('Espresso segar dengan tonic untuk pengujian Sprint 2.');
await editor.getByRole('button', { name: /Lanjut: Foto & media/ }).click();
await editor.getByRole('button', { name: /Lanjut: Pilihan & detail/ }).click();
await editor.getByRole('button', { name: /Lanjut: Review/ }).click();

const reviewMode = {
    reviewVisible: await editor.getByRole('heading', { name: 'Review sebelum membuat menu.' }).isVisible(),
    primaryVisible: await editor.getByRole('button', { name: 'Buat menu sebagai draft' }).isVisible(),
    addAnotherVisible: await editor.getByRole('button', { name: 'Buat & tambah lagi' }).isVisible(),
};

await page.screenshot({ path: `${output}/sprint-2-create-review-desktop.png` });
await editor.getByRole('button', { name: 'Buat & tambah lagi' }).click();
await page.locator('[data-item-row]').filter({ hasText: 'Sprint Two Espresso Tonic' }).waitFor();
editor = page.locator('[data-item-editor]');
await editor.waitFor({ state: 'visible' });
const addAnother = {
    newCreateOpen: await editor.getAttribute('data-mode'),
    newName: await editor.locator('input[name="name"]').inputValue(),
    createdRowVisible: await page.locator('[data-item-row]').filter({ hasText: 'Sprint Two Espresso Tonic' }).isVisible(),
};
await editor.getByRole('button', { name: 'Tutup wizard tambah menu' }).click();

let itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Two Espresso Tonic' });
await itemRow.getByRole('button', { name: 'Edit Sprint Two Espresso Tonic' }).click();
editor = page.locator('[data-item-editor]');
const editMode = {
    mode: await editor.getAttribute('data-mode'),
    title: await editor.locator('[data-editor-title]').textContent(),
    context: await editor.locator('[data-editor-context]').textContent(),
    stepperHidden: await editor.locator('.item-wizard-steps').isHidden(),
    editNavigationVisible: await editor.locator('[data-edit-sections]').isVisible(),
    createFooterHidden: await editor.locator('[data-create-footer]').isHidden(),
    editFooterVisible: await editor.locator('[data-edit-footer]').isVisible(),
    visibleWorkSections: await editor.locator('[data-wizard-panel="1"]:visible, [data-wizard-panel="2"]:visible, [data-wizard-panel="3"]:visible').count(),
    reviewHidden: await editor.locator('[data-wizard-panel="4"]').isHidden(),
    saveLaterCount: await editor.getByRole('button', { name: 'Simpan & lanjut nanti' }).count(),
};

await editor.getByRole('button', { name: 'Media', exact: true }).click();
const editNavigation = {
    photoActive: await editor.getByRole('button', { name: 'Media', exact: true }).getAttribute('class'),
    mediaVisible: await editor.locator('[data-media-upload-zone]').isVisible(),
};

await editor.locator('input[name="name"]').fill('');
await editor.getByRole('button', { name: 'Simpan perubahan' }).click();
const editValidation = {
    summaryVisible: await editor.getByText('Periksa informasi wajib.').isVisible(),
    messageVisible: await editor.getByText('Masukkan nama menu.').isVisible(),
    focusedField: await page.evaluate(() => document.activeElement?.getAttribute('name')),
};
await editor.locator('input[name="name"]').fill('Sprint Two Espresso Tonic');
await editor.locator('input[name="price"]').fill('36000');
await editor.locator('textarea[name="description"]').fill('Deskripsi diperbarui langsung dari focused edit workspace.');
await editor.getByRole('button', { name: 'Simpan perubahan' }).click();

itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Two Espresso Tonic' });
await itemRow.waitFor();
const savedEditRow = await itemRow.innerText();

await itemRow.getByRole('button', { name: 'Edit Sprint Two Espresso Tonic' }).click();
editor = page.locator('[data-item-editor]');
await editor.locator('input[name="price"]').fill('37000');
await editor.getByText('Perubahan edit tersimpan di browser').waitFor();
await editor.getByRole('button', { name: 'Tutup', exact: true }).click();
await itemRow.getByRole('button', { name: 'Edit Sprint Two Espresso Tonic' }).click();
editor = page.locator('[data-item-editor]');
const autosaveRecovery = {
    statusVisible: await editor.getByText('Perubahan edit dipulihkan dari browser').isVisible(),
    price: await editor.locator('input[name="price"]').inputValue(),
};

await editor.locator('input[name="price"]').fill('38000');
const guardedPendingValue = await editor.locator('input[name="price"]').inputValue();
await page.waitForTimeout(60);
page.once('dialog', (dialog) => dialog.accept());
await editor.getByRole('button', { name: 'Tutup edit Sprint Two Espresso Tonic' }).click();
const guardedStoredValue = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) => entry.startsWith('sagamenu-prototype-item-editor-edit-v1:'));
    return key ? JSON.parse(localStorage.getItem(key) || '{}').price : null;
});
await itemRow.getByRole('button', { name: 'Edit Sprint Two Espresso Tonic' }).click();
editor = page.locator('[data-item-editor]');
const guardedCloseRecovery = await editor.locator('input[name="price"]').inputValue();
await page.screenshot({ path: `${output}/sprint-2-focused-edit-desktop.png` });
await editor.getByRole('button', { name: 'Simpan perubahan' }).click();

await page.setViewportSize({ width: 390, height: 844 });
itemRow = page.locator('[data-item-row]').filter({ hasText: 'Sprint Two Espresso Tonic' });
await itemRow.getByRole('button', { name: 'Edit Sprint Two Espresso Tonic' }).click();
editor = page.locator('[data-item-editor]');
const mobileEdit = {
    navigationVisible: await editor.locator('[data-edit-sections]').isVisible(),
    editFooterVisible: await editor.locator('[data-edit-footer]').isVisible(),
    closeVisible: await editor.getByRole('button', { name: 'Tutup', exact: true }).isVisible(),
    saveVisible: await editor.getByRole('button', { name: 'Simpan perubahan' }).isVisible(),
    mainScrollTop: await editor.locator('.item-wizard-main').evaluate((element) => element.scrollTop),
    contentScrollTop: await editor.locator('.item-wizard-content').evaluate((element) => element.scrollTop),
    documentOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
    editorOverflow: await editor.evaluate((dialog) => dialog.scrollWidth > dialog.clientWidth + 1),
};
await page.screenshot({ path: `${output}/sprint-2-focused-edit-mobile.png` });
await editor.getByRole('button', { name: 'Tutup', exact: true }).click();

await page.getByRole('button', { name: 'Tambah menu' }).click();
editor = page.locator('[data-item-editor]');
const mobileCreate = {
    stepperVisible: await editor.locator('.item-wizard-steps').isVisible(),
    createFooterVisible: await editor.locator('[data-create-footer]').isVisible(),
    saveLaterVisible: await editor.getByRole('button', { name: 'Simpan & lanjut nanti' }).isVisible(),
    documentOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
    editorOverflow: await editor.evaluate((dialog) => dialog.scrollWidth > dialog.clientWidth + 1),
};
await editor.locator('input[name="name"]').fill('Menu Review Mobile');
await editor.locator('select[name="categoryId"]').selectOption('coffee');
await editor.locator('input[name="price"]').fill('25000');
await editor.getByRole('button', { name: /Lanjut: Foto & media/ }).click();
await editor.getByRole('button', { name: /Lanjut: Pilihan & detail/ }).click();
await editor.getByRole('button', { name: /Lanjut: Review/ }).click();
const mobileReview = await editor.locator('[data-create-footer] > div').evaluate((container) => {
    const buttons = [...container.querySelectorAll('button:not([hidden])')];
    const bounds = buttons.map((button) => {
        const box = button.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    });
    return {
        buttonCount: buttons.length,
        withinViewport: bounds.every((box) => box.left >= 0 && box.right <= window.innerWidth),
        noOverlap: bounds.every((box, index) => bounds.slice(index + 1).every((other) =>
            box.right <= other.left || other.right <= box.left || box.bottom <= other.top || other.bottom <= box.top
        )),
    };
});
await page.screenshot({ path: `${output}/sprint-2-create-review-mobile.png` });
await editor.getByRole('button', { name: 'Simpan & lanjut nanti' }).click();

await browser.close();

const result = {
    baseUrl,
    createMode,
    reviewMode,
    addAnother,
    editMode,
    editNavigation,
    editValidation,
    savedEditRow,
    autosaveRecovery,
    guardedPendingValue,
    guardedStoredValue,
    guardedCloseRecovery,
    mobileEdit,
    mobileCreate,
    mobileReview,
    consoleErrors,
    pageErrors,
};
console.log(JSON.stringify(result, null, 2));

const passed = [
    createMode.mode === 'create',
    createMode.title === 'Tambah menu',
    createMode.context.includes('empat langkah'),
    createMode.stepperVisible,
    createMode.stepCount === 4,
    createMode.editNavigationHidden,
    createMode.createFooterVisible,
    createMode.editFooterHidden,
    createMode.visiblePanels === 1,
    reviewMode.reviewVisible,
    reviewMode.primaryVisible,
    reviewMode.addAnotherVisible,
    addAnother.newCreateOpen === 'create',
    addAnother.newName === '',
    addAnother.createdRowVisible,
    editMode.mode === 'edit',
    editMode.title === 'Sprint Two Espresso Tonic',
    editMode.context.includes('tanpa mengulang wizard'),
    editMode.stepperHidden,
    editMode.editNavigationVisible,
    editMode.createFooterHidden,
    editMode.editFooterVisible,
    editMode.visibleWorkSections === 3,
    editMode.reviewHidden,
    editMode.saveLaterCount === 0,
    editNavigation.photoActive?.includes('is-active'),
    editNavigation.mediaVisible,
    editValidation.summaryVisible,
    editValidation.messageVisible,
    editValidation.focusedField === 'name',
    savedEditRow.includes('Rp 36.000'),
    autosaveRecovery.statusVisible,
    autosaveRecovery.price === '37000',
    guardedPendingValue === '38000',
    guardedStoredValue === 38000,
    guardedCloseRecovery === '38000',
    mobileEdit.navigationVisible,
    mobileEdit.editFooterVisible,
    mobileEdit.closeVisible,
    mobileEdit.saveVisible,
    mobileEdit.mainScrollTop === 0,
    mobileEdit.contentScrollTop === 0,
    !mobileEdit.documentOverflow,
    !mobileEdit.editorOverflow,
    mobileCreate.stepperVisible,
    mobileCreate.createFooterVisible,
    mobileCreate.saveLaterVisible,
    !mobileCreate.documentOverflow,
    !mobileCreate.editorOverflow,
    mobileReview.buttonCount === 3,
    mobileReview.withinViewport,
    mobileReview.noOverlap,
    consoleErrors.length === 0,
    pageErrors.length === 0,
].every(Boolean);

process.exitCode = passed ? 0 : 1;
