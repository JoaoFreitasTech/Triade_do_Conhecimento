import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const listen = (el, type, fn, opts) => {
  el.addEventListener(type, fn, opts);
  return () => el.removeEventListener(type, fn, opts);
};

// Revela elementos ao entrar na tela.
function reveal(targets, vars = {}, trigger) {
  if (!targets || (targets.length !== undefined && !targets.length)) return;
  gsap.from(targets, {
    y: 40, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, ...vars,
    scrollTrigger: { trigger: trigger || (targets.length ? targets[0] : targets), start: 'top 88%' },
  });
}

/* ---------- Tese ---------- */
export function initThesis(root, p, env) {
  const sec = root.querySelector('[data-thesis]');
  if (!sec) return;
  const mobile = window.matchMedia('(max-width: 649px)').matches;
  const radius = mobile ? 30 : 60;
  if (!env.reduce) {
    // Entra por cima do hero estreitando as margens e arredondando o topo (clip-mask do Solare).
    gsap.fromTo(sec,
      { clipPath: `inset(0% ${mobile ? 3 : 6}% 0% ${mobile ? 3 : 6}% round ${radius}px ${radius}px 0px 0px)` },
      { clipPath: `inset(0% 0% 0% 0% round ${radius}px ${radius}px 0px 0px)`, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: true } });
    gsap.fromTo(sec.querySelector('[data-big]'), { x: 0, y: 0, yPercent: -50, xPercent: 4 }, { yPercent: -50, xPercent: -38, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo(sec.querySelector('.thesis__orbit'), { '--draw': 0, '--rot': '-40deg' }, { '--draw': 1, '--rot': '6deg', ease: 'none', scrollTrigger: { trigger: sec, start: 'top 80%', end: 'bottom 30%', scrub: true } });
    gsap.from(sec.querySelectorAll('.st__in'), {
      yPercent: 115, duration: 1.6, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: sec.querySelector('[data-statement]'), start: 'top 80%' },
    });
    reveal([sec.querySelector('.thesis__greek')], {}, sec.querySelector('.thesis__greek'));
    reveal(sec.querySelectorAll('.thesis__note, .thesis__body > *'), {}, sec.querySelector('.thesis__note'));
  }
}

/* ---------- Ideias (acordeão) ---------- */
export function initIdeas(root, p, env) {
  const sec = root.querySelector('[data-ideas]');
  if (!sec) return;
  const offs = [];
  let refresh = 0;
  sec.querySelectorAll('.idea').forEach((li) => {
    const btn = li.querySelector('.idea__row');
    const panel = li.querySelector('.idea__panel');
    offs.push(listen(btn, 'click', () => {
      const open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.inert = !open;
      // a altura muda: recalcula os gatilhos de rolagem quando a transição terminar
      clearTimeout(refresh);
      refresh = setTimeout(() => ScrollTrigger.refresh(), 850);
    }));
  });
  if (!env.reduce) {
    reveal(sec.querySelectorAll('.ideas__head > *'), {}, sec);
    reveal(sec.querySelectorAll('.idea'), { y: 30, stagger: 0.06 }, sec.querySelector('.ideas__list'));
  }
  return () => { offs.forEach((f) => f()); clearTimeout(refresh); };
}

/* ---------- Destaque com etapas (rolagem fixada) ---------- */
const CAVE_KEYS = [
  // shadow, fire, light, beam, sun, flash
  [1, 0.35, 0, 0, 0, 0],
  [0.45, 1, 0.04, 0, 0, 0],
  [0.12, 0.4, 0.6, 1, 0.1, 0.08],
  [0, 0.12, 1, 0.5, 1, 0.85],
  [1, 0.35, 0.12, 0.08, 0, 0],
];
const CAVE_VARS = ['--shadow', '--fire', '--light', '--beam', '--sun', '--flash'];
const smooth = (t) => t * t * (3 - 2 * t);

export function initFeatured(root, p, env) {
  const sec = root.querySelector('[data-feat]');
  if (!sec) return;
  return sec.dataset.feat === 'mean' ? initMean(sec, p, env) : initSteps(sec, p, env);
}

function initSteps(sec, p) {
  const steps = [...sec.querySelectorAll('.fstep')];
  const words = [...sec.querySelectorAll('.fword')];
  const cave = sec.querySelector('.cave');
  const n = steps.length;
  let current = -1;
  const setStep = (i) => {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    words.forEach((w, k) => w.classList.toggle('is-active', k === i));
  };
  const update = (prog) => {
    sec.style.setProperty('--p', prog.toFixed(4));
    setStep(Math.min(n - 1, Math.floor(prog * n)));
    if (cave) {
      const t = Math.min(n - 1, Math.max(0, prog * n - 0.5));
      const i = Math.floor(t), f = smooth(t - i), j = Math.min(n - 1, i + 1);
      CAVE_VARS.forEach((v, k) => cave.style.setProperty(v, (CAVE_KEYS[i][k] + (CAVE_KEYS[j][k] - CAVE_KEYS[i][k]) * f).toFixed(3)));
    }
  };
  update(0);
  ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (self) => update(self.progress) });
}

