import * as THREE from "three";
import type { BodyModel, BodyProvider, BodySegment } from "../core/AssetLoader";
import { trovaApparato } from "../data/apparati";

/**
 * Materiale "a guscio" semi-trasparente per la silhouette del corpo:
 * lascia sempre intravedere gli organi sottostanti, con un'estetica da
 * scanner clinico coerente con il resto dell'interfaccia. Non è
 * selezionabile: è solo un riferimento visivo di forma umana.
 */
function creaMaterialeGuscio(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: "#bfe3ff",
    transparent: true,
    opacity: 0.14,
    roughness: 0.35,
    metalness: 0,
    transmission: 0.15,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

/** Materiale di un organo, colorato secondo l'apparato di appartenenza. */
function creaMaterialeOrgano(colore: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: colore,
    roughness: 0.45,
    metalness: 0.05,
    emissive: new THREE.Color(colore),
    emissiveIntensity: 0.12,
  });
}

/** Specchia un oggetto lungo l'asse X e ne inverte la culling per restare corretto visivamente. */
function specchiaSuX<T extends THREE.Object3D>(oggetto: T, offsetX: number): T {
  const clone = oggetto.clone(true);
  clone.position.x = -offsetX;
  clone.scale.x *= -1;
  return clone;
}

export class PlaceholderBodyFactory implements BodyProvider {
  async load(): Promise<BodyModel> {
    const root = new THREE.Group();
    root.name = "corpo-umano-placeholder";

    const shell = this.buildShell();
    root.add(shell);

    const segments = this.buildOrgani(root);

    root.traverse((obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    return { root, segments };
  }

  /** Silhouette del corpo: testa, collo, torace, addome, arti. Non interattiva. */
  private buildShell(): THREE.Group {
    const shell = new THREE.Group();
    shell.name = "corpo-shell";
    const mat = creaMaterialeGuscio();

    const testa = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), mat);
    testa.position.set(0, 1.62, 0);
    shell.add(testa);

    const collo = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 20), mat);
    collo.position.set(0, 1.36, 0);
    shell.add(collo);

    const torace = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.55, 8, 20), mat);
    torace.position.set(0, 0.95, 0);
    shell.add(torace);

    const addome = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.32, 8, 20), mat);
    addome.position.set(0, 0.42, 0);
    shell.add(addome);

    const bacino = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.18, 8, 20), mat);
    bacino.position.set(0, 0.12, 0);
    shell.add(bacino);

    const braccioDx = this.buildArm(mat);
    braccioDx.position.set(0.5, 1.15, 0);
    shell.add(braccioDx);
    shell.add(specchiaSuX(braccioDx, 0.5));

    const gambaDx = this.buildLeg(mat);
    gambaDx.position.set(0.16, -0.12, 0);
    shell.add(gambaDx);
    shell.add(specchiaSuX(gambaDx, 0.16));

    return shell;
  }

  private buildArm(mat: THREE.Material): THREE.Group {
    const braccio = new THREE.Group();

    const superiore = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.32, 6, 16), mat);
    superiore.rotation.z = Math.PI * 0.06;
    superiore.position.set(0, -0.16, 0);
    braccio.add(superiore);

    const avambraccio = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.3, 6, 16), mat);
    avambraccio.rotation.z = Math.PI * 0.03;
    avambraccio.position.set(0.02, -0.5, 0);
    braccio.add(avambraccio);

    const mano = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), mat);
    mano.scale.set(0.8, 1.3, 0.6);
    mano.position.set(0.03, -0.72, 0);
    braccio.add(mano);

    return braccio;
  }

  private buildLeg(mat: THREE.Material): THREE.Group {
    const gamba = new THREE.Group();

    const coscia = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.4, 6, 16), mat);
    coscia.position.set(0, -0.3, 0);
    gamba.add(coscia);

    const polpaccio = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.38, 6, 16), mat);
    polpaccio.position.set(0, -0.72, 0);
    gamba.add(polpaccio);

    const piede = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.24), mat);
    piede.position.set(0, -0.96, 0.06);
    gamba.add(piede);

    return gamba;
  }

  /**
   * Organi placeholder. Ognuno viene taggato in `userData` con gli id
   * anatomici e aggiunto alla lista dei segmenti interattivi: è questo
   * l'unico contratto che il resto dell'app (selezione, isolamento,
   * navigazione) conosce.
   */
  private buildOrgani(root: THREE.Group): BodySegment[] {
    const segments: BodySegment[] = [];
    const colore = (apparatoId: string) => trovaApparato(apparatoId)?.colore ?? "#ffffff";

    const registra = (
      mesh: THREE.Object3D,
      meshId: string,
      apparatoId: string,
      organoId?: string,
    ) => {
      mesh.name = meshId;
      mesh.userData.apparatoId = apparatoId;
      mesh.userData.organoId = organoId;
      root.add(mesh);
      segments.push({ apparatoId, organoId, object: mesh });
    };

    // --- Apparato digerente (dati demo completi) ---
    const stomaco = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.09, 0.16, 8, 16),
      creaMaterialeOrgano(colore("digerente")),
    );
    stomaco.rotation.z = Math.PI * 0.35;
    stomaco.position.set(-0.12, 0.65, 0.12);
    registra(stomaco, "organo-stomaco", "digerente", "stomaco");

    const fegato = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 20),
      creaMaterialeOrgano(colore("digerente")),
    );
    fegato.scale.set(1.3, 0.7, 0.9);
    fegato.position.set(0.14, 0.75, 0.14);
    registra(fegato, "organo-fegato", "digerente", "fegato");

    const intestino = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.14, 0.045, 64, 12, 2, 3),
      creaMaterialeOrgano(colore("digerente")),
    );
    intestino.position.set(0, 0.38, 0.1);
    intestino.scale.setScalar(0.9);
    registra(intestino, "organo-intestino-tenue", "digerente", "intestino-tenue");

    // --- Apparato circolatorio (solo placeholder visivo, dati non ancora presenti) ---
    const cuore = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 20),
      creaMaterialeOrgano(colore("circolatorio")),
    );
    cuore.scale.set(1, 1.2, 0.9);
    cuore.position.set(0.06, 1.0, 0.13);
    registra(cuore, "organo-cuore", "circolatorio");

    // --- Apparato respiratorio (solo placeholder visivo) ---
    const polmoneCrea = () =>
      new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), creaMaterialeOrgano(colore("respiratorio")));

    const polmoneDx = polmoneCrea();
    polmoneDx.scale.set(0.65, 1.15, 0.55);
    polmoneDx.position.set(-0.19, 1.02, 0.03);
    registra(polmoneDx, "organo-polmone-destro", "respiratorio");

    const polmoneSx = polmoneCrea();
    polmoneSx.scale.set(0.65, 1.15, 0.55);
    polmoneSx.position.set(0.19, 1.02, 0.03);
    registra(polmoneSx, "organo-polmone-sinistro", "respiratorio");

    return segments;
  }
}
