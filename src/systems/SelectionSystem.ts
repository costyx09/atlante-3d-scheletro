import * as THREE from "three";
import type { BodySegment } from "../core/AssetLoader";
import { EventEmitter } from "../utils/EventEmitter";

interface SelectionEvents {
  hover: { segment: BodySegment | null; clientX: number; clientY: number };
  select: { segment: BodySegment };
}

/**
 * Isola l'interazione mouse → mesh dal resto dell'app. Riceve la lista dei
 * segmenti interattivi (dal `BodyModel`, sia esso placeholder o GLB) e la
 * camera, ed emette eventi con il segmento coinvolto: chi ascolta (UI,
 * NavigationState) decide cosa farne.
 */
export class SelectionSystem extends EventEmitter<SelectionEvents> {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private segments: BodySegment[] = [];
  private hovered: BodySegment | null = null;

  constructor(
    private readonly domElement: HTMLElement,
    private readonly camera: THREE.Camera,
  ) {
    super();
    this.domElement.addEventListener("pointermove", this.handlePointerMove);
    this.domElement.addEventListener("pointerdown", this.handlePointerDown);
    this.domElement.addEventListener("pointerleave", this.handlePointerLeave);
  }

  setSegments(segments: BodySegment[]): void {
    this.segments = segments;
  }

  private updatePointer(event: PointerEvent): void {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private raycast(): BodySegment | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const objects = this.segments.map((s) => s.object);
    const hits = this.raycaster.intersectObjects(objects, true);
    if (hits.length === 0) return null;

    // Risale dall'oggetto colpito (potrebbe essere un figlio della mesh
    // registrata) al segmento corrispondente.
    let hitObject: THREE.Object3D | null = hits[0].object;
    while (hitObject) {
      const found = this.segments.find((s) => s.object === hitObject);
      if (found) return found;
      hitObject = hitObject.parent;
    }
    return null;
  }

  private handlePointerMove = (event: PointerEvent): void => {
    this.updatePointer(event);
    const segment = this.raycast();

    if (segment !== this.hovered) {
      this.hovered = segment;
      this.domElement.style.cursor = segment ? "pointer" : "grab";
    }
    this.emit("hover", { segment, clientX: event.clientX, clientY: event.clientY });
  };

  private handlePointerDown = (event: PointerEvent): void => {
    this.updatePointer(event);
    const segment = this.raycast();
    if (segment) {
      this.emit("select", { segment });
    }
  };

  private handlePointerLeave = (): void => {
    this.hovered = null;
    this.emit("hover", { segment: null, clientX: 0, clientY: 0 });
  };
}
