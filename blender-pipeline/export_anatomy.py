"""
export_anatomy.py — Pipeline riutilizzabile Z-Anatomy -> GLB

Uso:
    blender --background --factory-startup --python export_anatomy.py -- \
        --source /percorso/Startup.blend \
        --config configs/fegato.json

Il file di configurazione JSON descrive UN organo (vedi configs/stomaco.json
e configs/fegato.json come esempio). Lo script non modifica mai il file
sorgente: lo apre solo in lettura tramite append di libreria, lavora su una
scena temporanea in memoria e scrive esclusivamente il file di output
indicato in configurazione.

Schema del file di configurazione:
{
  "apparato_id": "digerente",
  "organo_id": "fegato",
  "oggetti": ["Liver"],                 // Object da appendere ed esportare
  "parti": {                            // opzionale: Object -> parte_id,
                                         // SOLO per Object che sono già mesh
                                         // reali (non creare mai una "parte"
                                         // per un nome che esiste solo come
                                         // etichetta .j/.t)
  },
  "materiali": {                        // opzionale: nome slot originale -> [r,g,b] (0-1)
    "Organ": [0.45, 0.18, 0.12],
    "Ligament": [0.85, 0.83, 0.78]
  },
  "materiale_default": [0.7, 0.4, 0.4], // usato per slot non elencati in "materiali"
  "output": "public/models/fegato-test.glb",
  "output_verifica_gltf": "export/fegato-test-verifica.gltf",
  "note_approfondimento": [             // solo documentazione, MAI importati/esportati
    "Posterior segment of liver (I)", "..."
  ]
}
"""

import bpy
import sys
import os
import json
import mathutils
import argparse


def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []
    p = argparse.ArgumentParser()
    p.add_argument("--source", required=True, help="Percorso di Startup.blend (sola lettura)")
    p.add_argument("--config", required=True, help="Percorso del file di configurazione JSON")
    return p.parse_args(argv)


def pulisci_scena():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)


def appendi_oggetti(source_path, nomi):
    """Un'unica chiamata batch: evita la duplicazione delle dipendenze
    condivise osservata con chiamate separate (vedi README)."""
    bpy.ops.wm.append(
        directory=os.path.join(source_path, "Object"),
        files=[{"name": n} for n in nomi],
    )


def isola_oggetti_target(nomi_target):
    """Rimuove dalla scena tutto ciò che l'append ha portato con sé come
    dipendenza (Empty di gerarchia, piani di cross-section, ecc.) e che non
    fa parte esplicitamente della configurazione."""
    scene = bpy.context.scene
    target_objs = [bpy.data.objects[n] for n in nomi_target]

    bpy.ops.object.select_all(action='DESELECT')
    for o in target_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = target_objs[0]
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')

    da_rimuovere = [o for o in scene.objects if o.name not in nomi_target]
    print("Rimuovo dipendenze non necessarie:", [o.name for o in da_rimuovere])
    for o in da_rimuovere:
        bpy.data.objects.remove(o, do_unlink=True)


def bake_modifiers(obj):
    """Converte l'oggetto (Mesh o Curve, con eventuali modifier/Geometry
    Nodes) nella sua geometria valutata, come mesh statica.

    Non assume che l'oggetto sorgente sia già una Mesh: un tratto del tubo
    digerente (es. esofago, digiuno) in Z-Anatomy è un oggetto CURVE con
    profilo di bevel (`curve.bevel_object`, un Object separato). Per le
    Curve, `object.data = mesh` non è permesso da Blender ("Object.data
    expected a Curve type, not Mesh"): serve l'operatore
    `object.convert(target='MESH')`, che cambia anche `obj.type`.

    IMPORTANTE: va chiamata PRIMA di rimuovere dalla scena eventuali
    oggetti "dipendenza" (vedi `isola_oggetti_target`), perché il bevel
    profile è a sua volta un Object: se lo si cancella prima del bake, la
    curva perde la sua sezione e valuta a geometria degenere.
    """
    if obj.type != 'MESH':
        tipo_originale = obj.type
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.convert(target='MESH')
        print(f"  bake {obj.name}: oggetto {tipo_originale} convertito in MESH -> "
              f"{len(obj.data.vertices)}v/{len(obj.data.polygons)}f (valutati)")
        return

    deps = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(deps)
    baked = bpy.data.meshes.new_from_object(ev)
    n_verts_pre, n_faces_pre = len(obj.data.vertices), len(obj.data.polygons)
    obj.modifiers.clear()
    obj.data = baked
    print(f"  bake {obj.name}: {n_verts_pre}v/{n_faces_pre}f (base) -> "
          f"{len(baked.vertices)}v/{len(baked.polygons)}f (valutati)")


