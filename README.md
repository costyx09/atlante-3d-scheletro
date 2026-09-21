# Atlante Anatomico 3D — Liceo Scientifico

Prima versione completa e stabile dell'atlante anatomico 3D interattivo.
Corpo umano esplorabile con modelli reali (Z-Anatomy) per 5 apparati su 8,
navigazione Corpo → Apparato → Organo → Parte, percorso guidato animato e
quiz dimostrativi.

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
npm run preview
```

## Verifica

```bash
node verification/verify-all-organs.mjs         # tutti i 18 GLB
node verification/verify-liver-multimaterial.mjs # regressione organi multi-materiale
node verification/verify-emissive-color.mjs      # regressione colore evidenziazione
```

## Struttura

```
src/
  core/            SceneManager · CameraController · AssetLoader · GlbOrganLoader
  systems/         NavigationState · SelectionSystem · IsolationSystem
  data/            schema.ts · apparati.ts (registry) · organModels.ts (manifest GLB)
  content/         Un file per apparato + percorsoDelCibo.ts + quizDigerente.ts
  placeholder/     PlaceholderBodyFactory (guscio) · HybridBodyProvider (produzione)
  ui/              Toolbar · Sidebar · Breadcrumb · InfoPanel · Tooltip ·
                   GuidedTourPanel · QuizPanel · UIManager
blender-pipeline/  export_anatomy.py (pipeline parametrica) · run_batch_export.py ·
                   configs/*.json (una per organo) · README.md
verification/      Script Node di verifica automatica sui GLB prodotti
public/models/     18 file GLB (~6.3 MB totali)
public/draco/      Decoder Draco locale (nessuna dipendenza di rete)
```

## Aggiungere un nuovo organo

1. Ispezionare l'oggetto in `Startup.blend` (nome esatto, mesh reale vs
   label `.j`/`.t`, modifier, material slot) — vedi `blender-pipeline/README.md`.
2. Scrivere una config JSON in `blender-pipeline/configs/`.
3. `blender --background --factory-startup --python blender-pipeline/export_anatomy.py -- --source <Startup.blend> --config <config.json>`
4. Copiare il GLB in `public/models/`.
5. Aggiungere una riga a `src/data/organModels.ts`.
6. Aggiungere i contenuti testuali in `src/content/<apparato>.ts`.

Nessun'altra parte del codice richiede modifiche.

Vedi la risposta finale della sessione di sviluppo per il report completo
(apparati completi, esclusioni motivate, numeri di performance, problemi
noti, funzionalità future).
