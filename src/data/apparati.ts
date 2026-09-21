import type { Apparato } from "./schema";
import { apparatoDigerente } from "../content/digerente";
import { apparatoRespiratorio } from "../content/respiratorio";
import { apparatoCircolatorio } from "../content/circolatorio";
import { apparatoUrinario } from "../content/urinario";
import { apparatoEndocrino } from "../content/endocrino";
import { apparatoLocomotore } from "../content/locomotore";

/**
 * Crea un apparato "segnaposto" per quelli non ancora popolati di
 * contenuti/organi. Compare comunque in sidebar (per mostrare la
 * struttura finale dell'app) ma è marcato come non ancora esplorabile.
 */
function apparatoProssimamente(id: string, nome: string, colore: string): Apparato {
  return { id, nome, colore, stato: "prossimamente", organi: [], fonti: [] };
}

/**
 * Registry unico di tutti gli apparati dell'app.
 *
 * Per aggiungere un nuovo apparato: creare `src/content/<nome>.ts`
 * seguendo lo schema in `schema.ts`, importarlo qui e sostituirlo alla
 * voce "prossimamente". Nessun'altra parte del codice richiede modifiche.
 */
export const APPARATI: Apparato[] = [
  apparatoDigerente,
  apparatoRespiratorio,
  apparatoCircolatorio,
  apparatoUrinario,
  apparatoProssimamente("nervoso", "Sistema nervoso", "#4fd1c5"),
  apparatoLocomotore,
  apparatoEndocrino,
  apparatoProssimamente("riproduttore", "Apparato riproduttore", "#e685b5"),
];

export function trovaApparato(id: string): Apparato | undefined {
  return APPARATI.find((a) => a.id === id);
}

export function trovaOrgano(apparatoId: string, organoId: string) {
  return trovaApparato(apparatoId)?.organi.find((o) => o.id === organoId);
}