def sostituisci_materiali(obj, mapping_colori, colore_default):
    """Sostituisce OGNI slot materiale esistente con un PBR semplice,
    preservando il NUMERO di slot (e quindi l'assegnazione per-poligono
    già presente sulla mesh) — importante per mesh multi-materiale come
    Liver (slot 'Organ' + 'Ligament')."""
    nomi_slot_originali = [s.material.name if s.material else f"slot{i}"
                            for i, s in enumerate(obj.material_slots)]
    nuovi_materiali = []
    for nome_slot in nomi_slot_originali:
        rgb = mapping_colori.get(nome_slot, colore_default)
        m = bpy.data.materials.new(f"{nome_slot} (PBR)")
        m.use_nodes = True
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
        bsdf.inputs["Roughness"].default_value = 0.55
        nuovi_materiali.append(m)

    for i, m in enumerate(nuovi_materiali):
        obj.data.materials[i] = m

    print(f"  materiali {obj.name}: {nomi_slot_originali} -> "
          f"{[m.name for m in nuovi_materiali]} ({len(nuovi_materiali)} slot mantenuti)")


def pulisci_e_tagga_custom_properties(obj, apparato_id, organo_id, parte_id=None):
    originali = list(obj.keys())
    for k in originali:
        del obj[k]
    obj["apparato_id"] = apparato_id
    obj["organo_id"] = organo_id
    if parte_id:
        obj["parte_id"] = parte_id
    print(f"  custom properties {obj.name}: rimosse {originali} -> "
          f"impostate {dict(obj.items())}")


def stampa_verifica_trasformazioni(oggetti):
    bbox_min = mathutils.Vector((1e9,) * 3)
    bbox_max = mathutils.Vector((-1e9,) * 3)
    for obj in oggetti:
        print(f"  {obj.name}: loc={tuple(round(c,4) for c in obj.location)} "
              f"scale={tuple(round(c,4) for c in obj.scale)} "
              f"rot={tuple(round(c,4) for c in obj.rotation_euler)} "
              f"slot_materiali={len(obj.material_slots)}")
        for corner in obj.bound_box:
            world = obj.matrix_world @ mathutils.Vector(corner)
            bbox_min = mathutils.Vector(map(min, bbox_min, world))
            bbox_max = mathutils.Vector(map(max, bbox_max, world))
    size = bbox_max - bbox_min
    print(f"  Bounding box mondo: min={tuple(round(c,4) for c in bbox_min)} "
          f"max={tuple(round(c,4) for c in bbox_max)} size={tuple(round(c,4) for c in size)}")


def esporta(output_glb, output_gltf_verifica):
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_glb, export_format='GLB', use_selection=False,
        export_yup=True, export_extras=True, export_materials='EXPORT',
        export_draco_mesh_compression_enable=False,
    )
    print("GLB scritto:", output_glb, os.path.getsize(output_glb), "bytes")

    if output_gltf_verifica:
        os.makedirs(os.path.dirname(output_gltf_verifica), exist_ok=True)
        bpy.ops.export_scene.gltf(
            filepath=output_gltf_verifica, export_format='GLTF_SEPARATE', use_selection=False,
            export_yup=True, export_extras=True, export_materials='EXPORT',
            export_draco_mesh_compression_enable=False,
        )
        print("glTF di verifica scritto:", output_gltf_verifica)


def main():
    args = parse_args()
    with open(args.config, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    print(f"=== Export {cfg['apparato_id']}/{cfg['organo_id']} da {args.source} ===")
    if cfg.get("note_approfondimento"):
        print("(Nota: escluse volutamente dalla scena queste strutture di approfondimento:",
              cfg["note_approfondimento"], ")")

    pulisci_scena()
    appendi_oggetti(args.source, cfg["oggetti"])

    oggetti = [bpy.data.objects[n] for n in cfg["oggetti"]]

    # IMPORTANTE: bake PRIMA di isolare/rimuovere le dipendenze. Alcuni
    # oggetti (curve con bevel_object, modifier Boolean con target esterno,
    # ecc.) hanno bisogno che le loro dipendenze siano ancora nella scena
    # al momento della valutazione, altrimenti il bake produce geometria
    # degenere invece di fallire rumorosamente. Vedi bake_modifiers().
    print("\n--- Bake modifier ---")
    for obj in oggetti:
        bake_modifiers(obj)

    isola_oggetti_target(cfg["oggetti"])

    print("\n--- Materiali ---")
    mapping_colori = {k: tuple(v) for k, v in cfg.get("materiali", {}).items()}
    colore_default = tuple(cfg.get("materiale_default", [0.7, 0.4, 0.4]))
    for obj in oggetti:
        sostituisci_materiali(obj, mapping_colori, colore_default)

    print("\n--- Custom properties ---")
    parti = cfg.get("parti", {})
    for obj in oggetti:
        pulisci_e_tagga_custom_properties(
            obj, cfg["apparato_id"], cfg["organo_id"], parti.get(obj.name),
        )

    print("\n--- Verifica trasformazioni/bbox ---")
    stampa_verifica_trasformazioni(oggetti)

    print("\n--- Export ---")
    esporta(cfg["output"], cfg.get("output_verifica_gltf"))


if __name__ == "__main__":
    main()
