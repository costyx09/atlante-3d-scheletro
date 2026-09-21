import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Un singolo elemento selezionabile del corpo: una mesh (o gruppo) taggata
 * con gli id anatomici a cui corrisponde. `SelectionSystem` e
 * `IsolationSystem` lavorano solo su questa struttura, mai su geometrie
 * specifiche: è quello che permette di sostituire il corpo placeholder con
 * il modello GLB definitivo senza toccare quei moduli.
 */
export interface BodySegment {
  apparatoId: string;
  organoId?: string;
  /**
   * Identificativo della parte anatomica, presente solo quando la mesh
   * corrisponde a una parte modellata separatamente (es. "duodeno" dentro
   * l'organo "intestino-tenue"). Assente per organi a mesh singola o dove
   * le parti sono solo contenuto testuale (nessuna geometria propria).
   */
  parteId?: string;
  object: THREE.Object3D;
}

/** Il risultato del caricamento/costruzione del corpo 3D, qualunque sia la fonte. */
export interface BodyModel {
  root: THREE.Group;
  segments: BodySegment[];
}

/**
 * Contratto comune a qualsiasi "fornitore" del corpo 3D.
 * Nella Fase 2 l'unica implementazione è `PlaceholderBodyFactory`
 * (geometrie procedurali). Nelle fasi successive si aggiungerà una
 * `GlbBodyProvider` che carica i file esportati da Blender: al resto
 * dell'app non cambierà nulla, perché entrambe restituiscono un `BodyModel`.
 */
export interface BodyProvider {
  load(): Promise<BodyModel>;
}

let gltfLoader: GLTFLoader | null = null;

function getGltfLoader(): GLTFLoader {
  if (!gltfLoader) {
    const draco = new DRACOLoader();
    // Decoder servito localmente da /public/draco (nessuna dipendenza da CDN esterni:
    // funziona offline ed è verificabile anche in ambienti di rete ristretti).
    draco.setDecoderPath("/draco/");
    gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(draco);
  }
  return gltfLoader;
}

/**
 * Carica un file GLB/glTF di un apparato.
 *
 * Non ancora utilizzata nella Fase 2 (il corpo è generato proceduralmente):
 * è predisposta per la Fase 3, quando gli apparati verranno sostituiti dai
 * modelli reali esportati da Blender. Le mesh dovranno seguire la
 * convenzione di naming `organo-<id>` usata già nel placeholder, così la
 * mappatura verso `Organo.meshId` resta invariata.
 */
export async function loadApparatoGlb(path: string): Promise<THREE.Group> {
  const gltf = await getGltfLoader().loadAsync(path);
  return gltf.scene;
}
