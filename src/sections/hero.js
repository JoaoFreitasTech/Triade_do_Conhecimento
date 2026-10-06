import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Partículas no painel: brasas subindo (Sócrates, Aristóteles) ou poeira num feixe de luz (Platão).
class Embers {
  constructor(canvas, { color, dust }) {
    this.canvas = canvas;
    this.g = canvas.getContext('2d');
    this.color = color;
    this.dust = dust;
    this.parts = [];
    this.on = false;
    this.resize();
    const n = dust ? 90 : 60;
    for (let i = 0; i < n; i++) this.parts.push(this.spawn(true));
    this.tick = this.tick.bind(this);
    gsap.ticker.add(this.tick);
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth; this.h = this.canvas.clientHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  spawn(anywhere) {
    const d = this.dust;
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : this.h + 10,
      vx: (Math.random() - 0.5) * (d ? 0.18 : 0.3),
      vy: -(d ? 0.05 + Math.random() * 0.15 : 0.25 + Math.random() * 0.75),
      r: d ? 0.5 + Math.random() * 1.3 : 0.6 + Math.random() * 1.6,
      a: 0.25 + Math.random() * 0.75,
      ph: Math.random() * 6.28,
    };
  }
  tick(t) {
    if (!this.on || !this.w) return;
    const g = this.g;
    g.clearRect(0, 0, this.w, this.h);
    g.fillStyle = this.color;
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      p.x += p.vx + Math.sin(t * 0.9 + p.ph) * 0.15;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > this.w + 10) this.parts[i] = this.spawn(false);
      const fade = Math.min(1, p.y / (this.h * 0.35));
      g.globalAlpha = p.a * fade * (0.55 + 0.45 * Math.sin(t * 3 + p.ph));
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 6.283);
      g.fill();
    }
    g.globalAlpha = 1;
  }
  destroy() { gsap.ticker.remove(this.tick); }
}

// Ajusta o nome para ocupar a largura do pôster e informa à cena 3D onde posicionar o busto.
function layout(root, stage) {
  const poster = root.querySelector('[data-poster]');
  const name = root.querySelector('[data-name]');
  const inner = name.querySelector('.poster__name-in');
  const panel = root.querySelector('[data-panel]');
  const mobile = window.matchMedia('(max-width: 649px)').matches;
  // com paisagem atrás (painel transparente) a base do busto só some, sem escurecer, e mais perto do pé
  const scene = !!root.querySelector('.hero--scene');

  name.style.setProperty('--name-size', '100px');
  const w = inner.getBoundingClientRect().width;
  const ph = poster.clientHeight;
  let size = (100 * poster.clientWidth * 0.995) / w;
  size = Math.min(size, ph * (mobile ? 0.2 : 0.3));
  name.style.setProperty('--name-size', `${size.toFixed(2)}px`);

  const base = poster.getBoundingClientRect();
  const nr = name.getBoundingClientRect();
  const pr = panel.getBoundingClientRect();
  stage.setFrame({
    cx: pr.left - base.left + pr.width / 2,
    top: nr.top - base.top + nr.height * (mobile ? 0.1 : 0.28),
    bottom: pr.bottom - base.top,
    maxW: pr.width * (mobile ? 0.92 : 0.46),
    fade: scene ? 0.2 : mobile ? 0.3 : 0.5,
    dim: scene ? 0 : 1,
  });
}

export function initHero(root, p, env) {
  const { stage, theme } = env;
  const heroEl = root.querySelector('[data-hero]');
  const body = root.querySelector('.ph__body');
  const slot = root.querySelector('[data-gl-slot]');
  const nameIn = root.querySelector('.poster__name-in');

  stage.attach(slot);
  if (stage.failed) {
    slot.innerHTML = `<img class="hero__fallback" src="img/${p.id}-bust.png" alt="">`;
  }
  const relayout = () => layout(root, stage);
  relayout();
  document.fonts?.ready.then(relayout);

  const embers = new Embers(root.querySelector('[data-embers]'), { color: theme.ember, dust: p.id === 'plato' });

  // Remede sempre que o pôster ou o painel mudarem de tamanho (janela, rotação, fontes, CSS tardio).
  let raf = 0;
  const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { relayout(); embers.resize(); }); };
  const ro = new ResizeObserver(onResize);
  ro.observe(root.querySelector('[data-poster]'));
  ro.observe(root.querySelector('[data-panel]'));

  // Enquanto a próxima seção cobre o hero: o busto gira, o nome engorda (eixo de peso da fonte variável).
  ScrollTrigger.create({
    trigger: body,
    start: 'top bottom',
    end: 'top top',
    onUpdate: (self) => {
      stage.setScroll(self.progress);
      if (!env.reduce) heroEl.style.setProperty('--cover', self.progress.toFixed(4));
    },
    onToggle: (self) => setVisible(self.progress < 1),
    onLeave: () => setVisible(false),
    onEnterBack: () => setVisible(true),
  });
  if (!env.reduce) {
    gsap.to(nameIn, {
      '--wght': p.id === 'plato' ? 860 : 820,
      ease: 'none',
      scrollTrigger: { trigger: body, start: 'top bottom', end: 'top 20%', scrub: true },
    });
  }

  // O hero fica fixo (sticky) por baixo do conteúdo: quando a seção seguinte o cobre por completo,
  // render e partículas são desligados.
  function setVisible(v) {
    stage.setActive(v);
    embers.on = v;
  }
  setVisible(true);

  return () => {
    ro.disconnect();
    cancelAnimationFrame(raf);
    embers.destroy();
    stage.setActive(false);
    stage.detach();
  };
}

// Estado inicial (antes da cortina abrir) e animação de entrada do pôster.
export function heroPrepare(root, env) {
  if (env.reduce) return;
  const q = (s) => root.querySelectorAll(s);
  gsap.set(q('.ch__in'), { yPercent: 110 });
  gsap.set(q('.poster__rule .rule__line'), { scaleX: 0 });
  gsap.set(q('.poster__head > *, .panel__side, .panel__foot, .panel__corner, .panel__stars'), { autoAlpha: 0, y: 14 });
  gsap.set(q('.panel__bg'), { clipPath: 'inset(100% 0% 0% 0% round 24px)' });
  env.stage.hide();
}

export function heroIntro(root, env) {
  if (env.reduce) { env.stage.intro(); return; }
  const q = (s) => root.querySelectorAll(s);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to(q('.poster__rule .rule__line'), { scaleX: 1, duration: 1.6, stagger: 0.04 }, 0)
    .to(q('.ch__in'), { yPercent: 0, duration: 1.6, stagger: 0.06 }, 0.1)
    .to(q('.panel__bg'), { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.15)
    .add(() => env.stage.intro(), 0.75)
    .to(q('.poster__head > *, .panel__side, .panel__foot, .panel__corner, .panel__stars'), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.05 }, 0.9);
  return tl;
}
