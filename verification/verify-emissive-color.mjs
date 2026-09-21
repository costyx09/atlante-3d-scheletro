import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fs from "node:fs";
const buffer = fs.readFileSync("/home/claude/zanatomy/export/stomaco-test.glb");
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
new GLTFLoader().parse(arrayBuffer, "", (gltf) => {
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      console.log(obj.name, "emissive color:", obj.material.emissive.getHexString(), "emissiveIntensity:", obj.material.emissiveIntensity);
    }
  });
});
