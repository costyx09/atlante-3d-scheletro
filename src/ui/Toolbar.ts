export interface ToolbarAzioni {
  onReset: () => void;
  onAvviaPercorso: () => void;
  onApriQuiz: () => void;
  onToggleScheletro: () => void;
}

export class Toolbar {
  private readonly bottoneScheletro: HTMLButtonElement;

  constructor(container: HTMLElement, azioni: ToolbarAzioni) {
    const root = document.createElement("header");
    root.className = "toolbar";

    const titolo = document.createElement("div");
    titolo.className = "toolbar__titolo";
    titolo.innerHTML = `<span class="toolbar__titolo-principale">Atlante Anatomico 3D</span>
      <span class="toolbar__titolo-secondario">Realizzato da Costantino Toscano e Jacopo Aretano · 3BA</span>`;

    const azioniContainer = document.createElement("div");
    azioniContainer.className = "toolbar__azioni";

    const bottonePercorso = this.creaBottone("Percorso del cibo", "toolbar__secondario", azioni.onAvviaPercorso);
    const bottoneQuiz = this.creaBottone("Quiz", "toolbar__secondario", azioni.onApriQuiz);
    this.bottoneScheletro = this.creaBottone("Solo scheletro", "toolbar__secondario toolbar__toggle", azioni.onToggleScheletro);
    this.bottoneScheletro.setAttribute("aria-pressed", "false");
    const bottoneReset = this.creaBottone("Vista completa", "toolbar__reset", azioni.onReset);

    azioniContainer.append(bottonePercorso, bottoneQuiz, this.bottoneScheletro, bottoneReset);
    root.append(titolo, azioniContainer);
    container.appendChild(root);
  }

  setScheletroAttivo(attivo: boolean): void {
    this.bottoneScheletro.classList.toggle("toolbar__toggle--attivo", attivo);
    this.bottoneScheletro.setAttribute("aria-pressed", String(attivo));
  }

  private creaBottone(testo: string, classe: string, onClick: () => void): HTMLButtonElement {
    const b = document.createElement("button");
    b.type = "button";
    b.className = classe;
    b.textContent = testo;
    b.addEventListener("click", onClick);
    return b;
  }
}
