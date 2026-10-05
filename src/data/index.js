import socrates from './socrates.js';
import plato from './plato.js';
import aristotle from './aristotle.js';

export const philosophers = [socrates, plato, aristotle];

export const byId = Object.fromEntries(philosophers.map((p) => [p.id, p]));
export const byRoute = Object.fromEntries(philosophers.map((p) => [p.route, p]));

// Paletas: "a" = cor do pôster (hero, seções claras), "b" = seções de contraste.
// duo = degradê usado pelo shader do busto (sombra → luz).
export const themes = {
  socrates: {
    aBg: '#F2AD62', aFg: '#0E1A1B',
    bBg: '#0B0C0B', bFg: '#F2E3CB',
    accent: '#F2AD62', ember: '#FF9A3C',
    duo: ['#070807', '#5B2E17', '#E39A55', '#FFE6BF'],
  },
  plato: {
    aBg: '#0C0C0B', aFg: '#E9E2D4',
    bBg: '#E9E2D4', bFg: '#0C0C0B',
    accent: '#E9E2D4', ember: '#FFF4DF',
    duo: ['#050505', '#3C3934', '#BDB5A6', '#FFFFFF'],
  },
  aristotle: {
    aBg: '#E8DECC', aFg: '#102120',
    bBg: '#0D1716', bFg: '#E8DECC',
    accent: '#E79C48', ember: '#FFB25E',
    duo: ['#060A0A', '#3A3B33', '#CDBB9C', '#FFF4DE'],
  },
};
