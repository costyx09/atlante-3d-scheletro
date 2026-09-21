# Pipeline Blender — Z-Anatomy → GLB

`export_anatomy.py` è la pipeline **generalizzata e riutilizzabile**:
prende in ingresso un file di configurazione JSON (uno per organo, in
`configs/`) e non richiede di riscrivere codice Blender per ogni nuovo
organo. Richiede **Blender 4.2 LTS o comunque ≤ 4.4** (testato su 4.0.2) e
il file `Startup.blend` originale (non incluso per dimensione/licenza:
https://github.com/Z-Anatomy/Models-of-human-anatomy), aperto sempre in
sola lettura — non viene mai modificato o salvato.

## Uso

```bash
blender --background --factory-startup --python export_anatomy.py -- \
  --source /percorso/Startup.blend \
  --config configs/fegato.json
```

Un file di configurazione per organo (vedi `configs/stomaco.json` e
`configs/fegato.json`). Lo schema completo è documentato nel docstring in
testa a `export_anatomy.py`.

## Cosa fa, nell'ordine

1. Importa **solo** gli Object elencati in `oggetti` con `bpy.ops.wm.append`
   in un'**unica chiamata batch** (importante: chiamate separate duplicano
   le dipendenze condivise — vedi nota sotto).
2. Rimuove le dipendenze non necessarie (Empty di gerarchia, piani di
   cross-section) mantenendo la trasformazione mondo.
3. Applica ("bake") tutti i modifier — Subsurf, Geometry Nodes, ecc. — in
   mesh statiche.
4. Sostituisce **ogni slot materiale esistente** (non solo il primo) con
   un PBR semplice compatibile glTF, preservando il numero di slot secondo
   la mappa `materiali` in configurazione.
5. Rimuove i Custom Properties ereditati dal file originale e imposta
   `apparato_id`/`organo_id` (+ `parte_id` se presente in `parti`).
6. Esporta in GLB (senza Draco — vedi limitazione sotto) e in glTF+JSON
   separato (solo per ispezione testuale degli `extras`).

## Organi già configurati

| Organo | Config | Object inclusi | Note |
|---|---|---|---|
| Stomaco | `configs/stomaco.json` | Stomach, Mucosa of stomach | — |
| Fegato | `configs/fegato.json` | Liver | Segmenti di Couinaud (I-VIII) documentati in `note_approfondimento`, mesh reali ma **non inclusi** nella scena scolastica attuale |

## Problemi reali incontrati (e perché lo script è scritto così)

- **`bpy.data.libraries.load()` a basso livello produce un export vuoto
  (132 byte)** in modalità background. **`bpy.ops.wm.append()` funziona
  correttamente** ed è il metodo scelto.
- **Chiamate `wm.append` separate per ogni oggetto duplicano le
  dipendenze condivise** (es. gli Empty parent vengono importati due
  volte, con suffisso `.001`). Sempre **una chiamata sola** con tutti gli
  oggetti nella lista `files`.
- **Una mesh con più material slot REALMENTE usati da poligoni diversi
  (verificato caso per caso, mai assunto) viene esportata in glTF come un
  nodo Group (che porta gli `extras`) con una Mesh figlia per slot (senza
  `extras` proprio).** Riscontrato su `Liver` (slot "Organ" + "Ligament",
  entrambi con poligoni assegnati). Gestito lato Three.js risalendo la
  gerarchia dei parent fino a trovare i metadata (vedi
  `RealOrganTestLoader.ts`), non lato Blender: forzare un solo slot
  perdendo l'informazione materiale non era desiderabile.
- **Non tutti gli slot materiale "in eccesso" sono realmente in uso**: su
  `Mucosa of stomach` esiste un secondo slot ereditato ("Intestine") ma
  zero poligoni lo usano — l'esportatore lo ottimizza correttamente in
  un'unica primitiva. Verificare sempre il conteggio poligoni per
  `material_index` prima di assumere che più slot = più primitive.
- **Draco non è disponibile** in questa installazione di Blender (pacchetto
  apt di Ubuntu, privo di `libextern_draco.so`). Una build ufficiale da
  blender.org lo include. Da riverificare quando si userà Blender
  installato normalmente.
