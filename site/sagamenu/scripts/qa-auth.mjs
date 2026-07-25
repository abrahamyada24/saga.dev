import { chromium } from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.SAGA_MENU_URL || 'http://127.0.0.1:8095';
const output = 'storage/app/qa-auth';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const cases = [
    ['signup-mobile', '/signup', { width: 390, height: 844 }],
    ['login-mobile', '/login', { width: 390, height: 844 }],
    ['status-tablet', '/account-status', { width: 768, height: 1024 }],
    ['signup-desktop', '/signup', { width: 1440, height: 900 }],
];
const results = [];

for (const [name, path, viewport] of cases) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    const metrics = await page.evaluate(() => {
        const main = document.querySelector('main');
        const heading = document.querySelector('#auth-title');

        return {
            horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            mainVisible: Boolean(main && main.getBoundingClientRect().width > 0 && main.getBoundingClientRect().height > 0),
            headingVisible: Boolean(heading && heading.getBoundingClientRect().height > 0),
            unlabeledInputs: [...document.querySelectorAll('input:not([type="hidden"]), select')]
                .filter((input) => !input.id || !document.querySelector(`label[for="${input.id}"]`)).length,
        };
    });
    results.push({ name, status: response?.status(), errors, ...metrics });
    await page.close();
}

await browser.close();

const failed = results.some((result) =>
    result.status !== 200
    || result.errors.length > 0
    || result.horizontalOverflow
    || !result.mainVisible
    || !result.headingVisible
    || result.unlabeledInputs > 0
);

console.log(JSON.stringify(results, null, 2));
if (failed) process.exitCode = 1;
