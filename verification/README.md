# Verifica pipeline — Fase 3

Script Node.js usati per verificare *davvero* (non solo a parole) il
comportamento di `GLTFLoader` e la logica di selezione/camera/isolamento
sulla geometria reale esportata da Blender, senza bisogno di un browser.

Vanno eseguiti dalla root del progetto (`npm install` già fatto), perché
risolvono `three` da `node_modules`:

```bash
node verification/verify-selection-camera-isolation.mjs
node verification/verify-emissive-color.mjs
node verification/verify-liver-pipeline.mjs
```

- **verify-liver-multimaterial.mjs** — regressione permanente per organi
  multi-materiale: il fegato ha 2 material slot ("Organ"+"Ligament"),
  quindi diventa 1 nodo Group + 2 Mesh figlie in Three.js. Verifica che gli
  `extras` (letti risalendo i genitori) arrivino correttamente a entrambe.
  Da eseguire ogni volta che si aggiunge un organo con più di un material
  slot.

## Cosa verificano

- **verify-selection-camera-isolation.mjs** — carica `stomaco-test.glb` con
  lo stesso `GLTFLoader` dell'app, applica la calibrazione di scala/posizione,
  estrae i `BodySegment` da `userData`, calcola la bounding box e la
  distanza di `flyToBoundingBox`, poi simula un raycast (senza GPU: solo
  matematica di `THREE.Raycaster`) per dimostrare che hover/click
  risolverebbero la mesh e il segmento corretti.
- **verify-emissive-color.mjs** — stampa il colore emissivo effettivo dei
  materiali caricati dal GLB. Ha permesso di scoprire che i materiali PBR
  esportati da Blender hanno `emissive` nero di default (vedi fix in
  `IsolationSystem.normalizzaColoreEmissivo`).
- **verify-liver-pipeline.mjs** — stesso tipo di verifica end-to-end per il
  fegato. Ha permesso di scoprire che `Liver` (mesh con 2 material slot
  realmente usati) viene esposta da `GLTFLoader` come un `Group` con due
  `Mesh` figlie **senza `userData` proprio**: gli `extras` restano sul nodo
  padre. Da qui la funzione `risaliMetadataAnatomico` in
  `RealOrganTestLoader.ts`, che risale la gerarchia invece di assumere che
  i metadata siano sempre sulla mesh foglia.

## Limite noto

Questi script verificano la **logica** (matematica, dati, metadata), non il
rendering a schermo: per hover/click/isolamento/rotazione *visti* serve
comunque un test manuale nel browser (`npm run dev`), che non è
automatizzabile in questo ambiente privo di GPU/browser headless.
