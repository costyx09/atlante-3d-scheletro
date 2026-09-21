// Verifica di regressione: un organo con più material slot (il fegato,
// slot "Organ" + "Ligament") deve produrre 2 segmenti Three.js, entrambi
// con apparato_id/organo_id corretti letti risalendo la gerarchia dei
// genitori (perché GLTFLoader mette gli extras sul nodo Group, non sulle
// singole Mesh figlie quando ci sono più primitive).
//
// Uso: node verification/verify-liver-multimaterial.mjs

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import fs from "node:fs";

const buf = fs.readFileSync(new URL("../public/models/fegato-test.glb", import.meta.url));
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

function risaliMetadataAnatomico(obj) {
  let corrente = obj;
  while (corrente) {
    const apparatoId = corrente.userData.apparato_id;
    if (apparatoId) return { apparatoId, organoId: corrente.userData.organo_id };
    corrente = corrente.parent;
  }
  return null;
}

new GLTFLoader().parse(arrayBuffer, "", (gltf) => {
  const segments = [];
  gltf.scene.traverse((obj) => {
    if (!obj.isMesh) return;
    const metadata = risaliMetadataAnatomico(obj);
    if (metadata) segments.push({ ...metadata, nome: obj.name });
  });

  console.log("Segmenti trovati:", segments);

  const ok = segments.length === 2 && segments.every(s => s.apparatoId === "digerente" && s.organoId === "fegato");
  console.log(ok ? "\n✔ OK: 2 segmenti, metadata corretti su entrambi." : "\n✘ FALLITO: struttura inattesa.");
  process.exit(ok ? 0 : 1);
}, (e) => { console.error(e); process.exit(1); });
