import sharp from 'file:///C:/Users/Windows%2011/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js';
import { mkdir } from 'node:fs/promises';

const sourceRoot = '../storage/app/qa';
await mkdir('qa/comparisons', { recursive: true });

async function normalized(path, width, height) {
    return sharp(path)
        .resize(width, height, { fit: 'cover', position: 'top' })
        .png()
        .toBuffer();
}

async function sideBySide(leftPath, rightPath, output, width, height) {
    const [left, right] = await Promise.all([
        normalized(leftPath, width, height),
        normalized(rightPath, width, height),
    ]);
    await sharp({
        create: {
            width: width * 2 + 20,
            height,
            channels: 3,
            background: '#dce2de',
        },
    })
        .composite([
            { input: left, left: 0, top: 0 },
            { input: right, left: width + 20, top: 0 },
        ])
        .png()
        .toFile(output);
}

await sideBySide(
    `${sourceRoot}/admin-dashboard.png`,
    'qa/dashboard-1440.png',
    'qa/comparisons/dashboard-source-and-prototype.png',
    720,
    760,
);

await sideBySide(
    `${sourceRoot}/store-tablet-1024.png`,
    'qa/tablet-preview-1440.png',
    'qa/comparisons/tablet-source-and-prototype.png',
    720,
    540,
);

console.log(JSON.stringify({
    result: 'passed',
    outputs: [
        'qa/comparisons/dashboard-source-and-prototype.png',
        'qa/comparisons/tablet-source-and-prototype.png',
    ],
}, null, 2));
