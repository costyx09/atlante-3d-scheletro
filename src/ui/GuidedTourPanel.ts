import type { NavigationState } from "../systems/NavigationState";
import type { PercorsoGuidato } from "../content/percorsoDelCibo";

/**
 * Esegue un `PercorsoGuidato` guidando `NavigationState` tappa per tappa:
 * ogni "Successivo" seleziona l'organo della tappa (che a cascata attiva
 * isolamento, camera e InfoPanel già esistenti, senza logica duplicata
 * qui), mostrando un testo narrativo dedicato sopra l'InfoPanel standard.
 *
 * Architettura pensata per la futura modalità "Lezione": una lezione è,
 * concettualmente, un `PercorsoGuidato` con più metadati (obiettivi,
 * quiz di verifica per tappa, ecc.). Questo componente è già il motore di
 * esecuzione riusabile; oggi viene usato per l'unica demo disponibile
 * ("Il percorso del cibo").
 */
export class GuidedTourPanel {
  private readonly root: HTMLElement;
  private percorso: PercorsoGuidato | null = null;
  private indice = 0;

  constructor(
    container: HTMLElement,
    private readonly navigation: NavigationState,
  ) {
    this.root = document.createElement("div");
    this.root.className = "tour-panel";
    this.root.hidden = true;
    container.appendChild(this.root);
  }

  avvia(percorso: PercorsoGuidato): void {
    this.percorso = percorso;
    this.indice = 0;
    this.root.hidden = false;
    this.vaiATappa(0);
  }

  private chiudi = (): void => {
    this.root.hidden = true;
    this.percorso = null;
    this.navigation.goToBody();
  };

  private vaiATappa(indice: number): void {
    if (!this.percorso) return;
    this.indice = Math.max(0, Math.min(indice, this.percorso.tappe.length - 1));
    const tappa = this.percorso.tappe[this.indice];
    this.navigation.selectOrgano(tappa.apparatoId, tappa.organoId);
    this.render();
  }

  private render(): void {
    if (!this.percorso) return;
    const tappa = this.percorso.tappe[this.indice];
    const ultima = this.indice === this.percorso.tappe.length - 1;
    const prima = this.indice === 0;

    this.root.innerHTML = `
      <div class="tour-panel__intestazione">
        <span class="tour-panel__titolo">${this.percorso.titolo}</span>
        <span class="tour-panel__progresso">${this.indice + 1} / ${this.percorso.tappe.length}</span>
        <button type="button" class="tour-panel__chiudi" aria-label="Chiudi percorso guidato">✕</button>
      </div>
      <h3 class="tour-panel__tappa-titolo">${tappa.titolo}</h3>
      <p class="tour-panel__tappa-testo">${tappa.testo}</p>
      <div class="tour-panel__controlli">
        <button type="button" class="tour-panel__prec" ${prima ? "disabled" : ""}>← Precedente</button>
        <button type="button" class="tour-panel__succ">${ultima ? "Termina" : "Successivo →"}</button>
      </div>
    `;

    this.root.querySelector(".tour-panel__chiudi")?.addEventListener("click", this.chiudi);
    this.root.querySelector(".tour-panel__prec")?.addEventListener("click", () => this.vaiATappa(this.indice - 1));
    this.root.querySelector(".tour-panel__succ")?.addEventListener("click", () => {
      if (ultima) this.chiudi();
      else this.vaiATappa(this.indice + 1);
    });
  }
}
