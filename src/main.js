import './styles/main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { philosophers, byRoute, themes } from './data/index.js';
import { installTextures } from './core/textures.js';
import { BustStage } from './webgl/BustStage.js';
import { initHero, heroPrepare, heroIntro } from './sections/hero.js';
import { initThesis, initIdeas, initFeatured, initLab, initGlossary, initLife, initNext } from './sections/content.js';
import { initScenes } from './sections/scene.js';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
installTextures();

/* ---------- Rolagem suave (Lenis + ScrollTrigger) ---------- */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
// lerp: quanto menor, mais suave (e mais "deslizante") a rolagem. 0.1 = leve, 0.06 = suave, 0.04 = bem lenta.
// wheelMultiplier: distância percorrida por giro da roda do mouse (1 = padrão do sistema).
// No celular a rolagem continua nativa (syncTouch desligado), que é a mais natural ao toque.
const SCROLL = { lerp: 0.06, wheelMultiplier: 0.9 };
const lenis = new Lenis({
  lerp: reduce ? 1 : SCROLL.lerp,
  wheelMultiplier: SCROLL.wheelMultiplier,
  smoothWheel: !reduce,
});
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-anchor]');
  if (!a) return;
  const el = document.querySelector(a.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  lenis.scrollTo(el, { duration: reduce ? 0 : 1.8, easing: easeOutExpo });
});
document.querySelector('[data-top]')?.addEventListener('click', () => lenis.scrollTo(0, { duration: reduce ? 0 : 2.2, easing: easeOutExpo }));

/* ---------- Elementos globais ---------- */
const stage = new BustStage({ reduceMotion: reduce });
const header = document.querySelector('[data-sh]');
const pill = header.querySelector('.sh__pill');
const tabs = [...header.querySelectorAll('[data-tab]')];
const readMore = header.querySelector('[data-readmore]');
const curtain = document.querySelector('[data-curtain]');
const curtainName = curtain.querySelector('[data-curtain-name]');
const curtainGreek = curtain.querySelector('[data-curtain-greek]');
const curtainCount = curtain.querySelector('[data-count]');
const articles = Object.fromEntries([...document.querySelectorAll('[data-ph]')].map((el) => [el.dataset.ph, el]));
const themeColor = document.querySelector('meta[name="theme-color"]');
// O rodapé é comum às três abas: mostra só a paisagem do filósofo atual (se ele tiver uma).
const footer = document.querySelector('[data-footer]');
const footerScenes = [...footer.querySelectorAll('[data-scene-for]')];
initScenes(footer, null, { reduce });
// Nome do site: vem do <title> do index.html; a aba mostra "Filósofo · Nome do site".
const siteTitle = document.title;

function movePill() {
  const active = tabs.find((t) => t.getAttribute('aria-current') === 'page');
  if (!active) return;
  pill.style.setProperty('--x', `${active.offsetLeft}px`);
  pill.style.setProperty('--w', `${active.offsetWidth}px`);
}
window.addEventListener('resize', movePill);
document.fonts?.ready.then(movePill);

// Esconde o cabeçalho ao rolar para baixo e mostra ao rolar para cima.
let lastY = 0;
lenis.on('scroll', ({ scroll }) => {
  const down = scroll > lastY && scroll > 200;
  header.classList.toggle('is-hidden', down && !header.contains(document.activeElement));
  lastY = scroll;
});

function setChrome(p) {
  header.classList.remove('is-hidden');
  lastY = 0;
  document.body.dataset.theme = p.theme;
  footerScenes.forEach((el) => { el.hidden = el.dataset.sceneFor !== p.id; });
  tabs.forEach((t) => (t.dataset.tab === p.id ? t.setAttribute('aria-current', 'page') : t.removeAttribute('aria-current')));
  readMore.href = p.readMore.href;
  themeColor.setAttribute('content', themes[p.theme].aBg);
  document.title = `${p.name} · ${siteTitle}`;
  movePill();
}

/* ---------- Cortina ---------- */
const curtainIn = (p) => {
  curtain.dataset.theme = p.theme;
  curtainName.textContent = p.name;
  curtainGreek.textContent = p.greek;
  curtainCount.textContent = '000';
  curtain.classList.add('is-active');
  if (reduce) return Promise.resolve();
  return gsap.fromTo(curtain, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' }).then();
};
const curtainOut = () => {
  const done = () => { curtain.classList.remove('is-active'); gsap.set(curtain, { clearProps: 'clipPath' }); };
  if (reduce) { done(); return Promise.resolve(); }
  return gsap.fromTo(curtain, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }).then(done);
};
const setCount = (v) => { curtainCount.textContent = String(Math.round(v * 100)).padStart(3, '0'); };

/* ---------- Abas ---------- */
let current = null;
let ctx = null;
let busy = false;
let queued = null;

const routeFromHash = () => {
  const m = location.hash.match(/^#\/([\w-]+)/);
  return m ? byRoute[m[1]] : null;
};

function activate(p) {
  const root = articles[p.id];
  const env = { stage, reduce, lenis, theme: themes[p.theme] };
  ctx = gsap.context(() => {
    const cleanups = [initHero, initThesis, initIdeas, initFeatured, initLab, initGlossary, initLife, initNext, initScenes]
      .map((init) => init(root, p, env))
      .filter(Boolean);
    return () => cleanups.forEach((c) => c());
  }, root);
  heroPrepare(root, env);
  ScrollTrigger.refresh();
  return { root, env };
}

async function loadModel(p) {
  try {
    return await stage.load(p.model, (v) => setCount(v * 0.95));
  } catch (err) {
    console.warn('Não foi possível carregar o busto 3D:', err);
    return null;
  }
}

async function go(p, { first = false } = {}) {
  if (busy) { queued = p; return; }
  busy = true;
  if (!first) await curtainIn(p);

  if (ctx) { ctx.revert(); ctx = null; }
  Object.entries(articles).forEach(([id, el]) => { el.hidden = id !== p.id; });
  current = p;
  setChrome(p);
  lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);

  const [entry] = await Promise.all([loadModel(p), document.fonts?.ready]);
  setCount(1);
  stage.setModel(entry, themes[p.theme]);
  const { root, env } = activate(p);

  await new Promise((r) => setTimeout(r, first ? 250 : 150));
  const out = curtainOut();
  setTimeout(() => heroIntro(root, env), reduce ? 0 : 350);
  await out;

  busy = false;
  if (queued && queued.id !== current.id) { const q = queued; queued = null; go(q); } else queued = null;
}

window.addEventListener('hashchange', () => {
  const p = routeFromHash();
  if (!p) return;
  if (current && p.id === current.id) { lenis.scrollTo(0, { duration: reduce ? 0 : 1.8, easing: easeOutExpo }); return; }
  go(p);
});

/* ---------- Início ---------- */
const initial = routeFromHash() || philosophers[0];
if (!routeFromHash()) history.replaceState(null, '', `#/${initial.route}`);
curtain.dataset.theme = initial.theme;
curtainName.textContent = initial.name;
curtainGreek.textContent = initial.greek;
go(initial, { first: true }).then(() => {
  // pré-carrega os outros bustos quando o navegador estiver ocioso
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  idle(() => philosophers.filter((p) => p.id !== initial.id).forEach((p) => stage.load(p.model).catch(() => {})));
});
