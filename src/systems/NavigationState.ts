import { EventEmitter } from "../utils/EventEmitter";

export type NavigationLevel = "corpo" | "apparato" | "organo";

export interface NavigationView {
  level: NavigationLevel;
  apparatoId?: string;
  organoId?: string;
}

interface NavigationEvents {
  change: NavigationView;
}

/**
 * Unica fonte di verità su "dove si trova" l'utente nella gerarchia
 * Corpo → Apparato → Organo. Non conosce Three.js né il DOM: emette solo
 * eventi `change` a cui si iscrivono IsolationSystem, CameraController
 * (tramite UIManager) e i componenti UI.
 */
export class NavigationState extends EventEmitter<NavigationEvents> {
  private history: NavigationView[] = [{ level: "corpo" }];

  get current(): NavigationView {
    return this.history[this.history.length - 1];
  }

  private push(view: NavigationView): void {
    this.history.push(view);
    this.emit("change", view);
  }

  selectApparato(apparatoId: string): void {
    if (this.current.level === "apparato" && this.current.apparatoId === apparatoId) return;
    this.push({ level: "apparato", apparatoId });
  }

  selectOrgano(apparatoId: string, organoId: string): void {
    if (this.current.level === "organo" && this.current.organoId === organoId) return;
    this.push({ level: "organo", apparatoId, organoId });
  }

  /** Torna alla vista d'insieme del corpo e azzera la cronologia. */
  goToBody(): void {
    this.history = [{ level: "corpo" }];
    this.emit("change", this.current);
  }

  /** Torna alla vista precedente nella cronologia, se presente. */
  goBack(): void {
    if (this.history.length <= 1) return;
    this.history.pop();
    this.emit("change", this.current);
  }
}
