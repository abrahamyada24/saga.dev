import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_PROTOTYPE_URL || 'http://127.0.0.1:4178';
const videoPath = fileURLToPath(new URL('../assets/video/es-kopi-susu-aren.webm', import.meta.url));
const output = fileURLToPath(new URL('../qa', import.meta.url));
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
});
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(error.message));

await page.goto(`${baseUrl}/#overview`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });

await page.getByRole('button', { name: 'Mode uji' }).click();
const pilot = page.locator('[data-pilot-dialog]');
const pilotTaskCount = await pilot.locator('[data-pilot-tasks] li').count();
await pilot.getByRole('button', { name: 'Mulai sesi' }).click();
await pilot.getByText(/Sesi aktif/).waitFor();
await pilot.getByRole('button', { name: 'Tutup mode uji' }).click();

await page.getByRole('button', { name: /^Menu & Katalog/ }).click();
await page.getByRole('button', { name: 'Tambah menu' }).click();
let editor = page.locator('[data-item-editor]');
await editor.locator('input[name="name"]').fill('Pilot Citrus Cold Brew');
await editor.locator('select[name="categoryId"]').selectOption({ index: 1 });
await editor.locator('input[name="price"]').fill('39000');
await editor.locator('textarea[name="description"]').fill('Cold brew dengan citrus untuk pilot usability.');
await editor.getByRole('button', { name: /Lanjut: Foto & media/ }).click();
await editor.getByRole('button', { name: /Lanjut: Pilihan & detail/ }).click();
await editor.getByRole('button', { name: /Lanjut: Review/ }).click();
await editor.getByRole('button', { name: 'Buat menu sebagai draft' }).click();
await page.locator('[data-item-row]').filter({ hasText: 'Pilot Citrus Cold Brew' }).waitFor();

const itemRow = page.locator('[data-item-row]').filter({ hasText: 'Es Kopi Susu Aren' });
await itemRow.getByRole('button', { name: 'Edit Es Kopi Susu Aren' }).click();
editor = page.locator('[data-item-editor]');
await editor.getByRole('button', { name: 'Media', exact: true }).click();
await editor.locator('[data-video-upload]').setInputFiles(videoPath);
await editor.locator('[data-editor-video-preview]').waitFor({ state: 'visible' });
const focalBox = await editor.locator('[data-focal-editor]').boundingBox();
if (!focalBox) throw new Error('Focal editor is not visible.');
await editor.locator('[data-focal-editor]').click({
    position: { x: focalBox.width * 0.72, y: focalBox.height * 0.34 },
});
const focalPoint = {
    x: await editor.locator('input[name="focalX"]').inputValue(),
    y: await editor.locator('input[name="focalY"]').inputValue(),
};
const uploadedVideo = {
    visible: await editor.locator('[data-editor-video-preview]').isVisible(),
    controls: await editor.locator('[data-editor-video-player]').getAttribute('controls') !== null,
    autoplay: await editor.locator('[data-editor-video-player]').getAttribute('autoplay'),
};
await page.screenshot({ path: `${output}/sprints-9-17-video-editor.png` });

await editor.getByRole('button', { name: 'Pilihan & detail', exact: true }).click();
await editor.getByRole('button', { name: 'Tambah varian' }).click();
const sheet = page.locator('[data-simple-dialog]');
await sheet.locator('input[name="name"]').fill('Ukuran Pilot');
await sheet.locator('input[name="required"]').check();
await sheet.locator('textarea[name="values"]').fill('Regular|0\nLarge|8000');
await sheet.getByRole('button', { name: 'Tambah varian' }).click();
const complexitySummary = await editor.locator('[data-editor-complexity-summary]').innerText();
await editor.getByRole('button', { name: 'Simpan perubahan' }).click();

await page.getByRole('button', { name: 'Preview menu' }).click();
await page.getByRole('menuitem', { name: /Bio Menu/ }).click();
await page.getByRole('button', { name: /Lihat detail Es Kopi Susu Aren/ }).click();
const detail = page.locator('[data-menu-detail]');
const publicVideo = {
    visible: await detail.locator('video').isVisible(),
    controls: await detail.locator('video').getAttribute('controls') !== null,
    muted: await detail.locator('video').getAttribute('muted') !== null,
    playsinline: await detail.locator('video').getAttribute('playsinline') !== null,
    preload: await detail.locator('video').getAttribute('preload'),
    autoplay: await detail.locator('video').getAttribute('autoplay'),
    literalNullVisible: await detail.getByText('null', { exact: true }).isVisible().catch(() => false),
};
await page.screenshot({ path: `${output}/sprints-9-17-video-detail.png` });
await detail.getByRole('button', { name: 'Tutup detail' }).click();
await page.getByRole('button', { name: 'Kembali ke dashboard' }).click();

