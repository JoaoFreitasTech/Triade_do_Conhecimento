// Cena WebGL do hero: um busto por filósofo, com luz de vela, rotação seguindo o mouse,
// giro com a rolagem e um pós-processamento que converte a imagem em duotom granulado,
// no espírito dos pôsteres de referência.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';

const vec3 = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const PosterShader = {
  uniforms: {
    tDiffuse: { value: null },
    uC0: { value: new THREE.Vector3() },
    uC1: { value: new THREE.Vector3() },
    uC2: { value: new THREE.Vector3() },
    uC3: { value: new THREE.Vector3() },
    uEdge: { value: new THREE.Vector3(1, 0.6, 0.2) },
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uFade: { value: new THREE.Vector2(0, 0.2) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 uC0, uC1, uC2, uC3, uEdge;
    uniform float uTime, uReveal;
    uniform vec2 uRes, uFade;
    varying vec2 vUv;

    float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
    }
    float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; } return v; }
    vec3 ramp(float t) {
      t = clamp(t, 0.0, 1.0);
      if (t < 0.34) return mix(uC0, uC1, t / 0.34);
      if (t < 0.72) return mix(uC1, uC2, (t - 0.34) / 0.38);
      return mix(uC2, uC3, (t - 0.72) / 0.28);
    }

    void main() {
      vec4 s = texture2D(tDiffuse, vUv);
      float a = s.a;
      if (a < 0.003) { gl_FragColor = vec4(0.0); return; }
      vec3 c = s.rgb / a;
      float l = pow(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1.0 / 2.2);
      l = smoothstep(0.06, 0.92, l);
      l = l * l * (3.0 - 2.0 * l);

      vec2 px = floor(vUv * uRes);
      float grain = hash(px + floor(uTime * 24.0) * 7.13) - 0.5;
      float stip = hash(floor(vUv * uRes * 0.5) + 3.7) - 0.5;
      l += grain * 0.10 + stip * 0.14 * (1.0 - abs(l * 2.0 - 1.0));
      // a base do busto se dissolve na escuridão do painel
      float fade = smoothstep(uFade.x, uFade.y, vUv.y);
      l *= mix(0.25, 1.0, fade);
      vec3 col = ramp(l);

      // Revelação por dissolução, de baixo para cima, com borda incandescente.
      float aspect = uRes.x / uRes.y;
      float field = fbm(vec2(vUv.x * aspect, vUv.y) * 4.0) * 0.5 + vUv.y * 0.6;
      float r = uReveal * 1.3 - 0.12;
      float m = smoothstep(field - 0.02, field + 0.02, r);
      float edge = (1.0 - smoothstep(0.0, 0.05, abs(field - r))) * step(uReveal, 0.999);
      col = mix(col, uEdge, edge);
      a *= max(m, edge * 0.9) * smoothstep(0.0, 0.85, fade);

      gl_FragColor = vec4(col * a, a);
    }
  `,
};

export class BustStage {
  constructor({ reduceMotion = false } = {}) {
    this.reduce = reduceMotion;
    this.cache = new Map();
    this.pending = new Map();
    this.state = { ry: 0, lift: 0, reveal: 0, scroll: 0 };
    this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    this.frame = null;
    this.active = false;
    this.fitScale = 1;

    try {
      this.canvas = document.createElement('canvas');
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      this.failed = true;
      return;
    }
    const r = this.renderer;
    r.setClearColor(0x000000, 0);
    r.toneMapping = THREE.NoToneMapping;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(18, 1, 0.1, 100);
    this.camera.position.set(0, 0, 14);

    // pivot = posição na tela; rig = escala do enquadramento (luzes acompanham); holder = rotação do busto.
    this.pivot = new THREE.Group();
    this.rig = new THREE.Group();
    this.holder = new THREE.Group();
    this.scene.add(this.pivot);
    this.pivot.add(this.rig);
    this.rig.add(this.holder);

    this.material = new THREE.MeshStandardMaterial({ color: 0xf1ebe0, roughness: 0.82, metalness: 0 });

    const hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 0.12);
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-4, 2.6, 2.2);
    const rim = new THREE.DirectionalLight(0xffffff, 3.2);
    rim.position.set(3.6, 1.8, -2.2);
    this.candle = new THREE.PointLight(0xffffff, 4, 0, 2);
    this.candle.position.set(0.45, 0.45, 1.25);
    this.rig.add(hemi, key, key.target, rim, rim.target, this.candle);
    key.target.position.set(0, 1, 0);
    rim.target.position.set(0, 1, 0);

    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(r, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.poster = new ShaderPass(PosterShader);
    this.composer.addPass(this.poster);

    this.loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

    this.onPointer = (e) => {
      this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', this.onPointer, { passive: true });

    this.ro = new ResizeObserver(() => this.resize());
    this.tick = this.tick.bind(this);
    gsap.ticker.add(this.tick);
  }

  load(model, onProgress = () => {}) {
    if (this.failed) return Promise.resolve(null);
    if (this.cache.has(model.src)) return Promise.resolve(this.cache.get(model.src));
    if (this.pending.has(model.src)) return this.pending.get(model.src);
    const p = new Promise((resolve, reject) => {
      this.loader.load(
        model.src,
        (gltf) => {
          const root = gltf.scene;
          root.traverse((o) => { if (o.isMesh) o.material = this.material; });
          const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
          const entry = { root, size, model };
          this.cache.set(model.src, entry);
          resolve(entry);
        },
        (xhr) => onProgress(xhr.total ? xhr.loaded / xhr.total : Math.min(0.95, xhr.loaded / 700000)),
        reject,
      );
    });
    this.pending.set(model.src, p);
    return p;
  }

  setModel(entry, theme) {
    if (this.failed || !entry) return;
    if (this.current) this.holder.remove(this.current.root);
    this.current = entry;
    this.holder.add(entry.root);
    this.setTheme(theme);
    this.layout();
  }

  setTheme(theme) {
    if (this.failed) return;
    const u = this.poster.uniforms;
    theme.duo.forEach((hex, i) => u[`uC${i}`].value.copy(vec3(hex)));
    u.uEdge.value.copy(vec3(theme.ember));
  }

  attach(slot) {
    if (this.failed) return;
    this.slot = slot;
    slot.appendChild(this.canvas);
    this.ro.observe(slot);
    this.resize();
  }

  detach() {
    if (this.failed || !this.slot) return;
    this.ro.unobserve(this.slot);
    this.canvas.remove();
    this.slot = null;
    this.active = false;
  }

  // frame: { cx, top, bottom, maxW } em px relativos ao canvas
  setFrame(frame) {
    this.frame = frame;
    this.layout();
  }

  resize() {
    if (!this.slot) return;
    const w = this.slot.clientWidth, h = this.slot.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.size = { w, h };
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.poster.uniforms.uRes.value.set(w * dpr, h * dpr);
    this.layout();
  }

  layout() {
    if (!this.current || !this.size || !this.frame) return;
    const { w, h } = this.size;
    const f = this.frame;
    const vh = 2 * this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const k = vh / h;
    const box = this.current.size;
    const s = Math.min(((f.bottom - f.top) * k) / box.y, (f.maxW * k) / box.x) * (this.current.model.scale || 1);
    this.fitScale = s;
    this.rig.scale.setScalar(s);
    this.pivot.position.set((f.cx - w / 2) * k, (h / 2 - f.bottom) * k, 0);
    const y0 = 1 - f.bottom / h;
    this.poster.uniforms.uFade.value.set(y0, y0 + ((f.bottom - f.top) * (f.fade ?? 0.5)) / h);
  }

  setScroll(p) { this.state.scroll = p; }
  setActive(on) { this.active = on && !!this.slot; }

  intro({ delay = 0 } = {}) {
    if (this.failed) return;
    gsap.killTweensOf(this.state);
    if (this.reduce) {
      Object.assign(this.state, { ry: 0, lift: 0, reveal: 1 });
      return;
    }
    gsap.fromTo(this.state, { ry: -1.25, lift: -0.22 }, { ry: 0, lift: 0, duration: 2.8, delay, ease: 'expo.out' });
    gsap.fromTo(this.state, { reveal: 0 }, { reveal: 1, duration: 2.2, delay, ease: 'power2.out' });
  }

  hide() { gsap.killTweensOf(this.state); this.state.reveal = 0; }

  tick(time) {
    if (!this.active || !this.current) return;
    const s = this.state, pt = this.pointer;
    const follow = this.reduce ? 0 : 1;
    pt.x += (pt.tx * follow - pt.x) * 0.05;
    pt.y += (pt.ty * follow - pt.y) * 0.05;
    const idle = this.reduce ? 0 : Math.sin(time * 0.35) * 0.07;
    const yaw = this.current.model.yaw || 0;

    this.holder.rotation.y = yaw + s.ry + pt.x * 0.5 + idle + s.scroll * 1.1;
    this.holder.rotation.x = pt.y * 0.1 - s.scroll * 0.06;
    this.holder.position.y = s.lift + (this.reduce ? 0 : Math.sin(time * 0.8) * 0.01) + s.scroll * 0.1;
    this.holder.scale.setScalar(1 + s.scroll * 0.14);

    // vela tremulando
    const fl = this.reduce ? 1 : 0.86 + Math.sin(time * 13.1) * 0.05 + Math.sin(time * 7.3 + 1.2) * 0.06 + Math.random() * 0.03;
    this.candle.intensity = 4 * fl;
    this.candle.position.x = 0.35 + pt.x * 0.25;

    this.poster.uniforms.uTime.value = time;
    this.poster.uniforms.uReveal.value = s.reveal;
    this.composer.render();
  }
}
