import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fs from "node:fs";

const buffer = fs.readFileSync("/home/claude/zanatomy/export/fegato-test.glb");
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const CALIBRAZIONE_SCALA = 1.8;
const posizionePlaceholder = new THREE.Vector3(0.14, 0.75, 0.14); // stessa costante di PlaceholderBodyFactory (fegato)

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
  const group = gltf.scene;
  group.scale.setScalar(CALIBRAZIONE_SCALA);
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const centro = box.getCenter(new THREE.Vector3());
  group.position.add(posizionePlaceholder.clone().sub(centro));
  group.updateMatrixWorld(true);

  const segments = [];
  group.traverse((obj) => {
    if (obj.isMesh) {
      const meta = risaliMetadataAnatomico(obj);
      if (meta) segments.push({ ...meta, object: obj });
      else console.log("SCARTATA (nessun metadata anche risalendo):", obj.name);
    }
  });

  console.log("=== 1) SEGMENTI ESTRATTI (risalendo la gerarchia) ===");
  segments.forEach(s => console.log(` - ${s.object.name}: apparatoId=${s.apparatoId} organoId=${s.organoId}`));

  const boxFinale = new THREE.Box3().setFromObject(group);
  const centroFinale = boxFinale.getCenter(new THREE.Vector3());
  const sizeFinale = boxFinale.getSize(new THREE.Vector3());
  console.log("\n=== 2) BOUNDING BOX finale nella scena placeholder ===");
  console.log("centro:", centroFinale.toArray().map(n=>n.toFixed(4)), " target era:", posizionePlaceholder.toArray());
  console.log("dimensioni:", sizeFinale.toArray().map(n=>n.toFixed(4)));

  const fov = 45;
  const radius = Math.max(sizeFinale.x, sizeFinale.y, sizeFinale.z) * 0.5;
  const distanza = radius / Math.sin((fov * Math.PI) / 360) + radius * 0.6;
  console.log("\n=== 3) CameraController.flyToBoundingBox (simulato) ===");
  console.log("raggio:", radius.toFixed(4), "-> distanza camera:", distanza.toFixed(4));

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.copy(centroFinale.clone().add(new THREE.Vector3(0, 0.3, 1).normalize().multiplyScalar(distanza)));
  camera.lookAt(centroFinale);
  camera.updateMatrixWorld();

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(segments.map(s => s.object), true);
  console.log("\n=== 4) SelectionSystem.raycast (simulato) ===");
  console.log("Intersezioni:", hits.length);
  if (hits.length > 0) {
    const seg = segments.find(s => s.object === hits[0].object);
    console.log("Prima mesh colpita:", hits[0].object.name, "-> apparatoId=", seg.apparatoId, "organoId=", seg.organoId);
  }

  console.log("\n=== 5) Materiali (IsolationSystem) ===");
  for (const s of segments) {
    const mat = s.object.material;
    console.log(`${s.object.name}: type=${mat.type} color=${mat.color.getHexString()} emissive=${mat.emissive.getHexString()} opacity=${mat.opacity} vertici=${s.object.geometry.attributes.position.count} triangoli=${s.object.geometry.index.count/3}`);
  }
}, (err) => { console.error("ERRORE:", err); process.exit(1); });
