/**
 * Event emitter tipizzato minimale (senza dipendenze esterne).
 *
 * `Events` è una mappa { nomeEvento: tipoPayload }. Serve a far comunicare
 * i moduli (es. SelectionSystem → NavigationState → UI) senza che si
 * conoscano direttamente l'un l'altro.
 */
export class EventEmitter<Events extends object> {
  private listeners: { [K in keyof Events]?: Array<(payload: Events[K]) => void> } = {};

  on<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void): () => void {
    const list = this.listeners[event] ?? [];
    list.push(callback);
    this.listeners[event] = list;
    return () => this.off(event, callback);
  }

  off<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void): void {
    const list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = list.filter((cb) => cb !== callback);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners[event]?.forEach((cb) => cb(payload));
  }
}
