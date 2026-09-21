import type { Apparato } from "../data/schema";

const FONTE_STANDARD = { titolo: "Anatomy & Physiology", autore: "OpenStax", anno: 2013 };

export const apparatoUrinario: Apparato = {
  id: "urinario",
  nome: "Apparato urinario",
  colore: "#e6c15a",
  stato: "disponibile",
  organi: [
    {
      id: "reni",
      nome: "Reni",
      meshId: "organo-reni",
      descrizione:
        "Due organi a forma di fagiolo, situati nella parte posteriore dell'addome, ai lati della colonna vertebrale.",
      funzione:
        "Filtrano il sangue, eliminando scorie e regolando acqua, sali minerali e pressione sanguigna attraverso la produzione di urina.",
      curiosita: ["Ogni rene contiene circa un milione di nefroni, le unità filtranti microscopiche."],
      parti: [
        { id: "rene-sinistro", nome: "Rene sinistro", descrizione: "Leggermente più in alto del destro.", funzione: "Filtrazione del sangue e produzione di urina.", fonti: [FONTE_STANDARD] },
        { id: "rene-destro", nome: "Rene destro", descrizione: "Leggermente più in basso per la presenza del fegato.", funzione: "Filtrazione del sangue e produzione di urina.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "vie-urinarie",
      nome: "Vie urinarie",
      meshId: "organo-vie-urinarie",
      descrizione:
        "Il sistema di condotti che raccoglie l'urina dai reni e la conduce all'esterno: ureteri, vescica e uretra.",
      funzione: "Trasportano, immagazzinano ed espellono l'urina prodotta dai reni.",
      parti: [
        { id: "uretere-sinistro", nome: "Uretere sinistro", descrizione: "Condotto che collega il rene sinistro alla vescica.", funzione: "Trasporto dell'urina tramite peristalsi.", fonti: [FONTE_STANDARD] },
        { id: "uretere-destro", nome: "Uretere destro", descrizione: "Condotto che collega il rene destro alla vescica.", funzione: "Trasporto dell'urina tramite peristalsi.", fonti: [FONTE_STANDARD] },
        { id: "vescica", nome: "Vescica urinaria", descrizione: "Organo cavo ed elastico nella pelvi.", funzione: "Immagazzina l'urina fino alla minzione.", fonti: [FONTE_STANDARD] },
        { id: "uretra", nome: "Uretra", descrizione: "Condotto terminale che porta l'urina all'esterno.", funzione: "Espulsione dell'urina durante la minzione.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
  ],
  fonti: [FONTE_STANDARD],
};
