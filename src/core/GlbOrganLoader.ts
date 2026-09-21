import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { BodySegment } from "./AssetLoader";

/**
 * Fattore di scala unico che converte la scala reale (metri) dei modelli
 * Z-Anatomy nell'unità di scena del corpo placeholder, più un offset
 * verticale che allinea i piedi dei due sistemi di riferimento.
 *
 * Calibrato una sola volta per l'intero corpo (non organo per organo):
 * verificato che con questi valori stomaco e fegato atterrano in posizione
 * anatomicamente plausibile rispetto al guscio placeholder. Quando in
 * futuro si importerà anche il guscio corpo reale, questi due numeri
 * andranno probabilmente a sparire (tutto sarà già in scala reale).
 */
export const SCALA_GLOBALE_ORGANI = 1.8;
export const OFFSET_Y_ORGANI = -1.08;

let dracoLoader: DRACOLoader | null = null;
function getLoader(): GLTFLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  }
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  return loader;
}

/**
 * Legge `apparato_id`/`organo_id`/`parte_id` risalendo dalla mesh verso la
 * radice del nodo caricato.
 *
 * Necessario perché non è garantito che gli extras siano sulla mesh
 * foglia: verificato concretamente che una mesh Blender con più material
 * slot in uso (es. Liver: "Organ"+"Ligament") viene esportata in glTF
 * come un nodo Group con gli extras, e Mesh figlie senza `userData`
 * proprio — mentre una mesh a singolo materiale porta gli extras
 * direttamente su se stessa. Risalire la gerarchia gestisce entrambi i
 * casi con la stessa logica.
 */
function risaliMetadataAnatomico(
  obj: THREE.Object3D,
): { apparatoId: string; organoId?: string; parteId?: string } | null {
  let corrente: THREE.Object3D | null = obj;
  while (corrente) {
    const apparatoId = corrente.userData.apparato_id as string | undefined;
    if (apparatoId) {
      return {
        apparatoId,
        organoId: corrente.userData.organo_id as string | undefined,
        parteId: corrente.userData.parte_id as string | undefined,
      };
    }
    corrente = corrente.parent;
  }
  return null;
}

export interface OrganoRealeCaricato {
  group: THREE.Group;
  segments: BodySegment[];
}

/**
 * Carica un GLB di un organo reale ed espone i suoi `BodySegment`.
 *
 * Applica la calibrazione GLOBALE (stessa per ogni organo): questo, a
 * differenza di un allineamento organo-per-organo, mantiene coerenti tra
 * loro le posizioni relative dei diversi organi così come modellate in
 * Z-Anatomy (che condividono tutti la stessa origine mondo nel file
 * sorgente).
 */
export async function loadOrganoReale(glbUrl: string): Promise<OrganoRealeCaricato> {
  const gltf = await getLoader().loadAsync(glbUrl);
  const group = gltf.scene;

  group.scale.setScalar(SCALA_GLOBALE_ORGANI);
  group.position.y = OFFSET_Y_ORGANI;
  group.updateMatrixWorld(true);

  const segments: BodySegment[] = [];
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    const metadata = risaliMetadataAnatomico(obj);
    if (!metadata) {
      console.warn(`[organo-reale] Mesh "${obj.name}" priva di metadata: esclusa dalla selezione.`);
      return;
    }

    obj.castShadow = true;
    obj.receiveShadow = true;
    segments.push({
      apparatoId: metadata.apparatoId,
      organoId: metadata.organoId,
      parteId: metadata.parteId,
      object: obj,
    });
  });

  return { group, segments };
}
