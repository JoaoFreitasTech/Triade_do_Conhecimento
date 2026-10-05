import { defineConfig } from 'vite';
import { renderApp } from './src/render.js';

// Pré-renderiza o conteúdo das três abas dentro do index.html (no dev e no build),
// para que a página chegue pronta, como o HTML estático gerado pelo Nuxt no site original.
const prerender = () => ({
  name: 'agora-prerender',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const { header, main, footer } = renderApp();
      return html.replace('<!--header-->', header).replace('<!--main-->', main).replace('<!--footer-->', footer);
    },
  },
});

export default defineConfig({
  // Caminhos relativos: o site funciona em subpasta (GitHub Pages: /Triade_do_Conhecimento/) e na raiz.
  base: './',
  plugins: [prerender()],
  build: { chunkSizeWarningLimit: 900 },
});
