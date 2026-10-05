// Teste da troca de abas: clica nas abas e captura a cortina e o resultado.
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
await page.setViewport({ width: 1440, height: 900 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const state = () => page.evaluate(() => ({
  hash: location.hash,
  theme: document.body.dataset.theme,
  visible: [...document.querySelectorAll('[data-ph]')].filter((a) => !a.hidden).map((a) => a.dataset.ph),
  scrollY: Math.round(window.scrollY),
  canvasIn: document.querySelector('[data-ph]:not([hidden]) [data-gl-slot] canvas') ? 'yes' : 'no',
  triggers: window.ScrollTrigger ? 'n/a' : undefined,
  title: document.title,
}));

await page.goto('http://localhost:5199/', { waitUntil: 'load' });
await page.waitForFunction(() => !document.querySelector('.curtain.is-active'), { timeout: 60000 });
await wait(3000);
console.log('inicial', await state());

// rola um pouco e troca de aba pelo menu
await page.evaluate(() => window.scrollTo(0, 2500));
await wait(800);
// rolar um pouco para cima revela o cabeçalho, que se esconde ao descer
await page.mouse.move(700, 500);
await page.mouse.wheel({ deltaY: -200 });
await wait(900);
await page.click('[data-tab="plato"]');
await wait(700);
await page.screenshot({ path: 'tools/shots/sw-0.png' });
await page.waitForFunction(() => !document.querySelector('.curtain.is-active'), { timeout: 60000 });
await wait(3200);
console.log('após clicar Platão', await state());
await page.screenshot({ path: 'tools/shots/sw-1.png' });

// usa o link "Ir para Aristóteles" no fim da página
await page.evaluate(() => document.querySelector('[data-ph="plato"] .next .btn').scrollIntoView());
await wait(800);
await page.evaluate(() => document.querySelector('[data-ph="plato"] .next .btn').click());
await page.waitForFunction(() => !document.querySelector('.curtain.is-active'), { timeout: 60000 });
await wait(3200);
console.log('após "Ir para Aristóteles"', await state());

// voltar no histórico
await page.goBack();
await page.waitForFunction(() => location.hash === '#/platao' && !document.querySelector('.curtain.is-active'), { timeout: 60000 });
await wait(3000);
console.log('após voltar', await state());

// rolar na aba nova: as animações por rolagem continuam funcionando?
await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-ph="plato"] .thesis').offsetTop + 200));
await wait(2000);
await page.screenshot({ path: 'tools/shots/sw-2.png' });

// abre uma ideia
await page.evaluate(() => document.querySelector('[data-ph="plato"] .idea__row').scrollIntoView({ block: 'center' }));
await wait(800);
await page.evaluate(() => document.querySelector('[data-ph="plato"] .idea__row').click());
await wait(1500);
await page.screenshot({ path: 'tools/shots/sw-3.png' });
console.log('ideia aberta:', await page.evaluate(() => document.querySelector('[data-ph="plato"] .idea__row').getAttribute('aria-expanded')));

console.log('erros:', errors.length ? errors : 'nenhum');
await browser.close();
