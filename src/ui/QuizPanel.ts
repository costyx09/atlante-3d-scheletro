import type { DomandaQuiz } from "../content/quizDigerente";

/**
 * Modalità Quiz, prima versione: domanda, 4 risposte, feedback immediato,
 * punteggio finale. Dati locali (`DomandaQuiz[]`), nessuna chiamata di
 * rete o generazione via LLM a runtime. Aggiungere altri quiz in futuro
 * significa passare un altro array di domande a `avvia()`.
 */
export class QuizPanel {
  private readonly root: HTMLElement;
  private domande: DomandaQuiz[] = [];
  private indice = 0;
  private punteggio = 0;
  private rispostaData = false;

  constructor(container: HTMLElement) {
    this.root = document.createElement("div");
    this.root.className = "quiz-panel";
    this.root.hidden = true;
    container.appendChild(this.root);
  }

  avvia(domande: DomandaQuiz[], titolo: string): void {
    this.domande = domande;
    this.indice = 0;
    this.punteggio = 0;
    this.rispostaData = false;
    this.root.hidden = false;
    this.renderDomanda(titolo);
  }

  private chiudi = (): void => {
    this.root.hidden = true;
  };

  private renderDomanda(titolo: string): void {
    const domanda = this.domande[this.indice];
    this.rispostaData = false;

    this.root.innerHTML = `
      <div class="quiz-panel__intestazione">
        <span class="quiz-panel__titolo">${titolo}</span>
        <span class="quiz-panel__progresso">Domanda ${this.indice + 1} / ${this.domande.length}</span>
        <button type="button" class="quiz-panel__chiudi" aria-label="Chiudi quiz">✕</button>
      </div>
      <p class="quiz-panel__domanda">${domanda.domanda}</p>
      <ul class="quiz-panel__risposte">
        ${domanda.risposte
          .map((r, i) => `<li><button type="button" class="quiz-panel__risposta" data-indice="${i}">${r}</button></li>`)
          .join("")}
      </ul>
      <p class="quiz-panel__feedback" hidden></p>
      <div class="quiz-panel__controlli">
        <button type="button" class="quiz-panel__avanti" hidden>Avanti →</button>
      </div>
    `;

    this.root.querySelector(".quiz-panel__chiudi")?.addEventListener("click", this.chiudi);
    this.root.querySelectorAll<HTMLButtonElement>(".quiz-panel__risposta").forEach((btn) => {
      btn.addEventListener("click", () => this.rispondi(Number(btn.dataset.indice)));
    });
    this.root.querySelector(".quiz-panel__avanti")?.addEventListener("click", () => this.prossimaDomanda(titolo));
  }

  private rispondi(indiceScelto: number): void {
    if (this.rispostaData) return;
    this.rispostaData = true;
    const domanda = this.domande[this.indice];
    const corretto = indiceScelto === domanda.corretta;
    if (corretto) this.punteggio++;

    this.root.querySelectorAll<HTMLButtonElement>(".quiz-panel__risposta").forEach((btn, i) => {
      btn.disabled = true;
      if (i === domanda.corretta) btn.classList.add("quiz-panel__risposta--corretta");
      else if (i === indiceScelto) btn.classList.add("quiz-panel__risposta--sbagliata");
    });

    const feedback = this.root.querySelector<HTMLElement>(".quiz-panel__feedback");
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = (corretto ? "Corretto. " : "Non corretto. ") + domanda.spiegazione;
      feedback.classList.toggle("quiz-panel__feedback--ok", corretto);
      feedback.classList.toggle("quiz-panel__feedback--ko", !corretto);
    }
    const avanti = this.root.querySelector<HTMLElement>(".quiz-panel__avanti");
    if (avanti) avanti.hidden = false;
  }

  private prossimaDomanda(titolo: string): void {
    if (this.indice < this.domande.length - 1) {
      this.indice++;
      this.renderDomanda(titolo);
    } else {
      this.renderRisultatoFinale(titolo);
    }
  }

  private renderRisultatoFinale(titolo: string): void {
    this.root.innerHTML = `
      <div class="quiz-panel__intestazione">
        <span class="quiz-panel__titolo">${titolo}</span>
        <button type="button" class="quiz-panel__chiudi" aria-label="Chiudi quiz">✕</button>
      </div>
      <p class="quiz-panel__risultato">Hai risposto correttamente a ${this.punteggio} domande su ${this.domande.length}.</p>
      <div class="quiz-panel__controlli">
        <button type="button" class="quiz-panel__riprova">Riprova</button>
      </div>
    `;
    this.root.querySelector(".quiz-panel__chiudi")?.addEventListener("click", this.chiudi);
    this.root.querySelector(".quiz-panel__riprova")?.addEventListener("click", () => this.avvia(this.domande, titolo));
  }
}
