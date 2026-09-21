import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fs from "node:fs";

const buffer = fs.readFileSync("/home/claude/zanatomy/export/stomaco-test.glb");
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const CALIBRAZIONE_SCALA = 1.8;
const posizionePlaceholder = new THREE.Vector3(-0.12, 0.65, 0.12); // stessa costante di PlaceholderBodyFactory

new GLTFLoader().parse(arrayBuffer, "", (gltf) => {
  const group = gltf.scene;
  group.scale.setScalar(CALIBRAZIONE_SCALA);
  group.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(group);
  const centro = box.getCenter(new THREE.Vector3());
  group.position.add(posizionePlaceholder.clone().sub(centro));
  group.updateMatrixWorld(true);

  const segments = [];
  group.traverse((obj) => {
    if (obj.isMesh && obj.userData.apparato_id) {
      segments.push({ apparatoId: obj.userData.apparato_id, organoId: obj.userData.organo_id, object: obj });
    }
  });
  console.log("=== 1) SEGMENTI ESTRATTI (come farebbe main.ts) ===");
  segments.forEach(s => console.log(` - ${s.object.name}: apparatoId=${s.apparatoId} organoId=${s.organoId}`));

  const boxFinale = new THREE.Box3().setFromObject(group);
  const centroFinale = boxFinale.getCenter(new THREE.Vector3());
  const sizeFinale = boxFinale.getSize(new THREE.Vector3());
  console.log("\n=== 2) BOUNDING BOX finale nella scena placeholder ===");
  console.log("centro:", centroFinale.toArray().map(n=>n.toFixed(4)));
  console.log("dimensioni:", sizeFinale.toArray().map(n=>n.toFixed(4)));
  console.log("(posizione target placeholder era:", posizionePlaceholder.toArray(), ")");

  // --- 3) Simulo CameraController.flyToBoundingBox: calcolo la distanza camera ---
  const fov = 45;
  const radius = Math.max(sizeFinale.x, sizeFinale.y, sizeFinale.z) * 0.5;
  const distanza = radius / Math.sin((fov * Math.PI) / 360) + radius * 0.6;
  console.log("\n=== 3) CameraController.flyToBoundingBox (simulato) ===");
  console.log("raggio:", radius.toFixed(4), "-> distanza camera calcolata:", distanza.toFixed(4));

  // --- 4) Simulo SelectionSystem: raycast da una camera verso il centro dell'organo ---
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  const direzioneArbitraria = new THREE.Vector3(0, 0.3, 1).normalize();
  camera.position.copy(centroFinale.clone().add(direzioneArbitraria.multiplyScalar(distanza)));
  camera.lookAt(centroFinale);
  camera.updateMatrixWorld();

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); // "mouse" al centro schermo
  const oggetti = segments.map(s => s.object);
  const hits = raycaster.intersectObjects(oggetti, true);
  console.log("\n=== 4) SelectionSystem.raycast (simulato: camera che guarda l'organo, mouse al centro) ===");
  console.log("Intersezioni trovate:", hits.length);
  if (hits.length > 0) {
    const primo = hits[0].object;
    const segmentoTrovato = segments.find(s => s.object === primo);
    console.log("Mesh colpita per prima:", primo.name, "distanza:", hits[0].distance.toFixed(4));
    console.log("-> segmento risolto: apparatoId=", segmentoTrovato.apparatoId, " organoId=", segmentoTrovato.organoId);
  }

  // --- 5) Simulo IsolationSystem: calcolo target opacità/emissive per stato 'organo' ---
  console.log("\n=== 5) IsolationSystem (simulato: stato organo=stomaco) ===");
  for (const s of segments) {
    const mat = s.object.material;
    console.log(`${s.object.name}: material.type=${mat.type} opacity_attuale=${mat.opacity} emissiveIntensity_attuale=${mat.emissiveIntensity ?? "n/a"}`);
  }
}, (err) => { console.error("ERRORE:", err); process.exit(1); });
