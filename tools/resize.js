// Uso: node tools/resize.js  — redimensiona as pinturas em public/img usando o Chrome headless.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const jobs = [
  // [entrada, saída, largura máx., recorte [x, y, w, h] em frações]
  ['tools/raw/img/socrates.jpg', 'public/img/socrates.jpg', 1800, null],
  ['tools/raw/img/athens.jpg', 'public/img/plato.jpg', 1400, [0.36, 0.12, 0.28, 0.62]],
  ['tools/raw/img/aristotle.jpg', 'public/img/aristotle.jpg', 1400, null],
];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.goto('http://localhost:5199/tools/resize.html');
for (const [src, out, w, crop] of jobs) {
  const r = await page.evaluate((s, w, c) => window.resize(s, w, c), '/' + src, w, crop);
  fs.writeFileSync(out, Buffer.from(r.data, 'base64'));
  console.log(out, `${r.w}x${r.h}`, (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
}
await browser.close();
