/**
 * Manifest degli organi con modello 3D reale disponibile (esportato dalla
 * pipeline Blender in `blender-pipeline/`).
 *
 * Per aggiungere un nuovo organo dopo averlo esportato: una riga qui, GLB
 * in `public/models/`. Nessun'altra parte del codice richiede modifiche —
 * `HybridBodyProvider` carica dinamicamente ogni voce di questa lista.
 */
export interface OrganoModello {
  apparatoId: string;
  organoId: string;
  /** Percorso pubblico del file GLB (servito da /public). */
  glbPath: string;
  /** Solo per i log/diagnostica: non usato dal loader. */
  note?: string;
}

const MODEL_BASE = `${import.meta.env.BASE_URL}models/`;

export const ORGANI_DISPONIBILI: OrganoModello[] = [
  // --- Apparato digerente (completo) ---
  { apparatoId: "digerente", organoId: "cavo-orale", glbPath: `${MODEL_BASE}cavo-orale-test.glb` },
  { apparatoId: "digerente", organoId: "ghiandole-salivari", glbPath: `${MODEL_BASE}ghiandole-salivari-test.glb` },
  { apparatoId: "digerente", organoId: "esofago", glbPath: `${MODEL_BASE}esofago-test.glb` },
  { apparatoId: "digerente", organoId: "stomaco", glbPath: `${MODEL_BASE}stomaco-test.glb` },
  { apparatoId: "digerente", organoId: "fegato", glbPath: `${MODEL_BASE}fegato-test.glb` },
  { apparatoId: "digerente", organoId: "cistifellea", glbPath: `${MODEL_BASE}cistifellea-test.glb` },
  { apparatoId: "digerente", organoId: "pancreas", glbPath: `${MODEL_BASE}pancreas-test.glb` },
  { apparatoId: "digerente", organoId: "intestino-tenue", glbPath: `${MODEL_BASE}intestino-tenue-test.glb` },
  { apparatoId: "digerente", organoId: "intestino-crasso", glbPath: `${MODEL_BASE}intestino-crasso-test.glb` },

  // --- Apparato respiratorio (completo) ---
  { apparatoId: "respiratorio", organoId: "trachea", glbPath: `${MODEL_BASE}trachea-test.glb` },
  { apparatoId: "respiratorio", organoId: "bronchi", glbPath: `${MODEL_BASE}bronchi-test.glb` },
  { apparatoId: "respiratorio", organoId: "polmoni", glbPath: `${MODEL_BASE}polmoni-test.glb` },

  // --- Apparato cardiovascolare (cuore + grandi vasi principali) ---
  { apparatoId: "circolatorio", organoId: "cuore", glbPath: `${MODEL_BASE}cuore-test.glb` },
  { apparatoId: "circolatorio", organoId: "grandi-vasi", glbPath: `${MODEL_BASE}grandi-vasi-test.glb` },

  // --- Apparato urinario (completo) ---
  { apparatoId: "urinario", organoId: "reni", glbPath: `${MODEL_BASE}reni-test.glb` },
  { apparatoId: "urinario", organoId: "vie-urinarie", glbPath: `${MODEL_BASE}vie-urinarie-test.glb` },

  // --- Apparato endocrino (parziale: tiroide e surreni) ---
  { apparatoId: "endocrino", organoId: "tiroide", glbPath: `${MODEL_BASE}tiroide-test.glb` },
  { apparatoId: "endocrino", organoId: "surreni", glbPath: `${MODEL_BASE}surreni-test.glb` },

  // --- Apparato locomotore (scheletro assiale + arti; funge anche da
  // riferimento visivo per l'intero corpo, vedi IsolationSystem) ---
  { apparatoId: "locomotore", organoId: "cranio", glbPath: `${MODEL_BASE}cranio-test.glb` },
  { apparatoId: "locomotore", organoId: "colonna-vertebrale", glbPath: `${MODEL_BASE}colonna-vertebrale-test.glb` },
  { apparatoId: "locomotore", organoId: "gabbia-toracica", glbPath: `${MODEL_BASE}gabbia-toracica-test.glb` },
  { apparatoId: "locomotore", organoId: "bacino", glbPath: `${MODEL_BASE}bacino-test.glb` },
  { apparatoId: "locomotore", organoId: "arti-scheletrici", glbPath: `${MODEL_BASE}arti-scheletrici-test.glb` },
];
