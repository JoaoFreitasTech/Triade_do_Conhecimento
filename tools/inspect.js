import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  try {
    const doc = await io.read(f);
    const root = doc.getRoot();
    let tris = 0, verts = 0;
    for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
      verts += p.getAttribute('POSITION').getCount();
      tris += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3;
    }
    const b = getBounds(root.listScenes()[0]);
    console.log(f.split(/[\/]/).pop(), { meshes: root.listMeshes().length, verts, tris, textures: root.listTextures().map(t => t.getMimeType() + ' ' + (t.getSize() || []).join('x')), extensions: root.listExtensionsUsed().map(e => e.extensionName), size: b.max.map((v, i) => +(v - b.min[i]).toFixed(3)) });
  } catch (e) { console.log(f, 'ERR', e.message); }
}
