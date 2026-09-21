/**
 * Micro motore di tweening basato su requestAnimationFrame.
 * Evita di aggiungere una libreria esterna solo per interpolare valori
 * numerici (usato principalmente da CameraController per i movimenti
 * "fly-to").
 */

export type EasingFn = (t: number) => number;

export const easeInOutCubic: EasingFn = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface TweenOptions {
  durationMs: number;
  easing?: EasingFn;
  onUpdate: (progress: number) => void;
  onComplete?: () => void;
}

/** Un tween attivo, cancellabile. */
export interface ActiveTween {
  cancel: () => void;
}

/**
 * Avvia un tween da 0 a 1 e invoca `onUpdate` a ogni frame con il progresso
 * "easato". Ritorna un handle per poterlo cancellare (es. se l'utente
 * avvia una nuova selezione prima che la transizione precedente sia finita).
 */
export function startTween({ durationMs, easing = easeInOutCubic, onUpdate, onComplete }: TweenOptions): ActiveTween {
  let cancelled = false;
  const start = performance.now();

  function frame(now: number) {
    if (cancelled) return;
    const elapsed = now - start;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    onUpdate(easing(rawProgress));

    if (rawProgress < 1) {
      requestAnimationFrame(frame);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(frame);
  return { cancel: () => (cancelled = true) };
}
