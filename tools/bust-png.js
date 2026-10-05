// Gera public/img/<id>-bust.png (imagem reserva do hero para navegadores sem WebGL).
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
for (const id of ['socrates', 'plato', 'aristotle']) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.setViewport({ width: 800, height: 1000 });
  await page.goto(`http://localhost:5199/tools/bust-png.html?id=${id}`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.title === 'ready', { timeout: 60000 });
  await page.screenshot({ path: `public/img/${id}-bust.png`, omitBackground: true });
  console.log('ok', id);
  await page.close();
}
await browser.close();
