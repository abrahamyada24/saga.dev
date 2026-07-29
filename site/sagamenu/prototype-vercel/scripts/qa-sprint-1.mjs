import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const output = 'qa';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(error.message));

await page.goto(`${baseUrl}/#overview`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

const globalPreview = page.getByRole('button', { name: 'Preview menu' });
const globalPublish = page.getByRole('button', { name: 'Tinjau & terbitkan' });
const overviewHead = page.locator('.page-head');
const hierarchy = {
    globalPreviewCount: await globalPreview.count(),
    globalPublishCount: await globalPublish.count(),
    overviewHeadButtons: await overviewHead.getByRole('button').allTextContents(),
    overviewDirectPreview: await overviewHead.getByRole('button', { name: /preview/i }).count(),
    overviewDirectPublish: await overviewHead.getByRole('button', { name: /terbit/i }).count(),
    staticPublishRailButtons: await page.locator('.publish-rail-card button').count(),
};

await globalPreview.click();
const launcher = page.locator('#global-preview-menu');
const launcherOpen = {
    expanded: await globalPreview.getAttribute('aria-expanded'),
    bioVisible: await launcher.getByRole('menuitem', { name: /Bio Menu/ }).isVisible(),
    storeVisible: await launcher.getByRole('menuitem', { name: /Store Display/ }).isVisible(),
    focusedAfterOpen: await page.evaluate(() => document.activeElement?.textContent.includes('Bio Menu')),
};
await page.keyboard.press('ArrowDown');
const arrowNavigationWorked = await page.evaluate(() => document.activeElement?.textContent.includes('Store Display'));
await page.keyboard.press('Escape');
const launcherEscape = {
    hidden: await launcher.isHidden(),
    focusReturned: await globalPreview.evaluate((button) => document.activeElement === button),
};

await globalPreview.click();
await launcher.getByRole('menuitem', { name: /Bio Menu/ }).click();
await page.locator('[data-preview-shell]').waitFor({ state: 'visible' });
const previewOpened = {
    hash: await page.evaluate(() => location.hash),
    mobileMenuVisible: await page.locator('[data-preview-stage] .mobile-public-body').isVisible(),
};
await page.getByRole('button', { name: 'Kembali ke dashboard' }).click();

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.getByRole('button', { name: /^Menu & Katalog/ }).click();
await page.getByRole('heading', { name: 'Menu', exact: true }).waitFor();
await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 2000 });
const routeScrollReset = await page.evaluate(() => window.scrollY === 0);
const menuHead = page.locator('.page-head');
const menuHierarchy = {
    buttons: await menuHead.getByRole('button').allTextContents(),
    previewCount: await menuHead.getByRole('button', { name: /preview/i }).count(),
    addCount: await menuHead.getByRole('button', { name: 'Tambah menu' }).count(),
};

let firstRow = page.locator('[data-item-row]').filter({ hasText: 'Es Kopi Susu Aren' });
const rowHierarchy = {
    quickButtons: await firstRow.getByRole('button').count(),
    availabilityVisible: await firstRow.locator('[data-inline-field="availability"]').isVisible(),
    editVisible: await firstRow.getByRole('button', { name: 'Edit Es Kopi Susu Aren' }).isVisible(),
    overflowVisible: await firstRow.getByLabel('Aksi lainnya Es Kopi Susu Aren').isVisible(),
    duplicateHiddenBeforeOpen: await firstRow.getByRole('menuitem', { name: 'Duplikat Es Kopi Susu Aren' }).isHidden(),
};

await firstRow.getByLabel('Aksi lainnya Es Kopi Susu Aren').click();
const overflowOpen = {
    duplicateVisible: await firstRow.getByRole('menuitem', { name: 'Duplikat Es Kopi Susu Aren' }).isVisible(),
    deleteVisible: await firstRow.getByRole('menuitem', { name: 'Hapus Es Kopi Susu Aren' }).isVisible(),
};
await firstRow.getByRole('menuitem', { name: 'Duplikat Es Kopi Susu Aren' }).click();
let copyRow = page.locator('[data-item-row]').filter({ hasText: 'Es Kopi Susu Aren Copy' });
await copyRow.waitFor();
const duplicateWorked = await copyRow.isVisible();

await copyRow.getByLabel('Aksi lainnya Es Kopi Susu Aren Copy').click();
page.once('dialog', (dialog) => dialog.accept());
await copyRow.getByRole('menuitem', { name: 'Hapus Es Kopi Susu Aren Copy' }).click();
await copyRow.waitFor({ state: 'detached' });
const deleteWorked = await page.locator('[data-item-row]').filter({ hasText: 'Es Kopi Susu Aren Copy' }).count() === 0;

