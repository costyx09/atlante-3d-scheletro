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

export const ORGANI_DISPONIBILI: OrganoModello[] = [
  // --- Apparato digerente (completo) ---
  { apparatoId: "digerente", organoId: "cavo-orale", glbPath: "/models/cavo-orale-test.glb" },
  { apparatoId: "digerente", organoId: "ghiandole-salivari", glbPath: "/models/ghiandole-salivari-test.glb" },
  { apparatoId: "digerente", organoId: "esofago", glbPath: "/models/esofago-test.glb" },
  { apparatoId: "digerente", organoId: "stomaco", glbPath: "/models/stomaco-test.glb" },
  { apparatoId: "digerente", organoId: "fegato", glbPath: "/models/fegato-test.glb" },
  { apparatoId: "digerente", organoId: "cistifellea", glbPath: "/models/cistifellea-test.glb" },
  { apparatoId: "digerente", organoId: "pancreas", glbPath: "/models/pancreas-test.glb" },
  { apparatoId: "digerente", organoId: "intestino-tenue", glbPath: "/models/intestino-tenue-test.glb" },
  { apparatoId: "digerente", organoId: "intestino-crasso", glbPath: "/models/intestino-crasso-test.glb" },

  // --- Apparato respiratorio (completo) ---
  { apparatoId: "respiratorio", organoId: "trachea", glbPath: "/models/trachea-test.glb" },
  { apparatoId: "respiratorio", organoId: "bronchi", glbPath: "/models/bronchi-test.glb" },
  { apparatoId: "respiratorio", organoId: "polmoni", glbPath: "/models/polmoni-test.glb" },

  // --- Apparato cardiovascolare (cuore + grandi vasi principali) ---
  { apparatoId: "circolatorio", organoId: "cuore", glbPath: "/models/cuore-test.glb" },
  { apparatoId: "circolatorio", organoId: "grandi-vasi", glbPath: "/models/grandi-vasi-test.glb" },

  // --- Apparato urinario (completo) ---
  { apparatoId: "urinario", organoId: "reni", glbPath: "/models/reni-test.glb" },
  { apparatoId: "urinario", organoId: "vie-urinarie", glbPath: "/models/vie-urinarie-test.glb" },

  // --- Apparato endocrino (parziale: tiroide e surreni) ---
  { apparatoId: "endocrino", organoId: "tiroide", glbPath: "/models/tiroide-test.glb" },
  { apparatoId: "endocrino", organoId: "surreni", glbPath: "/models/surreni-test.glb" },

  // --- Apparato locomotore (scheletro assiale + arti; funge anche da
  // riferimento visivo per l'intero corpo, vedi IsolationSystem) ---
  { apparatoId: "locomotore", organoId: "cranio", glbPath: "/models/cranio-test.glb" },
  { apparatoId: "locomotore", organoId: "colonna-vertebrale", glbPath: "/models/colonna-vertebrale-test.glb" },
  { apparatoId: "locomotore", organoId: "gabbia-toracica", glbPath: "/models/gabbia-toracica-test.glb" },
  { apparatoId: "locomotore", organoId: "bacino", glbPath: "/models/bacino-test.glb" },
  { apparatoId: "locomotore", organoId: "arti-scheletrici", glbPath: "/models/arti-scheletrici-test.glb" },
];