function initMean(sec, p, env) {
  const f = p.featured;
  const chips = [...sec.querySelectorAll('.chip')];
  const range = sec.querySelector('[data-mean-range]');
  const lackEl = sec.querySelector('[data-mean-lack]');
  const excEl = sec.querySelector('[data-mean-excess]');
  const stateEl = sec.querySelector('[data-mean-state]');
  const descEl = sec.querySelector('[data-mean-desc]');
  const readout = sec.querySelector('.mean__readout');
  const dot = sec.querySelector('.mean__dot');
  const needle = sec.querySelector('.mean__needle');
  let vi = 0;
  let lastKey = '';

  const render = () => {
    const v = +range.value;
    const virtue = f.virtues[vi];
    const a = Math.PI - (v / 100) * Math.PI;
    dot.setAttribute('cx', (300 + Math.cos(a) * 260).toFixed(1));
    dot.setAttribute('cy', (300 - Math.sin(a) * 260).toFixed(1));
    needle.setAttribute('x2', (300 + Math.cos(a) * 228).toFixed(1));
    needle.setAttribute('y2', (300 - Math.sin(a) * 228).toFixed(1));
    const zone = v < 40 ? 'lack' : v > 60 ? 'excess' : 'virtue';
    lackEl.classList.toggle('is-on', zone === 'lack');
    excEl.classList.toggle('is-on', zone === 'excess');
    readout.classList.toggle('is-virtue', zone === 'virtue');
    const key = `${vi}-${zone}`;
    if (key === lastKey) return;
    lastKey = key;
    if (zone === 'lack') {
      stateEl.textContent = virtue.lack;
      descEl.textContent = `Vício por falta, ${virtue.domain}.`;
    } else if (zone === 'excess') {
      stateEl.textContent = virtue.excess;
      descEl.textContent = `Vício por excesso, ${virtue.domain}.`;
    } else {
      stateEl.textContent = virtue.name;
      descEl.textContent = `Virtude: o meio-termo ${virtue.domain}.`;
    }
  };
  range.setAttribute('aria-valuetext', '');
  const syncAria = () => range.setAttribute('aria-valuetext', `${stateEl.textContent}`);

  const offs = chips.map((c) =>
    listen(c, 'click', () => {
      vi = +c.dataset.virtue;
      chips.forEach((o) => o.setAttribute('aria-pressed', String(o === c)));
      lackEl.textContent = f.virtues[vi].lack;
      excEl.textContent = f.virtues[vi].excess;
      lastKey = '';
      render(); syncAria();
    }),
  );
  offs.push(listen(range, 'input', () => { render(); syncAria(); }));
  render(); syncAria();

  if (!env.reduce) {
    // Demonstração ao entrar: o ponteiro passa pelos dois vícios e para no meio.
    const demo = { v: 50 };
    ScrollTrigger.create({
      trigger: sec.querySelector('.mean__gauge'), start: 'top 70%', once: true,
      onEnter: () => gsap.timeline()
        .fromTo(demo, { v: 50 }, { v: 8, duration: 1, ease: 'power2.inOut' })
        .to(demo, { v: 92, duration: 1.6, ease: 'power2.inOut' })
        .to(demo, { v: 50, duration: 1.2, ease: 'expo.out' })
        .eventCallback('onUpdate', () => { range.value = Math.round(demo.v); render(); }),
    });
    reveal(sec.querySelectorAll('.mean__head > *, .mean__chips'), {}, sec);
  }
  return () => offs.forEach((o) => o());
}

/* ---------- Laboratório de citações ---------- */
export function initLab(root, p, env) {
  const sec = root.querySelector('[data-lab]');
  if (!sec) return;
  const text = sec.querySelector('[data-lab-text]');
  const by = sec.querySelector('[data-lab-by]');
  const src = sec.querySelector('[data-lab-src]');
  const offs = [];
  sec.querySelectorAll('.ctl input').forEach((input) => {
    const out = input.parentElement.querySelector('output');
    const prop = { size: '--size', weight: '--wght', soft: '--soft' }[input.name];
    const apply = () => { text.style.setProperty(prop, input.value); out.textContent = input.value; };
    apply();
    offs.push(listen(input, 'input', apply));
  });
  let qi = 0;
  offs.push(listen(sec.querySelector('[data-lab-next]'), 'click', () => {
    let k = qi;
    while (k === qi && p.quotes.length > 1) k = Math.floor(Math.random() * p.quotes.length);
    qi = k;
    const q = p.quotes[qi];
    gsap.timeline()
      .to(text, { autoAlpha: 0, y: -16, duration: 0.35, ease: 'power2.in' })
      .add(() => { text.textContent = q.text; by.textContent = p.name; src.textContent = q.source; })
      .fromTo(text, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' });
  }));
  offs.push(listen(text, 'input', () => { by.textContent = 'Você'; src.textContent = 'agora mesmo'; }));
  offs.push(listen(text, 'paste', (e) => {
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, t);
  }));
  if (!env.reduce) reveal([sec.querySelector('.lab__panel')], { y: 80 }, sec);
  return () => offs.forEach((o) => o());
}