firstRow = page.locator('[data-item-row]').filter({ hasText: 'Es Kopi Susu Aren' });
await firstRow.getByLabel('Aksi lainnya Es Kopi Susu Aren').click();
await page.locator('[data-menu-search]').click();
const outsideClickClosed = await firstRow.locator('.row-action-menu').evaluate((details) => !details.open);
await firstRow.getByLabel('Aksi lainnya Es Kopi Susu Aren').click();
await page.keyboard.press('Escape');
const rowEscape = {
    closed: await firstRow.locator('.row-action-menu').evaluate((details) => !details.open),
    focusReturned: await firstRow.getByLabel('Aksi lainnya Es Kopi Susu Aren').evaluate(
        (summary) => document.activeElement === summary,
    ),
};

const lastRow = page.locator('[data-item-row]').filter({ hasText: 'Coffee Date Bundle' });
await lastRow.scrollIntoViewIfNeeded();
await lastRow.getByLabel('Aksi lainnya Coffee Date Bundle').click();
const bottomPopoverOpensUp = await lastRow.evaluate((row) => {
    const summary = row.querySelector('summary').getBoundingClientRect();
    const popover = row.querySelector('.row-action-popover').getBoundingClientRect();
    return popover.bottom <= summary.top;
});
await page.keyboard.press('Escape');
await page.screenshot({ path: `${output}/sprint-1-menu-actions-desktop.png`, fullPage: false });

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle' });
const mobileGlobalPreview = page.getByRole('button', { name: 'Preview menu' });
const mobileGlobalPublish = page.getByRole('button', { name: 'Tinjau & terbitkan' });
await mobileGlobalPreview.click();
const mobileLauncherBox = await launcher.boundingBox();
const mobileHierarchy = {
    globalPreviewVisible: await mobileGlobalPreview.isVisible(),
    globalPublishVisible: await mobileGlobalPublish.isVisible(),
    launcherVisible: await launcher.isVisible(),
    launcherWithinViewport: Boolean(
        mobileLauncherBox
        && mobileLauncherBox.x >= 0
        && mobileLauncherBox.x + mobileLauncherBox.width <= 390
    ),
    documentOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
};
await page.screenshot({ path: `${output}/sprint-1-hierarchy-mobile.png`, fullPage: false });
await page.keyboard.press('Escape');

await mobileGlobalPublish.click();
await page.getByRole('heading', { name: 'Preview & Terbitkan' }).waitFor();
const publishRoute = await page.evaluate(() => location.hash);

await browser.close();

const result = {
    baseUrl,
    hierarchy,
    launcherOpen,
    arrowNavigationWorked,
    launcherEscape,
    previewOpened,
    routeScrollReset,
    menuHierarchy,
    rowHierarchy,
    overflowOpen,
    duplicateWorked,
    deleteWorked,
    outsideClickClosed,
    rowEscape,
    bottomPopoverOpensUp,
    mobileHierarchy,
    publishRoute,
    consoleErrors,
    pageErrors,
};
console.log(JSON.stringify(result, null, 2));

const passed = [
    hierarchy.globalPreviewCount === 1,
    hierarchy.globalPublishCount === 1,
    hierarchy.overviewHeadButtons.length === 1,
    hierarchy.overviewHeadButtons[0].includes('Tambah menu'),
    hierarchy.overviewDirectPreview === 0,
    hierarchy.overviewDirectPublish === 0,
    hierarchy.staticPublishRailButtons === 0,
    launcherOpen.expanded === 'true',
    launcherOpen.bioVisible,
    launcherOpen.storeVisible,
    launcherOpen.focusedAfterOpen,
    arrowNavigationWorked,
    launcherEscape.hidden,
    launcherEscape.focusReturned,
    previewOpened.hash === '#preview-mobile',
    previewOpened.mobileMenuVisible,
    routeScrollReset,
    menuHierarchy.buttons.length === 2,
    menuHierarchy.buttons.includes('Shift mode'),
    menuHierarchy.previewCount === 0,
    menuHierarchy.addCount === 1,
    rowHierarchy.quickButtons === 3,
    rowHierarchy.availabilityVisible,
    rowHierarchy.editVisible,
    rowHierarchy.overflowVisible,
    rowHierarchy.duplicateHiddenBeforeOpen,
    overflowOpen.duplicateVisible,
    overflowOpen.deleteVisible,
    duplicateWorked,
    deleteWorked,
    outsideClickClosed,
    rowEscape.closed,
    rowEscape.focusReturned,
    bottomPopoverOpensUp,
    mobileHierarchy.globalPreviewVisible,
    mobileHierarchy.globalPublishVisible,
    mobileHierarchy.launcherVisible,
    mobileHierarchy.launcherWithinViewport,
    !mobileHierarchy.documentOverflow,
    publishRoute === '#publish',
    consoleErrors.length === 0,
    pageErrors.length === 0,
].every(Boolean);

process.exitCode = passed ? 0 : 1;
