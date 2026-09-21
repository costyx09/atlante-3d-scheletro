export interface DomandaQuiz {
  domanda: string;
  risposte: string[];
  corretta: number;
  spiegazione: string;
}

/**
 * Quiz dimostrativo, dati locali (nessuna generazione via API/LLM a
 * runtime, come richiesto). Aggiungerne altri in futuro: un altro array
 * qui + una voce nel selettore di `QuizPanel`.
 */
export const QUIZ_DIGERENTE: DomandaQuiz[] = [
  {
    domanda: "Quale organo produce la bile?",
    risposte: ["Il pancreas", "Il fegato", "La cistifellea", "Lo stomaco"],
    corretta: 1,
    spiegazione: "Il fegato produce la bile; la cistifellea la immagazzina e la concentra soltanto.",
  },
  {
    domanda: "In quale organo avviene la maggior parte dell'assorbimento dei nutrienti?",
    risposte: ["Stomaco", "Intestino crasso", "Intestino tenue", "Esofago"],
    corretta: 2,
    spiegazione: "L'intestino tenue, grazie a villi e microvilli, ha la superficie interna più adatta all'assorbimento.",
  },
  {
    domanda: "Qual è la funzione principale dell'intestino crasso?",
    risposte: [
      "Digestione chimica delle proteine",
      "Assorbimento di acqua e sali minerali",
      "Produzione di insulina",
      "Produzione di succhi gastrici",
    ],
    corretta: 1,
    spiegazione: "L'intestino crasso assorbe acqua e sali minerali residui, formando le feci.",
  },
  {
    domanda: "Come si chiama il tratto terminale dello stomaco, che regola il passaggio verso il duodeno?",
    risposte: ["Cardias", "Fondo", "Piloro", "Corpo"],
    corretta: 2,
    spiegazione: "Il piloro è dotato di uno sfintere muscolare che controlla il rilascio graduale del chimo.",
  },
  {
    domanda: "Il pancreas ha una doppia funzione: quale?",
    risposte: [
      "Digestiva ed endocrina (ormonale)",
      "Respiratoria e digestiva",
      "Solo digestiva",
      "Solo di filtraggio del sangue",
    ],
    corretta: 0,
    spiegazione: "Il pancreas produce succo pancreatico (digestivo) e ormoni come insulina e glucagone (endocrino).",
  },
];
