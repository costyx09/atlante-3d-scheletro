import type { NavigationView } from "../systems/NavigationState";
import { trovaApparato, trovaOrgano } from "../data/apparati";

export class Breadcrumb {
  private readonly root: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly onGoToBody: () => void,
    private readonly onGoToApparato: (apparatoId: string) => void,
  ) {
    this.root = document.createElement("div");
    this.root.className = "breadcrumb";
    this.root.setAttribute("aria-label", "Percorso di navigazione");
    container.appendChild(this.root);
  }

  update(view: NavigationView): void {
    this.root.innerHTML = "";

    this.root.appendChild(this.creaCrumb("Corpo umano", view.level === "corpo", this.onGoToBody));

    if (view.apparatoId) {
      const apparato = trovaApparato(view.apparatoId);
      if (apparato) {
        this.root.appendChild(this.creaSeparatore());
        this.root.appendChild(
          this.creaCrumb(apparato.nome, view.level === "apparato", () =>
            this.onGoToApparato(view.apparatoId!),
          ),
        );
      }
    }

    if (view.apparatoId && view.organoId) {
      const organo = trovaOrgano(view.apparatoId, view.organoId);
      if (organo) {
        this.root.appendChild(this.creaSeparatore());
        this.root.appendChild(this.creaCrumb(organo.nome, true, undefined));
      }
    }
  }

  private creaCrumb(testo: string, attivo: boolean, onClick?: () => void): HTMLElement {
    const el = document.createElement(onClick ? "button" : "span");
    el.className = "breadcrumb__voce" + (attivo ? " breadcrumb__voce--attivo" : "");
    el.textContent = testo;
    if (onClick && el instanceof HTMLButtonElement) {
      el.type = "button";
      el.addEventListener("click", onClick);
    }
    return el;
  }

  private creaSeparatore(): HTMLElement {
    const sep = document.createElement("span");
    sep.className = "breadcrumb__separatore";
    sep.textContent = "/";
    sep.setAttribute("aria-hidden", "true");
    return sep;
  }
}
