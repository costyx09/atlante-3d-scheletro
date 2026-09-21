import type { Apparato } from "../data/schema";

const FONTE_STANDARD = { titolo: "Anatomy & Physiology", autore: "OpenStax", anno: 2013 };

export const apparatoRespiratorio: Apparato = {
  id: "respiratorio",
  nome: "Apparato respiratorio",
  colore: "#5aa9e6",
  stato: "disponibile",
  organi: [
    {
      id: "trachea",
      nome: "Trachea",
      meshId: "organo-trachea",
      descrizione:
        "Condotto rigido, sostenuto da anelli cartilaginei a forma di C, che collega la laringe ai due bronchi principali.",
      funzione: "Conduce l'aria verso i polmoni mantenendo il condotto sempre aperto grazie alla cartilagine.",
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "bronchi",
      nome: "Bronchi",
      meshId: "organo-bronchi",
      descrizione:
        "Ramificazioni della trachea che si suddividono progressivamente (bronchi principali, poi lobari) fino a raggiungere ciascun lobo polmonare.",
      funzione: "Distribuiscono l'aria dalla trachea verso i singoli lobi polmonari, ramificandosi come i rami di un albero.",
      curiosita: ["Il bronco principale destro è più corto e verticale del sinistro: per questo un corpo estraneo inalato finisce più spesso nel polmone destro."],
      parti: [
        { id: "bronco-principale-sinistro", nome: "Bronco principale sinistro", descrizione: "Primo ramo verso il polmone sinistro.", funzione: "Conduce aria al polmone sinistro.", fonti: [FONTE_STANDARD] },
        { id: "bronco-principale-destro", nome: "Bronco principale destro", descrizione: "Primo ramo verso il polmone destro, più corto e verticale.", funzione: "Conduce aria al polmone destro.", fonti: [FONTE_STANDARD] },
        { id: "bronco-lobare-superiore-sinistro", nome: "Bronco lobare superiore sinistro", descrizione: "Ramo verso il lobo superiore sinistro.", funzione: "Distribuzione dell'aria al lobo corrispondente.", fonti: [FONTE_STANDARD] },
        { id: "bronco-lobare-inferiore-sinistro", nome: "Bronco lobare inferiore sinistro", descrizione: "Ramo verso il lobo inferiore sinistro.", funzione: "Distribuzione dell'aria al lobo corrispondente.", fonti: [FONTE_STANDARD] },
        { id: "bronco-lobare-superiore-destro", nome: "Bronco lobare superiore destro", descrizione: "Ramo verso il lobo superiore destro.", funzione: "Distribuzione dell'aria al lobo corrispondente.", fonti: [FONTE_STANDARD] },
        { id: "bronco-lobare-medio-destro", nome: "Bronco lobare medio destro", descrizione: "Ramo verso il lobo medio destro.", funzione: "Distribuzione dell'aria al lobo corrispondente.", fonti: [FONTE_STANDARD] },
        { id: "bronco-lobare-inferiore-destro", nome: "Bronco lobare inferiore destro", descrizione: "Ramo verso il lobo inferiore destro.", funzione: "Distribuzione dell'aria al lobo corrispondente.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "polmoni",
      nome: "Polmoni",
      meshId: "organo-polmoni",
      descrizione:
        "Organi spugnosi contenuti nella gabbia toracica: il destro ha 3 lobi, il sinistro 2 (per lasciare spazio al cuore).",
      funzione: "Sede degli scambi gassosi tra aria e sangue, attraverso milioni di alveoli polmonari.",
      curiosita: ["La superficie totale degli alveoli polmonari di un adulto è paragonabile a quella di un campo da tennis."],
      parti: [
        { id: "lobo-superiore-sinistro", nome: "Lobo superiore sinistro", descrizione: "Parte alta del polmone sinistro.", funzione: "Scambi gassosi.", fonti: [FONTE_STANDARD] },
        { id: "lobo-inferiore-sinistro", nome: "Lobo inferiore sinistro", descrizione: "Parte bassa del polmone sinistro.", funzione: "Scambi gassosi.", fonti: [FONTE_STANDARD] },
        { id: "lobo-superiore-destro", nome: "Lobo superiore destro", descrizione: "Parte alta del polmone destro.", funzione: "Scambi gassosi.", fonti: [FONTE_STANDARD] },
        { id: "lobo-medio-destro", nome: "Lobo medio destro", descrizione: "Piccolo lobo intermedio, presente solo a destra.", funzione: "Scambi gassosi.", fonti: [FONTE_STANDARD] },
        { id: "lobo-inferiore-destro", nome: "Lobo inferiore destro", descrizione: "Parte bassa del polmone destro.", funzione: "Scambi gassosi.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
  ],
  fonti: [FONTE_STANDARD],
};
