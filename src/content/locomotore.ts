import type { Apparato } from "../data/schema";

const FONTE_STANDARD = { titolo: "Anatomy & Physiology", autore: "OpenStax", anno: 2013 };

/**
 * Le 88 ossa importate sono tutte taggate con un `parte_id` individuale nel
 * modello 3D (vedi blender-pipeline/configs/), pronte per una futura
 * navigazione a livello di singola parte. Per ora l'InfoPanel mostra solo
 * contenuto a livello di organo/regione, per non sovraccaricare lo
 * schermo con 88 voci di testo (la UI a 3 livelli Corpo→Apparato→Organo
 * non ha ancora un quarto livello "Parte" navigabile).
 */
export const apparatoLocomotore: Apparato = {
  id: "locomotore",
  nome: "Apparato locomotore",
  colore: "#8a8f98",
  stato: "disponibile",
  organi: [
    {
      id: "cranio",
      nome: "Cranio",
      meshId: "organo-cranio",
      descrizione:
        "Struttura ossea che racchiude e protegge l'encefalo, formata da più ossa unite da suture. Include anche le ossa della faccia (mascella, mandibola, zigomi, nasali).",
      funzione: "Protegge l'encefalo e gli organi di senso, sostiene i denti e la muscolatura facciale e masticatoria.",
      curiosita: ["Alla nascita il cranio ha spazi membranosi (fontanelle) che si ossificano completamente solo nei primi anni di vita."],
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "colonna-vertebrale",
      nome: "Colonna vertebrale",
      meshId: "organo-colonna-vertebrale",
      descrizione:
        "Sequenza di 26 ossa (7 vertebre cervicali, 12 toraciche, 5 lombari, sacro e coccige) che sostiene il tronco e protegge il midollo spinale.",
      funzione: "Sostiene il peso del corpo, permette il movimento del tronco e protegge il midollo spinale al suo interno.",
      curiosita: ["Le prime due vertebre cervicali, atlante ed epistrofeo, hanno una forma particolare che permette i movimenti di rotazione della testa."],
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "gabbia-toracica",
      nome: "Gabbia toracica",
      meshId: "organo-gabbia-toracica",
      descrizione: "Formata da 12 paia di costole, lo sterno (manubrio, corpo, processo xifoideo) e le vertebre toraciche.",
      funzione: "Protegge cuore e polmoni, e con i muscoli intercostali partecipa ai movimenti respiratori.",
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "bacino",
      nome: "Bacino",
      meshId: "organo-bacino",
      descrizione: "Formato dalle due ossa dell'anca (ciascuna fusione di ileo, ischio e pube) e dal sacro.",
      funzione: "Sostiene il peso della parte superiore del corpo, protegge gli organi pelvici e collega la colonna vertebrale agli arti inferiori.",
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "arti-scheletrici",
      nome: "Ossa degli arti",
      meshId: "organo-arti-scheletrici",
      descrizione:
        "Le ossa lunghe e le cinture di arti superiori (clavicola, scapola, omero, radio, ulna) e inferiori (femore, tibia, perone, rotula).",
      funzione: "Formano le leve su cui agiscono i muscoli per consentire il movimento; le ossa lunghe producono anche cellule del sangue nel midollo osseo.",
      curiosita: ["Il femore è l'osso più lungo e robusto del corpo umano."],
      parti: [],
      fonti: [FONTE_STANDARD],
    },
  ],
  fonti: [FONTE_STANDARD],
};
