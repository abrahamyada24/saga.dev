import { readFile } from 'node:fs/promises';

const files = {
    html: await readFile('index.html', 'utf8'),
    css: await readFile('styles.css', 'utf8'),
    js: await readFile('app.js', 'utf8'),
    vercel: JSON.parse(await readFile('vercel.json', 'utf8')),
};

const requiredHtml = [
    'data-dashboard',
    'data-preview-shell',
    'data-item-editor',
    'data-simple-dialog',
    'data-menu-detail',
];

const requiredJs = [
    'renderOverview',
    'renderMenus',
    'renderCategories',
    'renderAddons',
    'renderAppearance',
    'renderPublish',
    'renderAnalytics',
    'renderPublicMenu',
    'localStorage',
];

const failures = [];
for (const marker of requiredHtml) {
    if (!files.html.includes(marker)) failures.push(`Missing HTML marker: ${marker}`);
}
for (const marker of requiredJs) {
    if (!files.js.includes(marker)) failures.push(`Missing JS marker: ${marker}`);
}
if (!files.css.includes('@media (max-width: 580px)')) failures.push('Missing mobile breakpoint');
if (!files.vercel.rewrites?.length) failures.push('Missing Vercel SPA rewrite');
if (/sk_live_|sk_test_|AKIA[0-9A-Z]{16}|PRIVATE KEY/.test(Object.values(files).join('\n'))) {
    failures.push('Potential secret pattern detected');
}

const declaredActions = new Set(
    [...`${files.html}\n${files.js}`.matchAll(/data-action=["']([a-z0-9-]+)["']/g)].map((match) => match[1]),
);
const handledActions = new Set(
    [...files.js.matchAll(/action === '([a-z0-9-]+)'/g)].map((match) => match[1]),
);
const delegatedActions = new Set(['close-simple-dialog', 'close-detail']);
for (const action of declaredActions) {
    if (!handledActions.has(action) && !delegatedActions.has(action)) {
        failures.push(`Action has no explicit handler: ${action}`);
    }
}

if (failures.length) {
    console.error(JSON.stringify({ result: 'failed', failures }, null, 2));
    process.exit(1);
}

console.log(JSON.stringify({
    result: 'passed',
    htmlBytes: files.html.length,
    cssBytes: files.css.length,
    jsBytes: files.js.length,
    routes: ['overview', 'menus', 'categories', 'addons', 'appearance', 'publish', 'analytics'],
    previews: ['mobile', 'tablet', 'maintenance'],
    actionsChecked: declaredActions.size,
}, null, 2));
