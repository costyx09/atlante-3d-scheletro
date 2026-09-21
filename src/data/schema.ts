/**
 * Schema dati dell'Atlante Anatomico 3D.
 *
 * Gerarchia concettuale:
 *   Corpo umano → Apparato → Organo → Parte dell'organo → Informazioni/fonti
 *
 * Questo file NON contiene contenuti anatomici: definisce solo la forma
 * dei dati. I contenuti veri e propri vivono in `src/content/*.ts` e
 * vengono registrati in `src/data/apparati.ts`.
 */

/** Riferimento bibliografico verificabile per un contenuto didattico. */
export interface FonteBibliografica {
  /** Titolo del testo, manuale o sito da cui proviene l'informazione. */
  titolo: string;
  /** Autore o ente (facoltativo). */
  autore?: string;
  /** URL di riferimento, se disponibile. */
  url?: string;
  /** Anno di pubblicazione o di consultazione. */
  anno?: number;
}

/** Una sotto-struttura di un organo (es. cardias, fondo, corpo, piloro dello stomaco). */
export interface ParteOrgano {
  /** Identificativo stabile, usato anche per il mapping con le mesh 3D. */
  id: string;
  nome: string;
  descrizione: string;
  funzione: string;
  fonti: FonteBibliografica[];
}

/**
 * Un organo appartenente a un apparato.
 *
 * `meshId` è il nome logico della mesh (o del gruppo di mesh) che rappresenta
 * l'organo nella scena 3D. Nel prototipo placeholder corrisponde al nome
 * assegnato manualmente alle geometrie; in futuro corrisponderà al nome del
 * nodo esportato dal file GLB (es. da Blender/Z-Anatomy). Il resto del
 * codice (selezione, navigazione, UI) dipende solo da questo id, mai dalla
 * geometria concreta: è così che il placeholder potrà essere sostituito dal
 * modello reale senza modificare la logica applicativa.
 */
export interface Organo {
  id: string;
  nome: string;
  meshId: string;
  descrizione: string;
  funzione: string;
  curiosita?: string[];
  parti: ParteOrgano[];
  fonti: FonteBibliografica[];
}

/** Stato di disponibilità dei contenuti/modello di un apparato. */
export type StatoApparato = "disponibile" | "prossimamente";

/**
 * Un apparato del corpo umano (es. apparato digerente).
 *
 * `modelPath` punterà, a partire dalla Fase 3+, al file GLB definitivo
 * dell'apparato. Nel prototipo placeholder è assente/ignorato perché la
 * geometria viene generata via codice da `PlaceholderBodyFactory`.
 */
export interface Apparato {
  id: string;
  nome: string;
  /** Colore identificativo usato per evidenziazioni e UI (hex CSS). */
  colore: string;
  stato: StatoApparato;
  modelPath?: string;
  organi: Organo[];
  fonti: FonteBibliografica[];
}
