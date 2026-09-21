export class Tooltip {
  private readonly root: HTMLElement;

  constructor(container: HTMLElement) {
    this.root = document.createElement("div");
    this.root.className = "tooltip";
    this.root.hidden = true;
    container.appendChild(this.root);
  }

  show(testo: string, clientX: number, clientY: number): void {
    this.root.textContent = testo;
    this.root.style.left = `${clientX}px`;
    this.root.style.top = `${clientY}px`;
    this.root.hidden = false;
  }

  hide(): void {
    this.root.hidden = true;
  }
}
