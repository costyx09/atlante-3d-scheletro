/**
 * Un "percorso guidato" è la struttura dati comune a due funzionalità
 * previste dall'architettura (modalità Lezione e animazioni didattiche):
 * una sequenza ordinata di tappe, ciascuna associata a un organo (per
 * isolamento/zoom automatico) e a un breve testo narrativo.
 *
 * Per ora esiste un solo percorso dimostrativo ("Il percorso del cibo").
 * Aggiungerne altri in futuro (es. "Il percorso dell'aria" per il
 * respiratorio) significa aggiungere un'altra voce a `PERCORSI_GUIDATI`,
 * senza toccare il componente che li esegue (`GuidedTour`).
 */
export interface TappaPercorso {
  apparatoId: string;
  organoId: string;
  titolo: string;
  testo: string;
}

export interface PercorsoGuidato {
  id: string;
  titolo: string;
  descrizione: string;
  tappe: TappaPercorso[];
}

export const PERCORSO_DEL_CIBO: PercorsoGuidato = {
  id: "percorso-del-cibo",
  titolo: "Il percorso del cibo",
  descrizione: "Segui il cibo lungo l'apparato digerente, dalla bocca all'intestino crasso.",
  tappe: [
    {
      apparatoId: "digerente",
      organoId: "cavo-orale",
      titolo: "1. Cavo orale",
      testo: "Il viaggio comincia in bocca: i denti triturano il cibo, la lingua lo mescola alla saliva formando il bolo alimentare.",
    },
    {
      apparatoId: "digerente",
      organoId: "esofago",
      titolo: "2. Esofago",
      testo: "Il bolo viene spinto verso lo stomaco da onde di contrazione muscolare (peristalsi), senza l'aiuto della gravità.",
    },
    {
      apparatoId: "digerente",
      organoId: "stomaco",
      titolo: "3. Stomaco",
      testo: "Nello stomaco il bolo si mescola ai succhi gastrici, ricchi di acido cloridrico e pepsina, diventando chimo.",
    },
    {
      apparatoId: "digerente",
      organoId: "intestino-tenue",
      titolo: "4. Intestino tenue",
      testo: "Qui avviene la maggior parte della digestione chimica e dell'assorbimento dei nutrienti, grazie a bile e succo pancreatico.",
    },
    {
      apparatoId: "digerente",
      organoId: "intestino-crasso",
      titolo: "5. Intestino crasso",
      testo: "L'ultimo tratto assorbe acqua e sali minerali residui e forma le feci, con l'aiuto del microbiota intestinale.",
    },
  ],
};

export const PERCORSI_GUIDATI: PercorsoGuidato[] = [PERCORSO_DEL_CIBO];
