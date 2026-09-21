import * as THREE from "three";

/**
 * Responsabilità unica: possedere scena, renderer e illuminazione, ed
 * esporre il ciclo di rendering. Non conosce anatomia, selezione o UI:
 * riceve solo una camera da renderizzare a ogni frame.
 */
export class SceneManager {
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  private readonly container: HTMLElement;
  private readonly onTick: Array<(deltaSeconds: number) => void> = [];
  private previousFrameTime = performance.now();
  private activeCamera: THREE.PerspectiveCamera | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    this.scene = new THREE.Scene();
    // Blu-slate molto scuro: coerente con l'estetica "imaging clinico"
    // dell'interfaccia, non un near-black neutro.
    this.scene.background = new THREE.Color("#0b1220");
    this.scene.fog = new THREE.FogExp2("#0b1220", 0.018);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    container.appendChild(this.renderer.domElement);
    this.setupLighting();
    this.handleResize();

    window.addEventListener("resize", () => this.handleResize());
  }

  /** Illuminazione a tre punti pensata per un soggetto centrale in una scena scura. */
  private setupLighting(): void {
    const key = new THREE.DirectionalLight("#eef3ff", 2.4);
    key.position.set(3.5, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0015;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight("#4fd1c5", 1.1);
    rim.position.set(-4, 2.5, -3);
    this.scene.add(rim);

    const fill = new THREE.HemisphereLight("#33507a", "#0b1220", 0.6);
    this.scene.add(fill);

    // Piano di appoggio, appena percepibile, per dare un riferimento spaziale
    // al corpo senza distrarre dal soggetto.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(6, 64),
      new THREE.MeshStandardMaterial({ color: "#0e1728", roughness: 1, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.1;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  setActiveCamera(camera: THREE.PerspectiveCamera): void {
    this.activeCamera = camera;
    this.handleResize();
  }

  /** Registra una callback chiamata a ogni frame prima del render. */
  addTickCallback(callback: (deltaSeconds: number) => void): void {
    this.onTick.push(callback);
  }

  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);

    if (this.activeCamera) {
      this.activeCamera.aspect = width / height;
      this.activeCamera.updateProjectionMatrix();
    }
  }

  start(): void {
    const loop = () => {
      requestAnimationFrame(loop);
      const now = performance.now();
      const delta = Math.min((now - this.previousFrameTime) / 1000, 0.1);
      this.previousFrameTime = now;
      this.onTick.forEach((cb) => cb(delta));
      if (this.activeCamera) {
        this.renderer.render(this.scene, this.activeCamera);
      }
    };
    loop();
  }
}