await page.getByRole('button', { name: 'Tampilan' }).click();
await page.getByRole('button', { name: 'Preset' }).click();
await page.getByRole('button', { name: 'Compact Cards' }).click();
await page.getByRole('button', { name: 'Simpan tampilan' }).click();
await page.getByText('Tampilan disimpan').waitFor();

await page.getByRole('button', { name: 'Tinjau & terbitkan' }).click();
await page.getByRole('button', { name: 'Terbitkan perubahan' }).click();
await page.getByRole('heading', { name: 'Berhasil diterbitkan', exact: true }).waitFor();

await page.getByRole('button', { name: 'Mode uji' }).click();
await pilot.locator('[data-pilot-notes]').fill('Semua task otomatis selesai; satu hesitation sengaja ditandai untuk verifikasi.');
await pilot.getByRole('button', { name: 'Tandai ragu' }).click();
await pilot.getByRole('button', { name: 'Selesaikan sesi' }).click();
const completedTasks = await pilot.locator('[data-pilot-tasks] li.is-complete').count();
await page.screenshot({ path: `${output}/sprints-9-17-pilot.png` });

const downloadPromise = page.waitForEvent('download');
await pilot.getByRole('button', { name: 'Export report' }).click();
const download = await downloadPromise;
const reportPath = await download.path();
const report = JSON.parse(await readFile(reportPath, 'utf8'));
await pilot.getByRole('button', { name: 'Tutup mode uji' }).click();

await page.evaluate(() => {
    const key = 'sagamenu-prototype-editorial-kv-v2';
    const value = JSON.parse(localStorage.getItem(key));
    const base = value.items.find((item) => item.id !== 'es-kopi-susu-aren');
    for (let index = 1; index <= 80; index += 1) {
        value.items.push({
            ...base,
            id: `stress-${index}`,
            name: `Stress Menu ${String(index).padStart(2, '0')}`,
            video: '',
            videoName: '',
            videoDuration: 0,
        });
    }
    localStorage.setItem(key, JSON.stringify(value));
});
await page.goto(`${baseUrl}/#menus`, { waitUntil: 'networkidle' });
const stressRows = await page.locator('[data-item-row]').count();
const stressItems = await page.evaluate(() => {
    const value = JSON.parse(localStorage.getItem('sagamenu-prototype-editorial-kv-v2'));
    return value.items.length;
});
const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Preview menu' }).click();
await page.getByRole('menuitem', { name: /Bio Menu/ }).click();
await page.getByRole('button', { name: /Lihat detail Es Kopi Susu Aren/ }).click();
const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
const mobileVideoBox = await page.locator('[data-menu-detail] video').boundingBox();
await page.screenshot({ path: `${output}/sprints-9-17-mobile.png` });

const unnamedButtons = await page.locator('button').evaluateAll((buttons) => buttons.filter((button) => {
    const text = button.textContent.trim();
    const label = button.getAttribute('aria-label');
    const title = button.getAttribute('title');
    return !text && !label && !title;
}).length);

await browser.close();

const result = {
    baseUrl,
    pilotTaskCount,
    completedTasks,
    focalPoint,
    uploadedVideo,
    complexitySummary,
    publicVideo,
    pilotReport: {
        tasks: report.taskResults.length,
        allCompleted: report.taskResults.every((task) => task.completed),
        hesitations: report.hesitations,
        events: report.events.length,
        hasDirectPiiFields: ['name', 'email', 'phone', 'customer'].some((field) => Object.hasOwn(report, field)),
    },
    stressRows,
    stressItems,
    desktopOverflow,
    mobileOverflow,
    mobileVideoWidth: mobileVideoBox?.width || 0,
    unnamedButtons,
    consoleErrors,
    pageErrors,
};
console.log(JSON.stringify(result, null, 2));

const passed = [
    pilotTaskCount === 5,
    completedTasks === 5,
    Number(focalPoint.x) >= 65,
    Number(focalPoint.y) <= 40,
    uploadedVideo.visible,
    uploadedVideo.controls,
    uploadedVideo.autoplay === null,
    complexitySummary.includes('3 grup pilihan'),
    publicVideo.visible,
    publicVideo.controls,
    publicVideo.muted,
    publicVideo.playsinline,
    publicVideo.preload === 'metadata',
    publicVideo.autoplay === null,
    !publicVideo.literalNullVisible,
    report.taskResults.length === 5,
    report.taskResults.every((task) => task.completed),
    report.hesitations === 1,
    report.events.length >= 6,
    !result.pilotReport.hasDirectPiiFields,
    stressItems >= 90,
    stressRows >= 10 && stressRows < stressItems,
    !desktopOverflow,
    !mobileOverflow,
    result.mobileVideoWidth > 0 && result.mobileVideoWidth <= 390,
    unnamedButtons === 0,
    consoleErrors.length === 0,
    pageErrors.length === 0,
].every(Boolean);

process.exitCode = passed ? 0 : 1;
