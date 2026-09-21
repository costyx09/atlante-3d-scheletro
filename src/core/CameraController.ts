import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { startTween, type ActiveTween } from "../utils/tween";

const DEFAULT_POSITION = new THREE.Vector3(0, 0.4, 6.5);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.2, 0);

/**
 * Possiede camera prospettica + OrbitControls e offre transizioni
 * animate ("fly-to") verso un punto e un target di sguardo, usate per
 * inquadrare automaticamente apparati/organi selezionati.
 *
 * Non conosce nulla di anatomia o selezione: riceve solo posizioni e
 * bounding box da inquadrare.
 */
export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private activeTween: ActiveTween | null = null;

  constructor(domElement: HTMLElement) {
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.copy(DEFAULT_POSITION);

    this.controls = new OrbitControls(this.camera, domElement);
    this.controls.target.copy(DEFAULT_TARGET);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.65;
    this.controls.zoomSpeed = 0.8;
    this.controls.panSpeed = 0.55;
    this.controls.screenSpacePanning = true;
    this.controls.zoomToCursor = true;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 14;
    this.controls.minPolarAngle = Math.PI * 0.06;
    this.controls.maxPolarAngle = Math.PI * 0.92;
    this.controls.update();
  }

  update(): void {
    this.controls.update();
  }

  /** Inquadra un bounding box con un margine, animando camera e target. */
  flyToBoundingBox(box: THREE.Box3, durationMs = 900): void {
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.5 || 0.5;

    const distance = radius / Math.sin((this.camera.fov * Math.PI) / 360) + radius * 0.6;
    const direction = this.camera.position.clone().sub(this.controls.target).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(distance));

    this.flyTo(newPosition, center, durationMs);
  }

  /** Riporta la camera alla vista d'insieme del corpo. */
  resetToDefault(durationMs = 900): void {
    this.flyTo(DEFAULT_POSITION, DEFAULT_TARGET, durationMs);
  }

  flyTo(position: THREE.Vector3, target: THREE.Vector3, durationMs: number): void {
    this.activeTween?.cancel();

    const startPosition = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    // Durante il tween disabilitiamo temporaneamente l'input utente per
    // evitare che si sommi in modo incoerente all'animazione.
    this.controls.enabled = false;

    this.activeTween = startTween({
      durationMs,
      onUpdate: (t) => {
        this.camera.position.lerpVectors(startPosition, position, t);
        this.controls.target.lerpVectors(startTarget, target, t);
        this.controls.update();
      },
      onComplete: () => {
        this.controls.enabled = true;
        this.activeTween = null;
      },
    });
  }
}
