// Gera o HTML do site a partir dos dados. Roda no build (plugin do Vite em vite.config.js),
// então a página já chega pronta no navegador, como o HTML estático gerado pelo Nuxt no site original.

import { philosophers, byId } from './data/index.js';
import * as I from './icons.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const link = (p) => `#/${p.route}`;
const up = (s) => s.toLocaleUpperCase('pt-BR');

const btn = (label, href, { external = false, cls = '', attrs = '' } = {}) =>
  `<a class="btn ${cls}" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''} ${attrs}>` +
  `<span class="btn__label">${esc(label)}</span><span class="btn__circle">${external ? I.arrowOut : I.arrow}</span></a>`;

const rule = (cls = '') =>
  `<div class="rule ${cls}" aria-hidden="true">${I.capL}<span class="rule__line"></span>${I.sparkle()}` +
  `<span class="rule__line"></span>${I.star8()}<span class="rule__line"></span>${I.sparkle()}` +
  `<span class="rule__line"></span>${I.capR}</div>`;

/* ---------- Hero (pôster) ---------- */

function heroName(p) {
  return [...up(p.name)]
    .map((ch, i) => {
      const star = /[OÓÕÔ]/.test(ch) ? I.longStar('ch__star') : '';
      return `<span class="ch" style="--i:${i}"><span class="ch__in">${esc(ch)}${star}</span></span>`;
    })
    .join('');
}

