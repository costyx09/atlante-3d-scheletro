// Verifica generale di tutti i GLB elencati in src/data/organModels.ts.
// Per ciascuno: carica con lo stesso GLTFLoader dell'app, verifica che
// almeno una mesh esponga apparato_id/organo_id (anche risalendo la
// gerarchia, per gli organi multi-materiale come il fegato), conta mesh/
// vertici/triangoli, segnala geometrie vuote o degeneri.
//
// Uso: node verification/verify-all-organs.mjs

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const qui = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(qui, "..", "public");

// Elenco tenuto in sincrono manualmente con src/data/organModels.ts
// (import diretto del .ts non banale da uno script .mjs senza build step).
const ORGANI = [
  ["digerente", "cavo-orale", "/models/cavo-orale-test.glb"],
  ["digerente", "ghiandole-salivari", "/models/ghiandole-salivari-test.glb"],
  ["digerente", "esofago", "/models/esofago-test.glb"],
  ["digerente", "stomaco", "/models/stomaco-test.glb"],
  ["digerente", "fegato", "/models/fegato-test.glb"],
  ["digerente", "cistifellea", "/models/cistifellea-test.glb"],
  ["digerente", "pancreas", "/models/pancreas-test.glb"],
  ["digerente", "intestino-tenue", "/models/intestino-tenue-test.glb"],
  ["digerente", "intestino-crasso", "/models/intestino-crasso-test.glb"],
  ["respiratorio", "trachea", "/models/trachea-test.glb"],
  ["respiratorio", "bronchi", "/models/bronchi-test.glb"],
  ["respiratorio", "polmoni", "/models/polmoni-test.glb"],
  ["circolatorio", "cuore", "/models/cuore-test.glb"],
  ["circolatorio", "grandi-vasi", "/models/grandi-vasi-test.glb"],
  ["urinario", "reni", "/models/reni-test.glb"],
  ["urinario", "vie-urinarie", "/models/vie-urinarie-test.glb"],
  ["endocrino", "tiroide", "/models/tiroide-test.glb"],
  ["endocrino", "surreni", "/models/surreni-test.glb"],
  ["locomotore", "cranio", "/models/cranio-test.glb"],
  ["locomotore", "colonna-vertebrale", "/models/colonna-vertebrale-test.glb"],
  ["locomotore", "gabbia-toracica", "/models/gabbia-toracica-test.glb"],
  ["locomotore", "bacino", "/models/bacino-test.glb"],
  ["locomotore", "arti-scheletrici", "/models/arti-scheletrici-test.glb"],
];

function risaliMetadata(obj) {
  let corrente = obj;
  while (corrente) {
    if (corrente.userData.apparato_id) {
      return { apparatoId: corrente.userData.apparato_id, organoId: corrente.userData.organo_id };
    }
    corrente = corrente.parent;
  }
  return null;
}

function caricaGlb(assolutePath) {
  return new Promise((resolve, reject) => {
    const buf = fs.readFileSync(assolutePath);
    const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    new GLTFLoader().parse(arrayBuffer, "", resolve, reject);
  });
}

let totOk = 0;
let totKo = 0;
let totTriangoli = 0;
let totMesh = 0;
let totBytes = 0;
const problemi = [];

for (const [apparatoAtteso, organoAtteso, relPath] of ORGANI) {
  const assolutePath = path.join(publicDir, relPath);
  const etichetta = `${apparatoAtteso}/${organoAtteso}`;
  try {
    if (!fs.existsSync(assolutePath)) throw new Error(`file mancante: ${assolutePath}`);
    const dimensione = fs.statSync(assolutePath).size;
    const gltf = await caricaGlb(assolutePath);

    let nMesh = 0;
    let nTriangoli = 0;
    let nVertici = 0;
    let senzaMetadata = 0;
    const apparatiTrovati = new Set();

    gltf.scene.traverse((obj) => {
      if (!obj.isMesh) return;
      nMesh++;
      const pos = obj.geometry.attributes.position;
      nVertici += pos ? pos.count : 0;
      nTriangoli += obj.geometry.index ? obj.geometry.index.count / 3 : (pos ? pos.count / 3 : 0);

      const meta = risaliMetadata(obj);
      if (!meta) {
        senzaMetadata++;
      } else {
        apparatiTrovati.add(meta.apparatoId);
        if (meta.apparatoId !== apparatoAtteso) {
          problemi.push(`${etichetta}: apparato_id inatteso "${meta.apparatoId}"`);
        }
      }
    });

    if (nMesh === 0) throw new Error("nessuna mesh nel file");
    if (senzaMetadata > 0) problemi.push(`${etichetta}: ${senzaMetadata} mesh senza metadata risolvibili`);
    if (nTriangoli === 0) throw new Error("0 triangoli totali (geometria vuota)");

    totOk++;
    totMesh += nMesh;
    totTriangoli += nTriangoli;
    totBytes += dimensione;
    console.log(
      `OK   ${etichetta.padEnd(32)} mesh=${nMesh}  vertici=${nVertici}  triangoli=${Math.round(nTriangoli)}  ${(dimensione / 1024).toFixed(0)}KB`,
    );
  } catch (e) {
    totKo++;
    problemi.push(`${etichetta}: ERRORE — ${e.message}`);
    console.log(`FAIL ${etichetta.padEnd(32)} ${e.message}`);
  }
}

console.log("\n" + "=".repeat(70));
console.log(`Organi verificati con successo: ${totOk}/${ORGANI.length}`);
console.log(`Mesh totali: ${totMesh}   Triangoli totali: ${Math.round(totTriangoli)}   Dimensione totale: ${(totBytes / 1024 / 1024).toFixed(2)} MB`);
if (problemi.length > 0) {
  console.log("\nProblemi rilevati:");
  problemi.forEach((p) => console.log(" -", p));
}

process.exit(totKo > 0 ? 1 : 0);
