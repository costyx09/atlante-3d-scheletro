import type { Apparato } from "../data/schema";

const FONTE_STANDARD = { titolo: "Anatomy & Physiology", autore: "OpenStax", anno: 2013 };

export const apparatoCircolatorio: Apparato = {
  id: "circolatorio",
  nome: "Apparato cardiovascolare",
  colore: "#e05a5a",
  stato: "disponibile",
  organi: [
    {
      id: "cuore",
      nome: "Cuore",
      meshId: "organo-cuore",
      descrizione:
        "Organo muscolare cavo, grande circa come un pugno, situato nel torace tra i due polmoni. Diviso in quattro camere: due atri e due ventricoli.",
      funzione:
        "Pompa il sangue in tutto il corpo: la parte destra lo invia ai polmoni per ossigenarlo, la sinistra lo distribuisce a organi e tessuti.",
      curiosita: ["Il cuore batte in media più di 100.000 volte al giorno, pompando circa 7.500 litri di sangue."],
      parti: [
        { id: "atrio-destro", nome: "Atrio destro", descrizione: "Riceve il sangue povero di ossigeno dal corpo.", funzione: "Convoglia il sangue al ventricolo destro.", fonti: [FONTE_STANDARD] },
        { id: "ventricolo-destro", nome: "Ventricolo destro", descrizione: "Camera inferiore destra.", funzione: "Pompa il sangue verso i polmoni.", fonti: [FONTE_STANDARD] },
        { id: "atrio-sinistro", nome: "Atrio sinistro", descrizione: "Riceve il sangue ossigenato dai polmoni.", funzione: "Convoglia il sangue al ventricolo sinistro.", fonti: [FONTE_STANDARD] },
        { id: "ventricolo-sinistro", nome: "Ventricolo sinistro", descrizione: "Camera inferiore sinistra, dalle pareti più spesse.", funzione: "Pompa il sangue ossigenato in tutto il corpo.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "grandi-vasi",
      nome: "Grandi vasi",
      meshId: "organo-grandi-vasi",
      descrizione:
        "I principali tronchi arteriosi e venosi collegati direttamente al cuore: qui rappresentati aorta e vena cava inferiore.",
      funzione:
        "L'aorta distribuisce il sangue ossigenato dal cuore a tutto il corpo; la vena cava inferiore riporta al cuore il sangue proveniente dalla parte inferiore del corpo.",
      parti: [
        { id: "aorta-ascendente", nome: "Aorta ascendente", descrizione: "Primo tratto, esce dal ventricolo sinistro.", funzione: "Distribuisce sangue ossigenato alle arterie coronarie e all'arco aortico.", fonti: [FONTE_STANDARD] },
        { id: "aorta-addominale", nome: "Aorta addominale", descrizione: "Prosegue nell'addome fino a dividersi nelle arterie iliache.", funzione: "Irrora gli organi addominali e gli arti inferiori.", fonti: [FONTE_STANDARD] },
        { id: "vena-cava-toracica", nome: "Vena cava inferiore (tratto toracico)", descrizione: "Attraversa il diaframma per raggiungere il cuore.", funzione: "Riporta sangue venoso all'atrio destro.", fonti: [FONTE_STANDARD] },
        { id: "vena-cava-addominale", nome: "Vena cava inferiore (tratto addominale)", descrizione: "Raccoglie il sangue venoso dagli organi addominali e dagli arti inferiori.", funzione: "Convoglia il sangue verso il cuore.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
  ],
  fonti: [FONTE_STANDARD],
};