function hero(p) {
  const h = p.hero;
  const side = (s, cls) =>
    `<div class="panel__side ${cls}"><p class="micro-title">${sparkle3()}${esc(s.title)}</p><p class="micro-text">${esc(s.text)}</p></div>`;
  const stars = (cls) => `<div class="panel__stars ${cls}" aria-hidden="true">${I.sparkle()}${I.sparkle()}${I.sparkle()}</div>`;
  return `
  <section class="hero" data-hero aria-labelledby="${p.id}-title">
    <div class="hero__sticky">
      <div class="poster" data-poster>
        ${rule('poster__rule')}
        <div class="poster__head">
          <div class="micro micro--l"><p class="micro-title">${esc(h.topLeft.title)}</p><p class="micro-text">${esc(h.topLeft.text)}</p></div>
          <p class="poster__eyebrow">${I.sparkle()}<span>${esc(h.eyebrow)}</span>${I.sparkle()}</p>
          <div class="micro micro--r"><p class="micro-title">${esc(h.topRight.title)}</p><p class="micro-text">${esc(h.topRight.text)}</p></div>
        </div>
        <h1 class="poster__name" id="${p.id}-title" aria-label="${esc(p.name)}" data-name><span class="poster__name-in" aria-hidden="true">${heroName(p)}</span></h1>
        ${rule('poster__rule poster__rule--mid')}
        <div class="poster__panel" data-panel>
          <div class="panel__bg" aria-hidden="true"><canvas class="panel__embers" data-embers></canvas></div>
          <span class="panel__corner panel__corner--tl" aria-hidden="true">${I.sparkle()}</span>
          <span class="panel__corner panel__corner--tr" aria-hidden="true">${I.sparkle()}</span>
          <span class="panel__corner panel__corner--bl" aria-hidden="true">${I.sparkle()}</span>
          <span class="panel__corner panel__corner--br" aria-hidden="true">${I.sparkle()}</span>
          ${stars('panel__stars--l')}${stars('panel__stars--r')}
          ${side(h.sideLeft, 'panel__side--l')}
          ${side(h.sideRight, 'panel__side--r')}
          <div class="panel__foot">
            <p class="panel__bottom">${esc(h.bottom)}</p>
            <ul class="panel__credits">
              ${h.credits.slice(0, 2).map((c) => `<li>${esc(c)}</li>`).join('')}
              <li class="panel__cue"><a class="hero__cue" href="#${p.id}-tese" data-anchor><span>Role para descobrir</span><i aria-hidden="true"></i></a></li>
              ${h.credits.slice(2).map((c) => `<li>${esc(c)}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="hero__gl" data-gl-slot aria-hidden="true"></div>
      </div>
    </div>
  </section>`;
}

const sparkle3 = () => `<span class="tri" aria-hidden="true">${I.sparkle()}${I.sparkle()}${I.sparkle()}</span>`;

/* ---------- Tese (intro) ---------- */

function thesis(p) {
  const t = p.thesis;
  const lines = t.lines
    .map(
      (line) =>
        `<span class="st-line">${line.map(([s, txt]) => `<span class="st st--${s}"><span class="st__in">${esc(txt)}</span></span>`).join(' ')}</span>`,
    )
    .join('');
  return `
  <section class="thesis sec-b" id="${p.id}-tese" data-thesis>
    <div class="thesis__deco" aria-hidden="true">
      <span class="gl gl--h1"></span><span class="gl gl--h2"></span><span class="gl gl--v1"></span><span class="gl gl--v2"></span>
      <span class="thesis__orbit"><span class="thesis__dot"></span></span>
      ${I.sparkle('thesis__spark thesis__spark--a')}${I.sparkle('thesis__spark thesis__spark--b')}
    </div>
    <p class="thesis__big" aria-hidden="true" data-big lang="grc">${esc(t.bigWord)}</p>
    <div class="thesis__inner">
      <p class="thesis__greek" lang="grc">${esc(p.greek)}</p>
      <h2 class="statement" data-statement>${lines}</h2>
      <p class="thesis__note">${esc(t.note)}</p>
      <div class="thesis__body">
        <p class="thesis__label">${I.dagger()}<span>${esc(t.bigWordLabel)}</span></p>
        <p class="thesis__text">${esc(t.text)}</p>
        ${btn('Explorar as ideias', `#${p.id}-ideias`, { attrs: 'data-anchor' })}
      </div>
    </div>
  </section>`;
}

/* ---------- Ideias (equivalente à seção "Weights") ---------- */

function ideas(p) {
  const items = p.ideas
    .map((it, i) => {
      const id = `${p.id}-idea-${i}`;
      return `
      <li class="idea" style="--w:${Math.min(900, 200 + i * 100)}">
        <h3 class="idea__h">
          <button class="idea__row" type="button" aria-expanded="false" aria-controls="${id}" id="${id}-btn">
            <span class="idea__n">${pad(i + 1)}</span>
            <span class="idea__title">${esc(it.title)}</span>
            <span class="idea__tag">${esc(it.tag)}</span>
            <span class="idea__icon">${I.plus}</span>
          </button>
        </h3>
        <div class="idea__panel" id="${id}" role="region" aria-labelledby="${id}-btn" inert>
          <div class="idea__inner">
            <div class="idea__text">${it.body.map((b) => `<p>${esc(b)}</p>`).join('')}</div>
            <p class="idea__src">${I.dagger()}<span>${esc(it.source)}</span></p>
          </div>
        </div>
      </li>`;
    })
    .join('');
  return `
  <section class="ideas sec-a" id="${p.id}-ideias" data-ideas>
    <header class="ideas__head">
      <h2 class="ideas__title"><span class="ideas__name">${esc(p.name)}</span>
        <span class="ideas__paren">(<span>Explore as ideias &amp; conceitos</span>)</span></h2>
      <p class="ideas__count">${pad(p.ideas.length)} ideias ${I.sparkle()} ${esc(p.dates)}</p>
    </header>
    <ol class="ideas__list">${items}</ol>
  </section>`;
}

/* ---------- Destaque ---------- */

function featured(p) {
  const f = p.featured;
  return f.type === 'mean' ? featuredMean(p, f) : featuredSteps(p, f);
}

function featuredSteps(p, f) {
  const n = f.steps.length;
  const steps = f.steps
    .map(
      (s, i) => `
      <li class="fstep" data-step="${i}">
        <p class="fstep__n">${pad(i + 1)} <span>/ ${pad(n)}</span></p>
        <h3 class="fstep__title">${esc(s.title)}</h3>
        <p class="fstep__text">${esc(s.text)}</p>
      </li>`,
    )
    .join('');
  const words = f.steps.map((s, i) => `<span class="fword" data-word="${i}" lang="grc">${esc(s.greek)}</span>`).join('');
  const visual =
    f.variant === 'cave'
      ? `<div class="cave">
          <div class="cave__wall">
            <div class="cave__shadows">
              <span class="cave__shadow cave__shadow--a"></span><span class="cave__shadow cave__shadow--b"></span>
              <span class="cave__shadow cave__shadow--c"></span><span class="cave__shadow cave__shadow--d"></span>
            </div>
          </div>
          <div class="cave__fire"></div>
          <div class="cave__sky"></div>
          <div class="cave__beam"></div>
          <div class="cave__flash"></div>
          <div class="cave__sun"></div>
          <div class="fwords">${words}</div>
        </div>`
      : `<div class="method">
          <svg class="method__ring" viewBox="0 0 400 400" fill="none">
            <circle class="method__track" cx="200" cy="200" r="196"/>
            <circle class="method__prog" cx="200" cy="200" r="196" pathLength="1"/>
            <circle cx="200" cy="200" r="150" class="method__thin"/>
            <circle cx="200" cy="200" r="104" class="method__thin"/>
            <path d="M200 0V400M0 200H400" class="method__thin"/>
          </svg>
          <div class="method__orbits">${I.orbits()}</div>
          <div class="method__disc"></div>
          <div class="fwords">${words}</div>
          <div class="fwords fwords--in">${words}</div>
        </div>`;
  return `
  <section class="feat feat--steps feat--${f.variant} sec-b" data-feat="steps" style="--n:${n}">
    <div class="feat__sticky">
      <div class="feat__copy">
        <p class="kicker">${I.sparkle()}${esc(f.kicker)}</p>
        <h2 class="feat__title">${esc(f.title)}</h2>
        <p class="feat__intro">${esc(f.intro)}</p>
        <ol class="feat__steps">${steps}</ol>
        <div class="feat__bar" aria-hidden="true"><span></span></div>
      </div>
      <div class="feat__visual" aria-hidden="true">${visual}</div>
    </div>
  </section>`;
}

function featuredMean(p, f) {
  const chips = f.virtues
    .map(
      (v, i) =>
        `<button type="button" class="chip" data-virtue="${i}" aria-pressed="${i === 0}">${esc(v.name)}</button>`,
    )
    .join('');
  const v0 = f.virtues[0];
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const a = Math.PI - (i / 20) * Math.PI;
    const r1 = 262, r2 = i % 5 === 0 ? 282 : 272;
    const x1 = 300 + Math.cos(a) * r1, y1 = 300 - Math.sin(a) * r1;
    const x2 = 300 + Math.cos(a) * r2, y2 = 300 - Math.sin(a) * r2;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join('');
  return `
  <section class="feat feat--mean sec-b" data-feat="mean">
    <div class="mean">
      <header class="mean__head">
        <p class="kicker">${I.sparkle()}${esc(f.kicker)}</p>
        <h2 class="feat__title">${esc(f.title)}</h2>
        <p class="feat__intro">${esc(f.intro)} <cite>${esc(f.source)}</cite></p>
      </header>
      <div class="mean__chips" role="group" aria-label="Escolha uma virtude">${chips}</div>
      <div class="mean__gauge">
        <svg class="mean__svg" viewBox="0 0 600 330" fill="none" aria-hidden="true">
          <path class="mean__track" d="M40 300A260 260 0 0 1 560 300"/>
          <path class="mean__zone" d="M40 300A260 260 0 0 1 560 300" pathLength="1"/>
          <g class="mean__ticks">${ticks}</g>
          <line class="mean__needle" x1="300" y1="300" x2="300" y2="58"/>
          <circle class="mean__hub" cx="300" cy="300" r="7"/>
          <circle class="mean__dot" cx="300" cy="40" r="11"/>
        </svg>
        <div class="mean__labels" aria-hidden="true">
          <span class="mean__lack" data-mean-lack>${esc(v0.lack)}</span>
          <span class="mean__excess" data-mean-excess>${esc(v0.excess)}</span>
        </div>
      </div>
      <div class="mean__readout" aria-live="polite">
        <p class="mean__state" data-mean-state>${esc(v0.name)}</p>
        <p class="mean__desc" data-mean-desc>Virtude: o meio-termo ${esc(v0.domain)}.</p>
      </div>
      <label class="mean__range">
        <span class="sr-only">Intensidade, da falta ao excesso</span>
        <input type="range" min="0" max="100" value="50" step="1" data-mean-range>
      </label>
      <div class="mean__scale" aria-hidden="true"><span>Falta</span><span>Meio-termo</span><span>Excesso</span></div>
    </div>
  </section>`;
}

/* ---------- Laboratório de citações (equivalente ao "Type tester") ---------- */

function lab(p) {
  const q = p.quotes[0];
  const ctl = (name, label, min, max, value) =>
    `<label class="ctl"><span class="ctl__label">${label}</span><input type="range" name="${name}" min="${min}" max="${max}" value="${value}"><output class="ctl__out">${value}</output></label>`;
  return `
  <section class="lab sec-a" id="${p.id}-citacoes" data-lab>
    <div class="lab__panel">
      <div class="lab__top">
        <p class="kicker">${I.sparkle()}Laboratório de citações</p>
        <div class="lab__controls">
          ${ctl('size', 'Tamanho', 24, 140, 72)}
          ${ctl('weight', 'Peso', 100, 900, 300)}
          ${ctl('soft', 'Suavidade', 0, 100, 0)}
        </div>
      </div>
      <blockquote class="lab__quote">
        <p class="lab__text" contenteditable="true" spellcheck="false" role="textbox" aria-multiline="true" aria-label="Citação (você pode editar o texto)" data-lab-text>${esc(q.text)}</p>
        <footer class="lab__src">— <span data-lab-by>${esc(p.name)}</span>, <cite data-lab-src>${esc(q.source)}</cite></footer>
      </blockquote>
      <div class="lab__actions">
        <button type="button" class="btn" data-lab-next><span class="btn__label">Gerar nova citação</span><span class="btn__circle">${I.arrow}</span></button>
        <span class="lab__hint">(clique no texto e escreva a sua)</span>
      </div>
    </div>
  </section>`;
}

/* ---------- Glossário (equivalente à seção de caracteres) ---------- */

function glossary(p) {
  const n = p.glossary.length;
  const items = p.glossary
    .map(
      (g, i) => `
      <li class="gterm" data-i="${i}"${i ? ' aria-hidden="true"' : ''}>
        <p class="gterm__greek" lang="grc">${esc(g.greek)}</p>
        <p class="gterm__latin">${esc(g.latin)}</p>
        <p class="gterm__pt">${esc(g.pt)}</p>
        <p class="gterm__text">${esc(g.text)}</p>
      </li>`,
    )
    .join('');
  return `
  <section class="gloss sec-b" id="${p.id}-glossario" data-gloss>
    <header class="gloss__head">
      <p class="kicker">${I.sparkle()}Glossário</p>
      <h2 class="gloss__title">Palavras de ${esc(p.name)}</h2>
      <p class="gloss__count"><span data-gloss-i>01</span> / ${pad(n)}</p>
    </header>
    <div class="gloss__stage">
      <svg class="gloss__construct" viewBox="0 0 800 800" fill="none" aria-hidden="true">
        <circle cx="400" cy="400" r="380" pathLength="1"/><circle cx="400" cy="400" r="250" pathLength="1"/>
        <circle cx="210" cy="400" r="190" pathLength="1"/><circle cx="590" cy="400" r="190" pathLength="1"/>
        <path d="M0 400H800M400 0V800M131 131L669 669M669 131L131 669" pathLength="1"/>
      </svg>
      <ul class="gloss__items">${items}</ul>
    </div>
    <div class="gloss__nav">
      <button type="button" class="circle-btn" data-gloss-prev aria-label="Termo anterior">${I.arrowLeft}</button>
      <button type="button" class="circle-btn" data-gloss-next aria-label="Próximo termo">${I.arrow}</button>
    </div>
    <p class="gloss__hint">(passe o cursor para ver a construção)</p>
  </section>`;
}

/* ---------- Vida (equivalente à seção "Story") ---------- */

function life(p) {
  const l = p.life;
  const events = l.events
    .map(
      (e) => `
      <li class="event">
        <p class="event__year">${esc(e.year)}</p>
        <div class="event__body"><h3 class="event__title">${esc(e.title)}</h3><p class="event__text">${esc(e.text)}</p></div>
      </li>`,
    )
    .join('');
  return `
  <section class="life sec-a" id="${p.id}-vida" data-life>
    <header class="life__head">
      <p class="kicker">${I.sparkle()}A história</p>
      <h2 class="life__title">${esc(l.title)}</h2>
    </header>
    <div class="life__grid">
      <figure class="life__figure">
        <div class="life__frame" data-lens style="--focus:${l.focus}">
          <img class="life__img life__img--base" src="${l.image}" alt="${esc(l.imageAlt)}" loading="lazy" decoding="async">
          <img class="life__img life__img--lens" src="${l.image}" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <span class="life__tint" aria-hidden="true"></span>
          <span class="life__hint" aria-hidden="true"><span class="hint-hover">(passe o cursor para revelar a pintura)</span><span class="hint-touch">(toque para revelar a pintura)</span></span>
        </div>
        <figcaption class="life__credit">${esc(l.imageCredit)}</figcaption>
      </figure>
      <ol class="life__events">${events}</ol>
    </div>
    <blockquote class="life__quote">
      <p class="kicker">${I.sparkle()}Das fontes</p>
      <p class="life__qtext">“${esc(l.quote.text)}”</p>
      <footer class="life__qby">
        <span class="life__avatar" aria-hidden="true" style="background-image:url(${l.image});background-position:${l.focus}"></span>
        <span class="life__qmeta"><strong>${esc(l.quote.by)}</strong><span>${esc(l.quote.role)}</span><cite>${esc(l.quote.source)}</cite></span>
      </footer>
    </blockquote>
  </section>`;
}

/* ---------- Próximo (equivalente ao CTA final) ---------- */

function next(p) {
  const n = byId[p.next.id];
  const restart = n.id === philosophers[0].id;
  return `
  <section class="next sec-b" data-next>
    <p class="next__greek" aria-hidden="true" lang="grc">${esc(n.greek)}</p>
    <p class="next__line">${I.sparkle()}<span>${esc(p.next.line)}</span>${I.sparkle()}</p>
    <a class="next__link" href="${link(n)}">
      <span class="next__kicker">${restart ? 'Voltar ao início' : 'Próximo filósofo'}</span>
      <span class="next__name">${esc(n.name)}</span>
    </a>
    ${btn(`Ir para ${n.name}`, link(n))}
  </section>`;
}

/* ---------- Página de cada filósofo ---------- */

function article(p, active) {
  return `
<article class="ph" id="ph-${p.id}" data-ph="${p.id}" data-theme="${p.theme}"${active ? '' : ' hidden'}>
  ${hero(p)}
  <div class="ph__body">
    ${thesis(p)}
    ${ideas(p)}
    ${featured(p)}
    ${lab(p)}
    ${glossary(p)}
    ${life(p)}
    ${next(p)}
  </div>
</article>`;
}

/* ---------- Partes globais ---------- */

function header() {
  const first = philosophers[0];
  const links = philosophers
    .map(
      (p, i) =>
        `<a class="sh__link" href="${link(p)}" data-tab="${p.id}"${i === 0 ? ' aria-current="page"' : ''}>${esc(p.name)}</a>`,
    )
    .join('');
  return `
<a class="skip" href="#main">Pular para o conteúdo</a>
<header class="sh" data-sh>
  <a class="sh__logo" href="${link(first)}" aria-label="Ágora, início">${I.sparkle()}<span>Ágora</span></a>
  <nav class="sh__nav" aria-label="Filósofos"><span class="sh__pill" aria-hidden="true"></span>${links}</nav>
  ${btn(first.readMore.label, first.readMore.href, { external: true, cls: 'btn--sm sh__cta', attrs: 'data-readmore' })}
</header>
<div class="curtain is-active" data-curtain aria-hidden="true">
  <div class="curtain__inner">
    ${rule('curtain__rule')}
    <p class="curtain__greek" data-curtain-greek lang="grc">${esc(first.greek)}</p>
    <p class="curtain__name" data-curtain-name>${esc(first.name)}</p>
    <p class="curtain__count"><span data-count>000</span></p>
    ${rule('curtain__rule')}
  </div>
</div>`;
}

function footer() {
  const tabs = philosophers.map((p) => `<li><a class="uline" href="${link(p)}">${esc(p.name)}</a></li>`).join('');
  const reads = philosophers
    .map((p) => `<li><a class="uline" href="${p.readMore.href}" target="_blank" rel="noopener noreferrer">${esc(p.name)} · Stanford Encyclopedia</a></li>`)
    .join('');
  return `
<footer class="sf" data-footer>
  <div class="sf__top">
    <p class="sf__thanks">Obrigado pela visita</p>
    ${I.flourish('sf__flourish')}
  </div>
  <div class="sf__cols">
    <div class="sf__col"><p class="sf__h">Os três</p><ul>${tabs}</ul></div>
    <div class="sf__col"><p class="sf__h">Leituras</p><ul>${reads}
      <li><a class="uline" href="https://www.perseus.tufts.edu/hopper/" target="_blank" rel="noopener noreferrer">Textos gregos · Perseus</a></li></ul></div>
    <div class="sf__col sf__col--wide"><p class="sf__h">Créditos</p><ul class="sf__credits">
      <li>Bustos de Sócrates (KAS635) e Platão (KAS2111): scans de moldagens em gesso, <a class="uline" href="https://open.smk.dk/" target="_blank" rel="noopener noreferrer">SMK, Statens Museum for Kunst</a>, domínio público.</li>
      <li>Busto de Aristóteles: “<a class="uline" href="https://sketchfab.com/3d-models/aristoteles-final-5c818387cb0744d9a767c3937280085a" target="_blank" rel="noopener noreferrer">Aristoteles - final</a>”, de edioudi, licença <a class="uline" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> (modelo simplificado e recortado).</li>
      <li>Pinturas de David, Rafael e Rembrandt: domínio público, via Wikimedia Commons.</li>
      <li>Fontes tipográficas: Fraunces, Archivo e Noto Serif Display (SIL Open Font License).</li>
    </ul></div>
    <div class="sf__col"><p class="sf__h">Sobre</p><p class="sf__about">Projeto educativo sobre os três grandes nomes da filosofia grega. As traduções das citações são livres e trazem a referência ao texto original.</p></div>
  </div>
  <div class="sf__bottom">
    <span>Ágora · 2026</span>
    <button type="button" class="uline" data-top>Voltar ao topo ↑</button>
    <span>Estrutura inspirada em casadisolare.com</span>
  </div>
</footer>`;
}

export function renderApp() {
  return {
    header: header(),
    main: philosophers.map((p, i) => article(p, i === 0)).join('\n'),
    footer: footer(),
  };
}
