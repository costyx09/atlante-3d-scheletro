import * as THREE from "three";
import type { BodySegment } from "../core/AssetLoader";
import { CameraController } from "../core/CameraController";
import { IsolationSystem } from "../systems/IsolationSystem";
import { NavigationState } from "../systems/NavigationState";
import { SelectionSystem } from "../systems/SelectionSystem";
import { trovaApparato, trovaOrgano } from "../data/apparati";
import { PERCORSO_DEL_CIBO } from "../content/percorsoDelCibo";
import { QUIZ_DIGERENTE } from "../content/quizDigerente";
import { Breadcrumb } from "./Breadcrumb";
import { InfoPanel } from "./InfoPanel";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";
import { Tooltip } from "./Tooltip";
import { GuidedTourPanel } from "./GuidedTourPanel";
import { QuizPanel } from "./QuizPanel";

/**
 * Non contiene logica propria: si limita a cablare gli eventi dei sistemi
 * (navigazione, selezione, isolamento) con i componenti DOM e con i
 * movimenti di camera. Tenerla separata mantiene i singoli componenti UI
 * "stupidi" e facilmente testabili/sostituibili.
 */
export class UIManager {
  private readonly sidebar: Sidebar;
  private readonly breadcrumb: Breadcrumb;
  private readonly infoPanel: InfoPanel;
  private readonly tooltip: Tooltip;
  private readonly tour: GuidedTourPanel;
  private readonly quiz: QuizPanel;
  private readonly toolbar: Toolbar;

  constructor(
    overlay: HTMLElement,
    private readonly segments: BodySegment[],
    private readonly navigation: NavigationState,
    private readonly selection: SelectionSystem,
    private readonly isolation: IsolationSystem,
    private readonly camera: CameraController,
  ) {
    this.tour = new GuidedTourPanel(overlay, this.navigation);
    this.quiz = new QuizPanel(overlay);

    this.toolbar = new Toolbar(overlay, {
      onReset: () => this.navigation.goToBody(),
      onAvviaPercorso: () => this.tour.avvia(PERCORSO_DEL_CIBO),
      onApriQuiz: () => this.quiz.avvia(QUIZ_DIGERENTE, "Quiz — Apparato digerente"),
      onToggleScheletro: () => {
        const attivo = !this.isolation.isSoloScheletro();
        this.isolation.setSoloScheletro(attivo);
        this.toolbar.setScheletroAttivo(attivo);
      },
    });

    this.breadcrumb = new Breadcrumb(
      overlay,
      () => this.navigation.goToBody(),
      (apparatoId) => this.navigation.selectApparato(apparatoId),
    );
    this.sidebar = new Sidebar(overlay, (apparatoId) => this.navigation.selectApparato(apparatoId));
    this.infoPanel = new InfoPanel(
      overlay,
      (apparatoId, organoId) => this.navigation.selectOrgano(apparatoId, organoId),
      () => this.navigation.goBack(),
    );
    this.tooltip = new Tooltip(overlay);

    this.navigation.on("change", (view) => {
      this.sidebar.updateActive(view);
      this.breadcrumb.update(view);
      this.infoPanel.update(view);
      this.muoviCameraPer(view);
    });
    this.breadcrumb.update(this.navigation.current);

    this.selection.on("hover", ({ segment, clientX, clientY }) => {
      this.isolation.setHovered(segment);
      if (segment) {
        const nome = this.nomeSegmento(segment);
        this.tooltip.show(nome, clientX, clientY);
      } else {
        this.tooltip.hide();
      }
    });

    this.selection.on("select", ({ segment }) => {
      if (segment.organoId) {
        this.navigation.selectOrgano(segment.apparatoId, segment.organoId);
      } else {
        this.navigation.selectApparato(segment.apparatoId);
      }
    });
  }

  private nomeSegmento(segment: BodySegment): string {
    if (segment.organoId) {
      return trovaOrgano(segment.apparatoId, segment.organoId)?.nome ?? segment.organoId;
    }
    return trovaApparato(segment.apparatoId)?.nome ?? segment.apparatoId;
  }

  private muoviCameraPer(view: { level: string; apparatoId?: string; organoId?: string }): void {
    if (view.level === "corpo") {
      this.camera.resetToDefault();
      return;
    }

    if (view.level === "organo" && view.organoId) {
      // IMPORTANTE: un organo può corrispondere a più segmenti/mesh (es. il
      // cuore ha 4 camere, i polmoni più mesh per lobo): va inquadrato
      // l'insieme, non solo il primo segmento trovato.
      const oggetti = this.segments
        .filter((s) => s.apparatoId === view.apparatoId && s.organoId === view.organoId)
        .map((s) => s.object);
      if (oggetti.length > 0) {
        const box = new THREE.Box3();
        oggetti.forEach((obj) => box.expandByObject(obj));
        this.camera.flyToBoundingBox(box);
      }
      return;
    }

    if (view.level === "apparato" && view.apparatoId) {
      const oggetti = this.segments
        .filter((s) => s.apparatoId === view.apparatoId)
        .map((s) => s.object);
      if (oggetti.length > 0) {
        const box = new THREE.Box3();
        oggetti.forEach((obj) => box.expandByObject(obj));
        this.camera.flyToBoundingBox(box);
      }
    }
  }
}
