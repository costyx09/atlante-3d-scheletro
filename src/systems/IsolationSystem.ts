import * as THREE from "three";
import type { BodySegment } from "../core/AssetLoader";
import type { NavigationState, NavigationView } from "./NavigationState";
import { startTween } from "../utils/tween";
import { trovaApparato } from "../data/apparati";

type Materiale = THREE.MeshStandardMaterial;

interface ObiettivoMateriale {
  materiale: Materiale;
  opacitaPartenza: number;
  opacitaArrivo: number;
  emissivePartenza: number;
  emissiveArrivo: number;
}

const OPACITA_ORGANO_BASE = 1;
const OPACITA_ORGANO_ATTENUATA = 0.08;
const OPACITA_ORGANO_NON_ATTIVO_NELLO_STESSO_APPARATO = 0.4;

const EMISSIVE_BASE = 0.12;
const EMISSIVE_APPARATO_ATTIVO = 0.22;
const EMISSIVE_ORGANO_SELEZIONATO = 0.55;
const EMISSIVE_HOVER_BOOST = 0.2;
const APPARATO_SCHELETRO = "locomotore";

/**
 * Applica lo stato "isolato" del corpo: attenua gli apparati non coinvolti,
 * mantiene piena visibilità ed evidenzia l'apparato/organo attivo. Non
 * rimuove né distrugge nulla dalla scena: modifica solo i materiali, quindi
 * è sempre reversibile tornando allo stato "corpo".
 */
export class IsolationSystem {
  private hoveredObject: THREE.Object3D | null = null;
  private activeTween: { cancel: () => void } | null = null;
  private currentView: NavigationView = { level: "corpo" };
  private soloScheletro = false;

  constructor(
    private readonly segments: BodySegment[],
    navigation: NavigationState,
  ) {
    this.normalizzaColoreEmissivo();
    navigation.on("change", (view) => this.applyView(view));
    this.applyView({ level: "corpo" });
  }

  /**
   * Garantisce che ogni organo abbia un colore emissivo coerente con il
   * proprio apparato, indipendentemente da come è stato autorato il
   * materiale a monte.
   *
   * Necessario perché l'evidenziazione hover/selezione agisce solo su
   * `emissiveIntensity`: se il materiale arriva con `emissive` nero (come
   * i materiali PBR esportati da Blender/glTF, che di norma non
   * impostano un colore emissivo) l'evidenziazione risulterebbe
   * invisibile anche a intensità alta. Impostare qui il colore, una sola
   * volta, mantiene i materiali placeholder invariati (il colore coincide
   * già) e rende gli organi importati da GLB pronti per l'evidenziazione
   * senza doverli preparare manualmente in Blender.
   */
  private normalizzaColoreEmissivo(): void {
    for (const segmento of this.segments) {
      const colore = trovaApparato(segmento.apparatoId)?.colore;
      if (!colore) continue;
      for (const mesh of this.meshDiSegmento(segmento)) {
        (mesh.material as Materiale).emissive.set(colore);
      }
    }
  }

  /**
   * Restituisce tutte le Mesh (con materiale singolo, non array) che
   * compongono un segmento.
   *
   * Un segmento non è sempre direttamente una Mesh: quando un organo ha
   * più material slot in Blender (es. il fegato, "Organ" + "Ligament"),
   * l'esportatore glTF crea un unico nodo con più "primitive", e
   * `GLTFLoader` lo traduce in un `THREE.Group` con una Mesh figlia per
   * primitiva — verificato concretamente confrontando l'export dello
   * stomaco (1 slot: il nodo È la Mesh) con quello del fegato (2 slot: il
   * nodo è un Group con 2 Mesh figlie). Iterare con `traverse` gestisce
   * entrambi i casi senza bisogno di sapere quale dei due si applica:
   * `Object3D.traverse` invoca il callback anche sull'oggetto di partenza.
   */
  private meshDiSegmento(segmento: BodySegment): THREE.Mesh[] {
    const mesh: THREE.Mesh[] = [];
    segmento.object.traverse((obj) => {
      if (obj instanceof THREE.Mesh && !Array.isArray(obj.material)) {
        mesh.push(obj);
      }
    });
    return mesh;
  }

  /** Evidenzia temporaneamente un segmento al passaggio del mouse (indipendente dall'isolamento). */
  setHovered(segment: BodySegment | null): void {
    this.hoveredObject = segment?.object ?? null;
    this.applyView(this.currentView, false);
  }

  setSoloScheletro(attivo: boolean): void {
    this.soloScheletro = attivo;
    this.applyView(this.currentView);
  }

  isSoloScheletro(): boolean {
    return this.soloScheletro;
  }

  private applyView(view: NavigationView, animate = true): void {
    this.currentView = view;
    this.activeTween?.cancel();

    const obiettivi: ObiettivoMateriale[] = [];

    for (const segmento of this.segments) {
      const isHover = segmento.object === this.hoveredObject;
      const { opacita, emissive } = this.calcolaTargetOrgano(view, segmento, isHover);

      for (const mesh of this.meshDiSegmento(segmento)) {
        const materiale = mesh.material as Materiale;
        obiettivi.push({
          materiale,
          opacitaPartenza: materiale.opacity,
          opacitaArrivo: opacita,
          emissivePartenza:
            "emissiveIntensity" in materiale ? (materiale.emissiveIntensity as number) : 0,
          emissiveArrivo: emissive,
        });
        materiale.transparent = true;
      }
    }

    const applica = (t: number) => {
      for (const obiettivo of obiettivi) {
        obiettivo.materiale.opacity =
          obiettivo.opacitaPartenza + (obiettivo.opacitaArrivo - obiettivo.opacitaPartenza) * t;
        if ("emissiveIntensity" in obiettivo.materiale) {
          (obiettivo.materiale as THREE.MeshStandardMaterial).emissiveIntensity =
            obiettivo.emissivePartenza + (obiettivo.emissiveArrivo - obiettivo.emissivePartenza) * t;
        }
      }
    };

    if (animate) {
      this.activeTween = startTween({ durationMs: 500, onUpdate: applica });
    } else {
      applica(1);
    }
  }

  private calcolaTargetOrgano(
    view: NavigationView,
    segmento: BodySegment,
    isHover: boolean,
  ): { opacita: number; emissive: number } {
    let opacita: number;
    let emissive: number;

    if (this.soloScheletro && segmento.apparatoId !== APPARATO_SCHELETRO) {
      return { opacita: 0, emissive: 0 };
    }

    if (view.level === "corpo") {
      opacita = OPACITA_ORGANO_BASE;
      emissive = EMISSIVE_BASE;
    } else if (segmento.apparatoId !== view.apparatoId) {
      // Apparato diverso da quello isolato: quasi invisibile.
      opacita = OPACITA_ORGANO_ATTENUATA;
      emissive = 0;
    } else if (view.level === "apparato") {
      opacita = OPACITA_ORGANO_BASE;
      emissive = EMISSIVE_APPARATO_ATTIVO;
    } else {
      // view.level === "organo", stesso apparato.
      const isSelezionato = segmento.organoId === view.organoId;
      opacita = isSelezionato ? OPACITA_ORGANO_BASE : OPACITA_ORGANO_NON_ATTIVO_NELLO_STESSO_APPARATO;
      emissive = isSelezionato ? EMISSIVE_ORGANO_SELEZIONATO : EMISSIVE_BASE;
    }

    if (isHover) emissive += EMISSIVE_HOVER_BOOST;
    return { opacita, emissive };
  }
}
