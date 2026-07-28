import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../assets/video/es-kopi-susu-aren.webm', import.meta.url));
await mkdir(fileURLToPath(new URL('../assets/video', import.meta.url)), { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const dataUrl = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 540;
    const context = canvas.getContext('2d');
    const stream = canvas.captureStream(20);
    const chunks = [];
    const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 560_000,
    });

    recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
    };

    const stopped = new Promise((resolve) => {
        recorder.onstop = resolve;
    });

    recorder.start();
    const start = performance.now();
    while (performance.now() - start < 3200) {
        const elapsed = (performance.now() - start) / 3200;
        const pulse = 1 + Math.sin(elapsed * Math.PI) * 0.035;
        context.fillStyle = '#f3f5f1';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.translate(canvas.width / 2, canvas.height / 2 - 16);
        context.scale(pulse, pulse);
        context.fillStyle = '#20231f';
        context.beginPath();
        context.roundRect(-145, -155, 290, 300, 34);
        context.fill();
        context.fillStyle = '#cbf45a';
        context.beginPath();
        context.roundRect(-118, -128, 236, 246, 28);
        context.fill();
        context.fillStyle = '#ffffff';
        context.globalAlpha = 0.82;
        context.beginPath();
        context.ellipse(0, -75, 92, 32, 0, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
        context.fillStyle = '#8b4f2f';
        context.beginPath();
        context.ellipse(0, -69, 78, 25, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#fff7e9';
        context.font = '700 26px sans-serif';
        context.textAlign = 'center';
        context.fillText('ES KOPI', 0, 30);
        context.fillText('SUSU AREN', 0, 64);
        context.restore();

        context.fillStyle = '#236354';
        context.font = '700 18px sans-serif';
        context.textAlign = 'center';
        context.fillText('Bachelor Coffee', canvas.width / 2, 478);
        await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    recorder.stop();
    await stopped;
    const blob = new Blob(chunks, { type: 'video/webm' });
    return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
});

await browser.close();
await writeFile(output, Buffer.from(dataUrl.split(',')[1], 'base64'));
console.log(JSON.stringify({ output, bytes: Buffer.byteLength(dataUrl.split(',')[1], 'base64') }, null, 2));
