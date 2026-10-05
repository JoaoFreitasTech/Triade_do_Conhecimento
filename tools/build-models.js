// Converte os scans brutos (STL / GLB) em GLBs leves para a web.
// Uso: npm run models   (lê tools/raw/, escreve public/models/)
//
// Etapas: junta todas as malhas -> alinha (rotação) -> recorta o pedestal ->
// normaliza (altura 2, centrado, base em y=0) -> solda vértices -> simplifica ->
// normais -> quantiza + compressão meshopt.

import fs from 'node:fs';
import path from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { simplify, quantize, reorder, dedup, prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { mat4, vec3 } from 'gl-matrix';

const RAW = 'tools/raw';
const OUT = 'public/models';

// rot: rotações em graus aplicadas em ordem X, Y, Z para deixar o rosto virado para +Z e o topo para +Y.
// cut: fração da altura (0 = base, 1 = topo) abaixo da qual os triângulos são descartados.
const MODELS = [
  { id: 'socrates', src: 'socrates_smk.stl', rot: [-90, 0, 0], cut: 0, tris: 110000 },
  { id: 'plato', src: 'plato_smk.stl', rot: [-90, 0, 0], cut: 0, tris: 110000 },
  { id: 'aristotle', src: 'aristoteles_final.glb', rot: [0, 0, 0], cut: 0.415, tris: 110000 },
];

const only = process.argv[2];

function readSTL(file) {
  const buf = fs.readFileSync(file);
  const count = buf.readUInt32LE(80);
  if (84 + count * 50 !== buf.length) throw new Error(`${file}: STL binário incompleto (${buf.length} bytes, esperado ${84 + count * 50})`);
  const pos = new Float32Array(count * 9);
  for (let i = 0; i < count; i++) {
    const o = 84 + i * 50 + 12;
    for (let k = 0; k < 9; k++) pos[i * 9 + k] = buf.readFloatLE(o + k * 4);
  }
  return pos;
}

async function readGLB(file) {
  const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(file);
  const out = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const p = prim.getAttribute('POSITION');
      const idx = prim.getIndices();
      const n = idx ? idx.getCount() : p.getCount();
      const v = [0, 0, 0];
      for (let i = 0; i < n; i++) {
        p.getElement(idx ? idx.getScalar(i) : i, v);
        const w = vec3.transformMat4([], v, m);
        out.push(w[0], w[1], w[2]);
      }
    }
  }
  return new Float32Array(out);
}

function transform(pos, rot) {
  const m = mat4.create();
  mat4.rotateZ(m, m, (rot[2] * Math.PI) / 180);
  mat4.rotateY(m, m, (rot[1] * Math.PI) / 180);
  mat4.rotateX(m, m, (rot[0] * Math.PI) / 180);
  const v = vec3.create();
  for (let i = 0; i < pos.length; i += 3) {
    vec3.transformMat4(v, [pos[i], pos[i + 1], pos[i + 2]], m);
    pos[i] = v[0]; pos[i + 1] = v[1]; pos[i + 2] = v[2];
  }
}

function bounds(pos) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) {
    min[k] = Math.min(min[k], pos[i + k]); max[k] = Math.max(max[k], pos[i + k]);
  }
  return { min, max };
}

function cutBelow(pos, frac) {
  if (!frac) return pos;
  const { min, max } = bounds(pos);
  const y = min[1] + (max[1] - min[1]) * frac;
  const out = [];
  for (let i = 0; i < pos.length; i += 9) {
    if (pos[i + 1] >= y && pos[i + 4] >= y && pos[i + 7] >= y) for (let k = 0; k < 9; k++) out.push(pos[i + k]);
  }
  return new Float32Array(out);
}

function normalize(pos) {
  const { min, max } = bounds(pos);
  const s = 2 / (max[1] - min[1]);
  const cx = (min[0] + max[0]) / 2, cz = (min[2] + max[2]) / 2;
  for (let i = 0; i < pos.length; i += 3) {
    pos[i] = (pos[i] - cx) * s;
    pos[i + 1] = (pos[i + 1] - min[1]) * s;
    pos[i + 2] = (pos[i + 2] - cz) * s;
  }
}

