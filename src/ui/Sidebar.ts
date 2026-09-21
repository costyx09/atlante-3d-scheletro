import { APPARATI } from "../data/apparati";
import type { NavigationView } from "../systems/NavigationState";

export class Sidebar {
  private readonly root: HTMLElement;

  constructor(container: HTMLElement, private readonly onSelect: (apparatoId: string) => void) {
    this.root = document.createElement("nav");
    this.root.className = "sidebar";
    this.root.setAttribute("aria-label", "Elenco apparati");
    container.appendChild(this.root);
    this.render();
  }

  private render(): void {
    const titolo = document.createElement("p");
    titolo.className = "sidebar__titolo";
    titolo.textContent = "Apparati";
    this.root.appendChild(titolo);

    const lista = document.createElement("ul");
    lista.className = "sidebar__lista";

    for (const apparato of APPARATI) {
      const item = document.createElement("li");
      const bottone = document.createElement("button");
      bottone.type = "button";
      bottone.className = "sidebar__voce";
      bottone.dataset.apparatoId = apparato.id;
      bottone.style.setProperty("--colore-apparato", apparato.colore);

      const pallino = document.createElement("span");
      pallino.className = "sidebar__pallino";

      const nome = document.createElement("span");
      nome.className = "sidebar__nome";
      nome.textContent = apparato.nome;

      bottone.append(pallino, nome);

      if (apparato.stato === "prossimamente") {
        const badge = document.createElement("span");
        badge.className = "sidebar__badge";
        badge.textContent = "in arrivo";
        bottone.appendChild(badge);
      }

      bottone.addEventListener("click", () => this.onSelect(apparato.id));
      item.appendChild(bottone);
      lista.appendChild(item);
    }

    this.root.appendChild(lista);
  }

  updateActive(view: NavigationView): void {
    this.root.querySelectorAll<HTMLButtonElement>(".sidebar__voce").forEach((el) => {
      const attivo = view.level !== "corpo" && el.dataset.apparatoId === view.apparatoId;
      el.classList.toggle("sidebar__voce--attivo", attivo);
    });
  }
}
