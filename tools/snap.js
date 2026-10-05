// Capturas de tela do site para conferência visual (Chrome headless).
// Uso: node tools/snap.js <rota> <prefixo> [largura] [altura] [posições de rolagem separadas por vírgula, em px ou "sel:#id"]
import puppeteer from 'puppeteer-core';

const [route = 'socrates', prefix = 'shot', w = '1440', h = '900', positions = '0'] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const page = await browser.newPage();
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console.log('[console]', m.type(), m.text()); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 650, hasTouch: +w < 650 });
await page.goto(`http://localhost:5199/#/${route}`, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction(() => !document.querySelector('.curtain.is-active'), { timeout: 60000 });
await new Promise((r) => setTimeout(r, 3800));

let i = 0;
for (const pos of positions.split(',')) {
  await page.evaluate(async (pos) => {
    let y = 0;
    if (pos.startsWith('sel:')) {
      const [sel, off = '0'] = pos.slice(4).split('+');
      const el = [...document.querySelectorAll(sel)].find((e) => e.offsetParent !== null);
      y = (el ? el.getBoundingClientRect().top + window.scrollY : 0) + +off;
    } else y = +pos;
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
    window.scrollTo(0, y);
  }, pos);
  await new Promise((r) => setTimeout(r, 1800));
  const out = `tools/shots/${prefix}-${i++}.png`;
  await page.screenshot({ path: out });
  console.log('saved', out, 'scrollY', await page.evaluate(() => Math.round(window.scrollY)), 'docH', await page.evaluate(() => document.documentElement.scrollHeight));
}
await browser.close();