/* ---------- Glossário (carrossel) ---------- */
export function initGlossary(root, p, env) {
  const sec = root.querySelector('[data-gloss]');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.gterm')];
  const stage = sec.querySelector('.gloss__stage');
  let i = 0;
  const show = (k, dir = 1) => {
    const prev = items[i];
    i = (k + items.length) % items.length;
    const next = items[i];
    if (prev === next) return;
    prev.setAttribute('aria-hidden', 'true');
    next.removeAttribute('aria-hidden');
    sec.classList.remove('is-drawn');
    void sec.offsetWidth;
    sec.classList.add('is-drawn');
    if (env.reduce) {
      prev.classList.remove('is-active'); next.classList.add('is-active');
      return;
    }
    gsap.to(prev.children, { x: -60 * dir, autoAlpha: 0, duration: 0.5, ease: 'power2.in', stagger: 0.03,
      onComplete: () => { prev.classList.remove('is-active'); gsap.set(prev.children, { clearProps: 'all' }); } });
    next.classList.add('is-active');
    gsap.fromTo(next.children, { x: 80 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.1, delay: 0.25, ease: 'expo.out', stagger: 0.05 });
  };
  items[0].classList.add('is-active');
  const offs = [
    listen(sec.querySelector('[data-gloss-prev]'), 'click', () => show(i - 1, -1)),
    listen(sec.querySelector('[data-gloss-next]'), 'click', () => show(i + 1, 1)),
    listen(sec, 'keydown', (e) => {
      if (e.target.closest('input, [contenteditable]')) return;
      if (e.key === 'ArrowLeft') show(i - 1, -1);
      if (e.key === 'ArrowRight') show(i + 1, 1);
    }),
  ];
  // deslizar no celular
  let sx = null;
  offs.push(listen(stage, 'pointerdown', (e) => { sx = e.clientX; }));
  offs.push(listen(stage, 'pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }));
  ScrollTrigger.create({ trigger: sec, start: 'top 60%', once: true, onEnter: () => sec.classList.add('is-drawn') });
  if (!env.reduce) reveal(sec.querySelectorAll('.gloss__head > *'), {}, sec);
  return () => offs.forEach((o) => o());
}

/* ---------- Vida: lente que revela a pintura + linha do tempo ---------- */
export function initLife(root, p, env) {
  const sec = root.querySelector('[data-life]');
  if (!sec) return;
  const frame = sec.querySelector('[data-lens]');
  const radius = () => Math.max(frame.clientWidth * 0.26, 90);
  const move = (e) => {
    const r = frame.getBoundingClientRect();
    frame.style.setProperty('--x', `${e.clientX - r.left}px`);
    frame.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  let open = false;
  const show = (e) => { move(e); open = true; frame.style.setProperty('--r', `${radius()}px`); setTimeout(() => open && frame.classList.add('is-lensing'), 400); };
  const hide = () => { open = false; frame.classList.remove('is-lensing'); frame.style.setProperty('--r', '0px'); };
  const offs = [
    listen(frame, 'pointerenter', (e) => { if (e.pointerType === 'mouse') show(e); }),
    listen(frame, 'pointermove', (e) => { if (e.pointerType === 'mouse' || open) move(e); }),
    listen(frame, 'pointerleave', (e) => { if (e.pointerType === 'mouse') hide(); }),
    // no toque: cada toque abre a lente naquele ponto ou fecha se já estiver aberta
    listen(frame, 'pointerdown', (e) => { if (e.pointerType !== 'mouse') (open ? hide() : show(e)); }),
  ];
  if (!env.reduce) {
    sec.querySelectorAll('.life__img').forEach((img) =>
      gsap.fromTo(img, { scale: 1.18, yPercent: -3 }, { scale: 1.02, yPercent: 3, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } }),
    );
    reveal(sec.querySelectorAll('.life__head > *'), {}, sec);
    sec.querySelectorAll('.event').forEach((ev) => reveal([ev], { y: 30 }, ev));
    reveal(sec.querySelectorAll('.life__quote > *'), {}, sec.querySelector('.life__quote'));
  }
  return () => offs.forEach((o) => o());
}

/* ---------- Próximo filósofo ---------- */
export function initNext(root, p, env) {
  const sec = root.querySelector('[data-next]');
  if (!sec || env.reduce) return;
  gsap.fromTo(sec.querySelector('.next__greek'), { x: 0, y: 0, yPercent: -50, xPercent: -42 }, { yPercent: -50, xPercent: -58, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
  reveal(sec.querySelectorAll('.next__line, .next__link, .next .btn'), {}, sec);
}
