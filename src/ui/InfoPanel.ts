import type { NavigationView } from "../systems/NavigationState";
import { trovaApparato } from "../data/apparati";
import type { FonteBibliografica } from "../data/schema";

export class InfoPanel {
  private readonly root: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly onSelectOrgano: (apparatoId: string, organoId: string) => void,
    private readonly onGoBack: () => void,
  ) {
    this.root = document.createElement("aside");
    this.root.className = "info-panel";
    this.root.setAttribute("aria-live", "polite");
    container.appendChild(this.root);
    this.renderCorpo();
  }

  update(view: NavigationView): void {
    if (view.level === "corpo") {
      this.renderCorpo();
    } else if (view.level === "apparato" && view.apparatoId) {
      this.renderApparato(view.apparatoId);
    } else if (view.level === "organo" && view.apparatoId && view.organoId) {
      this.renderOrgano(view.apparatoId, view.organoId);
    }
  }

  private renderCorpo(): void {
    this.root.innerHTML = `
      <p class="info-panel__eyebrow">Benvenuto</p>
      <h2 class="info-panel__titolo">Esplora il corpo umano</h2>
      <p class="info-panel__testo">
        Ruota e ingrandisci il modello con il mouse. Scegli un apparato dalla
        lista a sinistra, oppure clicca direttamente su un organo evidenziato
        nella scena per isolarlo e scoprirne la funzione.
      </p>
    `;
  }

  private renderApparato(apparatoId: string): void {
    const apparato = trovaApparato(apparatoId);
    if (!apparato) return;

    if (apparato.stato === "prossimamente" || apparato.organi.length === 0) {
      this.root.innerHTML = `
        ${this.backButtonHtml()}
        <p class="info-panel__eyebrow" style="--colore-apparato:${apparato.colore}">Apparato</p>
        <h2 class="info-panel__titolo">${apparato.nome}</h2>
        <p class="info-panel__testo">
          I contenuti didattici di questo apparato sono in preparazione e
          verranno aggiunti in una fase successiva del progetto.
        </p>
      `;
      this.bindBackButton();
      return;
    }

    const listaOrgani = apparato.organi
      .map(
        (organo) => `
        <li>
          <button type="button" class="info-panel__organo" data-organo-id="${organo.id}">
            <span class="info-panel__organo-nome">${organo.nome}</span>
            <span class="info-panel__organo-desc">${organo.descrizione}</span>
          </button>
        </li>`,
      )
      .join("");

    this.root.innerHTML = `
      ${this.backButtonHtml()}
      <p class="info-panel__eyebrow" style="--colore-apparato:${apparato.colore}">Apparato</p>
      <h2 class="info-panel__titolo">${apparato.nome}</h2>
      <p class="info-panel__testo">Seleziona un organo per approfondirlo.</p>
      <ul class="info-panel__lista-organi">${listaOrgani}</ul>
    `;

    this.bindBackButton();
    this.root.querySelectorAll<HTMLButtonElement>(".info-panel__organo").forEach((btn) => {
      btn.addEventListener("click", () => this.onSelectOrgano(apparatoId, btn.dataset.organoId!));
    });
  }

  private renderOrgano(apparatoId: string, organoId: string): void {
    const apparato = trovaApparato(apparatoId);
    const organo = apparato?.organi.find((o) => o.id === organoId);
    if (!apparato || !organo) return;

    const curiosita = organo.curiosita?.length
      ? `<div class="info-panel__blocco">
          <h3>Lo sapevi?</h3>
          <ul class="info-panel__curiosita">${organo.curiosita.map((c) => `<li>${c}</li>`).join("")}</ul>
        </div>`
      : "";

    const parti = organo.parti.length
      ? `<div class="info-panel__blocco">
          <h3>Struttura</h3>
          <ul class="info-panel__parti">
            ${organo.parti
              .map(
                (parte) => `
              <li>
                <p class="info-panel__parte-nome">${parte.nome}</p>
                <p class="info-panel__parte-testo">${parte.descrizione}</p>
                <p class="info-panel__parte-funzione">${parte.funzione}</p>
              </li>`,
              )
              .join("")}
          </ul>
        </div>`
      : "";

    this.root.innerHTML = `
      ${this.backButtonHtml()}
      <p class="info-panel__eyebrow" style="--colore-apparato:${apparato.colore}">${apparato.nome}</p>
      <h2 class="info-panel__titolo">${organo.nome}</h2>
      <p class="info-panel__testo">${organo.descrizione}</p>
      <div class="info-panel__blocco">
        <h3>Funzione</h3>
        <p class="info-panel__testo">${organo.funzione}</p>
      </div>
      ${parti}
      ${curiosita}
      ${this.fontiHtml(organo.fonti)}
    `;

    this.bindBackButton();
  }

  private fontiHtml(fonti: FonteBibliografica[]): string {
    if (fonti.length === 0) return "";
    const voci = fonti
      .map((f) => `${f.titolo}${f.autore ? ` — ${f.autore}` : ""}${f.anno ? ` (${f.anno})` : ""}`)
      .join("; ");
    return `<p class="info-panel__fonti">Fonti: ${voci}</p>`;
  }

  private backButtonHtml(): string {
    return `<button type="button" class="info-panel__indietro">← Indietro</button>`;
  }

  private bindBackButton(): void {
    this.root.querySelector(".info-panel__indietro")?.addEventListener("click", this.onGoBack);
  }
}
