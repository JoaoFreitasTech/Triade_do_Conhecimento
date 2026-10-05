// Usage: node tools/shot.js <url> <out.png> [width] [height] [waitForTitlePrefix]
import puppeteer from 'puppeteer-core';
const [url, out, w = '1600', h = '500', waitTitle = ''] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.type(), m.text()); });
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.setViewport({ width: +w, height: +h });
await page.goto(url, { waitUntil: 'load', timeout: 120000 });
if (waitTitle) await page.waitForFunction(t => document.title.startsWith(t), { timeout: 60000 }, waitTitle);
else await new Promise(r => setTimeout(r, 2500));
console.log('title:', await page.title());
await page.screenshot({ path: out });
await browser.close();
