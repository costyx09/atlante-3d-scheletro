"""Esegue export_anatomy.py su più file di configurazione in un'unica
sessione Blender (più veloce di un processo Blender per organo).
Uso: blender --background --factory-startup --python run_batch_export.py -- \
    --source /path/Startup.blend config1.json config2.json ...
"""
import bpy, sys, os, json, importlib.util

qui = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("export_anatomy", os.path.join(qui, "export_anatomy.py"))
ea = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ea)

argv = sys.argv[sys.argv.index("--") + 1:]
source = argv[argv.index("--source") + 1]
config_paths = [a for a in argv if a.endswith(".json")]

risultati = []
for config_path in config_paths:
    print(f"\n\n########## {config_path} ##########")
    try:
        with open(config_path) as f:
            cfg = json.load(f)

        if cfg.get("note_approfondimento"):
            print("(Nota:", cfg["note_approfondimento"], ")")

        ea.pulisci_scena()
        ea.appendi_oggetti(source, cfg["oggetti"])
        oggetti = [bpy.data.objects[n] for n in cfg["oggetti"]]

        # Bake prima di isolare/rimuovere le dipendenze (vedi commento in
        # export_anatomy.py: bake_modifiers): oggetti come le curve del
        # tubo digerente perdono il profilo di bevel se il suo Object
        # viene rimosso prima della valutazione.
        for obj in oggetti:
            ea.bake_modifiers(obj)

        ea.isola_oggetti_target(cfg["oggetti"])

        mapping_colori = {k: tuple(v) for k, v in cfg.get("materiali", {}).items()}
        colore_default = tuple(cfg.get("materiale_default", [0.7, 0.4, 0.4]))
        for obj in oggetti:
            ea.sostituisci_materiali(obj, mapping_colori, colore_default)

        parti = cfg.get("parti", {})
        for obj in oggetti:
            ea.pulisci_e_tagga_custom_properties(obj, cfg["apparato_id"], cfg["organo_id"], parti.get(obj.name))

        ea.stampa_verifica_trasformazioni(oggetti)
        ea.esporta(cfg["output"], cfg.get("output_verifica_gltf"))

        tot_verts = sum(len(o.data.vertices) for o in oggetti)
        tot_faces = sum(len(o.data.polygons) for o in oggetti)
        risultati.append({
            "config": config_path, "organo_id": cfg["organo_id"], "ok": True,
            "oggetti": len(oggetti), "vertici": tot_verts, "facce": tot_faces,
            "dimensione_bytes": os.path.getsize(cfg["output"]),
        })
    except Exception as e:
        print("ERRORE:", e)
        risultati.append({"config": config_path, "ok": False, "errore": str(e)})

print("\n\n########## RIEPILOGO BATCH ##########")
for r in risultati:
    print(r)

with open("/home/claude/zanatomy/export/batch_report.json", "w") as f:
    json.dump(risultati, f, indent=2)
