import * as THREE from "three";
import type { BodyModel, BodyProvider, BodySegment } from "../core/AssetLoader";
import { loadOrganoReale } from "../core/GlbOrganLoader";
import { ORGANI_DISPONIBILI } from "../data/organModels";

/**
 * BodyProvider di produzione: carica direttamente i modelli reali elencati
 * in `ORGANI_DISPONIBILI`, senza aggiungere una silhouette procedurale.
 *
 * Gli apparati non ancora presenti nel manifest (sistema nervoso,
 * locomotore, riproduttivo) restano semplicemente senza organi
 * selezionabili: la UI li mostra già correttamente come "in arrivo"
 * (vedi `Sidebar`/`InfoPanel`, che gestiscono `stato: "prossimamente"` e
 * `organi.length === 0` senza bisogno di alcuna modifica).
 *
 * Il caricamento dei GLB avviene in parallelo; se un singolo file fallisce
 * (rete, file mancante) viene loggato e saltato, senza bloccare l'avvio
 * dell'app con gli organi restanti.
 */
export class HybridBodyProvider implements BodyProvider {
  async load(): Promise<BodyModel> {
    const root = new THREE.Group();
    root.name = "corpo-umano";
    const segments: BodySegment[] = [];

    const risultati = await Promise.allSettled(
      ORGANI_DISPONIBILI.map((voce) => loadOrganoReale(voce.glbPath)),
    );

    risultati.forEach((risultato, indice) => {
      const voce = ORGANI_DISPONIBILI[indice];
      if (risultato.status === "fulfilled") {
        root.add(risultato.value.group);
        segments.push(...risultato.value.segments);
      } else {
        console.error(
          `[HybridBodyProvider] Impossibile caricare "${voce.organoId}" (${voce.glbPath}):`,
          risultato.reason,
        );
      }
    });

    return { root, segments };
  }
}
