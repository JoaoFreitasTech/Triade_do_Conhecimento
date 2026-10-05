// Texturas geradas no navegador (grão de filme e pontilhado), aplicadas como variáveis CSS.

function canvasTexture(size, paint) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  paint(img.data, size);
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

// Grão: pontos claros e escuros com baixa opacidade.
export function grain(size = 220) {
  return canvasTexture(size, (d) => {
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() < 0.5 ? 0 : 255;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = Math.random() < 0.55 ? Math.random() * 34 : 0;
    }
  });
}

// Pontilhado: máscara de pontos opacos com densidade dada (0–1).
export function stipple(size = 260, density = 0.55) {
  return canvasTexture(size, (d) => {
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i + 1] = d[i + 2] = 255;
      d[i + 3] = Math.random() < density ? 255 : Math.random() < 0.25 ? 110 : 0;
    }
  });
}

export function installTextures(root = document.documentElement) {
  root.style.setProperty('--grain', `url(${grain()})`);
  root.style.setProperty('--stipple', `url(${stipple(260, 0.58)})`);
  root.style.setProperty('--stipple-soft', `url(${stipple(300, 0.82)})`);
}
