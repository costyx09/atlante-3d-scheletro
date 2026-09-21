import type { Apparato } from "../data/schema";

const FONTE_STANDARD = { titolo: "Anatomy & Physiology", autore: "OpenStax", anno: 2013 };

export const apparatoEndocrino: Apparato = {
  id: "endocrino",
  nome: "Apparato endocrino",
  colore: "#b08ae6",
  stato: "disponibile",
  organi: [
    {
      id: "tiroide",
      nome: "Tiroide",
      meshId: "organo-tiroide",
      descrizione: "Ghiandola a forma di farfalla, situata nella parte anteriore del collo, davanti alla trachea.",
      funzione: "Produce ormoni tiroidei che regolano il metabolismo, la temperatura corporea e la crescita.",
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "surreni",
      nome: "Ghiandole surrenali",
      meshId: "organo-surreni",
      descrizione: "Due piccole ghiandole poste sopra ciascun rene.",
      funzione: "Producono ormoni come adrenalina e cortisolo, coinvolti nella risposta allo stress e nella regolazione del metabolismo.",
      parti: [
        { id: "surrene-sinistro", nome: "Surrene sinistro", descrizione: "Sopra il rene sinistro.", funzione: "Produzione di adrenalina, cortisolo e aldosterone.", fonti: [FONTE_STANDARD] },
        { id: "surrene-destro", nome: "Surrene destro", descrizione: "Sopra il rene destro.", funzione: "Produzione di adrenalina, cortisolo e aldosterone.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
  ],
  fonti: [FONTE_STANDARD],
};
