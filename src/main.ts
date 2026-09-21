import "./style.css";
import { SceneManager } from "./core/SceneManager";
import { CameraController } from "./core/CameraController";
import { HybridBodyProvider } from "./placeholder/HybridBodyProvider";
import { SelectionSystem } from "./systems/SelectionSystem";
import { IsolationSystem } from "./systems/IsolationSystem";
import { NavigationState } from "./systems/NavigationState";
import { UIManager } from "./ui/UIManager";

async function bootstrap(): Promise<void> {
  const viewport = document.querySelector<HTMLElement>("#viewport");
  const overlay = document.querySelector<HTMLElement>("#ui-overlay");
  if (!viewport || !overlay) {
    throw new Error("Elementi #viewport / #ui-overlay mancanti in index.html");
  }

  overlay.innerHTML = `
    <div class="caricamento" role="status" aria-live="polite">
      <span class="caricamento__indicatore"></span>
      <span>Caricamento dell'atlante</span>
    </div>`;

  const sceneManager = new SceneManager(viewport);
  const cameraController = new CameraController(sceneManager.renderer.domElement);
  sceneManager.setActiveCamera(cameraController.camera);

  // Tutti i modelli reali del manifest (vedi data/organModels.ts). Per
  // aggiungere un organo dopo averlo esportato dalla pipeline Blender basta
  // inserire una riga nel manifest.
  const bodyProvider = new HybridBodyProvider();

  try {
    const { root, segments } = await bodyProvider.load();
    sceneManager.scene.add(root);
    overlay.replaceChildren();

    const navigation = new NavigationState();
    const selection = new SelectionSystem(sceneManager.renderer.domElement, cameraController.camera);
    selection.setSegments(segments);
    const isolation = new IsolationSystem(segments, navigation);

    new UIManager(overlay, segments, navigation, selection, isolation, cameraController);

    sceneManager.addTickCallback(() => cameraController.update());
    sceneManager.start();

    // Solo in sviluppo: espone il renderer per leggere draw calls/triangoli
    // reali dalla console del browser (`__renderer.info.render`).
    if (import.meta.env.DEV) {
      (window as unknown as { __renderer: typeof sceneManager.renderer }).__renderer =
        sceneManager.renderer;
    }
  } catch (errore) {
    console.error("Impossibile costruire il modello del corpo:", errore);
    overlay.innerHTML = `
      <div class="errore-caricamento">
        <h2>Impossibile caricare il modello 3D</h2>
        <p>Ricarica la pagina. Se il problema persiste, controlla la console per i dettagli.</p>
      </div>`;
  }
}

bootstrap();
