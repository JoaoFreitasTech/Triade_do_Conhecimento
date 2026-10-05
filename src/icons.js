// Ornamentos em SVG inspirados nos pôsteres de referência (estrelas, adagas, círculos, arabesco).

export const sparkle = (cls = '') =>
  `<svg class="i-sparkle ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.7 7.3 16.7 11.3 24 12C16.7 12.7 12.7 16.7 12 24C11.3 16.7 7.3 12.7 0 12C7.3 11.3 11.3 7.3 12 0Z"/></svg>`;

// Estrela alongada, como as que aparecem dentro das letras de "CHAOS".
export const longStar = (cls = '') =>
  `<svg class="i-longstar ${cls}" viewBox="0 0 20 64" aria-hidden="true"><path d="M10 0C10.9 23 13.4 29.6 20 32C13.4 34.4 10.9 41 10 64C9.1 41 6.6 34.4 0 32C6.6 29.6 9.1 23 10 0Z"/></svg>`;

export const star8 = (cls = '') =>
  `<svg class="i-star8 ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.6 7.6 16.4 11.4 24 12C16.4 12.6 12.6 16.4 12 24C11.4 16.4 7.6 12.6 0 12C7.6 11.4 11.4 7.6 12 0Z"/><path d="M12 12L19.6 4.4L13.6 12L19.6 19.6L12 13.6L4.4 19.6L10.4 12L4.4 4.4Z"/></svg>`;

// Pontas das réguas do pôster: um círculo cheio + um anel.
export const capL = `<svg class="i-cap" viewBox="0 0 30 16" aria-hidden="true"><circle cx="8" cy="8" r="7"/><circle cx="22" cy="8" r="6.2" fill="none" stroke-width="1.6"/></svg>`;
export const capR = `<svg class="i-cap" viewBox="0 0 30 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke-width="1.6"/><circle cx="22" cy="8" r="7"/></svg>`;

export const dagger = (cls = '') =>
  `<svg class="i-dagger ${cls}" viewBox="0 0 64 16" aria-hidden="true"><path d="M0 8L38 5.8V10.2Z"/><rect x="38" y="1" width="3" height="14" rx="1.5"/><rect x="41" y="6.4" width="13" height="3.2" rx="1"/><circle cx="57.5" cy="8" r="3.2"/></svg>`;

export const arrow = `<svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const arrowOut = `<svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const arrowLeft = `<svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M14 8H3M7 4L3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const plus = `<svg class="i-plus" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

// Diagrama de círculos sobrepostos (pôster "White Suns").
export const orbits = (cls = '') =>
  `<svg class="i-orbits ${cls}" viewBox="0 0 120 260" fill="none" stroke="currentColor" stroke-width=".8" aria-hidden="true">
    <circle cx="60" cy="60" r="48"/><circle cx="60" cy="130" r="48"/><circle cx="60" cy="200" r="48"/>
    <ellipse cx="60" cy="95" rx="22" ry="34" transform="rotate(35 60 95)"/>
    <ellipse cx="60" cy="165" rx="22" ry="34" transform="rotate(-35 60 165)"/>
    <ellipse cx="60" cy="130" rx="40" ry="14"/>
  </svg>`;

// Arabesco simétrico (pôster "White Suns", rodapé).
export const flourish = (cls = '') => {
  const half = `<path d="M158 20C172 20 176 7 189 7C199 7 203 15 197 19C192 22 187 18 191 15"/>
    <path d="M158 21C176 23 189 32 209 28C224 25 231 15 244 16C254 17 257 24 251 27C247 28 245 24 248 23"/>
    <path d="M200 20H296" stroke-width="1"/>
    <path d="M168 13C171 9 176 8 179 10"/>`;
  return `<svg class="i-flourish ${cls}" viewBox="0 0 300 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <g>${half}</g><g transform="translate(300 0) scale(-1 1)">${half}</g>
    <path d="M150 9L156 20L150 31L144 20Z" fill="currentColor" stroke="none"/>
  </svg>`;
};
