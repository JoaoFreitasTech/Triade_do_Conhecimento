import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Paisagem atrás das seções claras: --shift vai de 0 (a seção entra por baixo) a 1 (sai por cima),
// e cada camada sobe proporcionalmente à sua velocidade (CSS em sections.css).
export function initScenes(root, p, env) {
  if (env.reduce) return;
  const triggers = [...root.querySelectorAll('[data-scene]')].map((el) =>
    ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => el.style.setProperty('--shift', self.progress.toFixed(4)),
    }),
  );
  return () => triggers.forEach((t) => t.kill());
}