// Normais suaves ponderadas pela área (o normals() do gltf-transform desfaz a indexação).
function smoothNormals(doc) {
  for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) {
    const p = prim.getAttribute('POSITION').getArray();
    const idx = prim.getIndices().getArray();
    const n = new Float32Array(p.length);
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
      const e1 = [p[b] - p[a], p[b + 1] - p[a + 1], p[b + 2] - p[a + 2]];
      const e2 = [p[c] - p[a], p[c + 1] - p[a + 1], p[c + 2] - p[a + 2]];
      const f = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      for (const v of [a, b, c]) { n[v] += f[0]; n[v + 1] += f[1]; n[v + 2] += f[2]; }
    }
    for (let i = 0; i < n.length; i += 3) {
      const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1;
      n[i] /= l; n[i + 1] /= l; n[i + 2] /= l;
    }
    const acc = doc.createAccessor().setType('VEC3').setArray(n).setBuffer(doc.getRoot().listBuffers()[0]);
    prim.setAttribute('NORMAL', acc);
  }
}

// Junta vértices coincidentes (soup de triângulos do STL -> malha indexada).
function weldPositions(pos) {
  const map = new Map();
  const verts = [];
  const indices = new Uint32Array(pos.length / 3);
  const q = 1e5;
  for (let i = 0; i < pos.length; i += 3) {
    const key = Math.round(pos[i] * q) + ',' + Math.round(pos[i + 1] * q) + ',' + Math.round(pos[i + 2] * q);
    let id = map.get(key);
    if (id === undefined) { id = verts.length / 3; map.set(key, id); verts.push(pos[i], pos[i + 1], pos[i + 2]); }
    indices[i / 3] = id;
  }
  // descarta triângulos degenerados
  const tri = [];
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i], b = indices[i + 1], c = indices[i + 2];
    if (a !== b && b !== c && a !== c) tri.push(a, b, c);
  }
  return { verts: new Float32Array(verts), indices: new Uint32Array(tri) };
}

async function build(cfg) {
  const file = path.join(RAW, cfg.src);
  let pos = file.endsWith('.stl') ? readSTL(file) : await readGLB(file);
  transform(pos, cfg.rot);
  pos = cutBelow(pos, cfg.cut);
  normalize(pos);

  const { verts, indices } = weldPositions(pos);
  const doc = new Document();
  const buffer = doc.createBuffer();
  const position = doc.createAccessor().setType('VEC3').setArray(verts).setBuffer(buffer);
  const index = doc.createAccessor().setType('SCALAR').setArray(indices).setBuffer(buffer);
  const prim = doc.createPrimitive().setAttribute('POSITION', position).setIndices(index);
  const mesh = doc.createMesh(cfg.id).addPrimitive(prim);
  doc.createScene().addChild(doc.createNode(cfg.id).setMesh(mesh));

  const inTris = pos.length / 9;
  await MeshoptSimplifier.ready;
  await MeshoptEncoder.ready;
  await doc.transform(
    simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, cfg.tris / inTris), error: 0.002, lockBorder: false }),
    smoothNormals,
    dedup(),
    prune(),
    reorder({ encoder: MeshoptEncoder }),
    quantize({ quantizePosition: 14, quantizeNormal: 10 }),
  );
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
  fs.mkdirSync(OUT, { recursive: true });
  const outFile = path.join(OUT, `${cfg.id}.glb`);
  await io.write(outFile, doc);
  const outPrim = doc.getRoot().listMeshes()[0].listPrimitives()[0];
  console.log(`${cfg.id}: ${inTris} -> ${outPrim.getIndices().getCount() / 3} triângulos, ${(fs.statSync(outFile).size / 1024).toFixed(0)} KB`);
}

for (const cfg of MODELS) if (!only || only === cfg.id) await build(cfg);
