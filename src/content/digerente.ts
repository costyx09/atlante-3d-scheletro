import type { Apparato } from "../data/schema";

/**
 * Contenuti dell'apparato digerente — primo apparato completato.
 *
 * Le "parti" elencate corrispondono SOLO a sotto-strutture con una mesh
 * realmente separata nel modello 3D (verificato organo per organo nella
 * pipeline Blender): quando un organo è rappresentato da un'unica mesh
 * (es. stomaco, fegato, pancreas) le sue sottodivisioni anatomiche
 * classiche restano contenuto testuale, senza un `meshId` associato.
 *
 * Fonti generiche usate per i dati essenziali (anatomia standard, non
 * controversa): OpenStax Anatomy & Physiology. Da integrare con fonti
 * specifiche del progetto scolastico prima della pubblicazione finale.
 */
const FONTE_STANDARD = { titolo: "Anatomy & Physiology", autore: "OpenStax", anno: 2013 };

export const apparatoDigerente: Apparato = {
  id: "digerente",
  nome: "Apparato digerente",
  colore: "#e8935a",
  stato: "disponibile",
  organi: [
    {
      id: "cavo-orale",
      nome: "Cavo orale",
      meshId: "organo-cavo-orale",
      descrizione:
        "Prima porzione dell'apparato digerente, delimitata da labbra, guance, palato e pavimento della bocca. Nel modello 3D è rappresentato dalla lingua, la struttura muscolare più rilevante al suo interno.",
      funzione:
        "Riceve il cibo, lo triturano i denti, la lingua lo mescola alla saliva avviando la digestione dell'amido e dà inizio alla deglutizione.",
      parti: [
        { id: "denti", nome: "Denti", descrizione: "Strutture dure ancorate alle arcate gengivali.", funzione: "Triturano meccanicamente il cibo (masticazione).", fonti: [FONTE_STANDARD] },
        { id: "palato", nome: "Palato", descrizione: "Parete superiore della cavità orale, separa bocca e cavità nasale.", funzione: "Permette di masticare e respirare contemporaneamente.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "ghiandole-salivari",
      nome: "Ghiandole salivari",
      meshId: "organo-ghiandole-salivari",
      descrizione:
        "Tre coppie di ghiandole (parotidi, sottomandibolari, sottolinguali) che riversano saliva nel cavo orale attraverso appositi dotti.",
      funzione:
        "Producono saliva, che inumidisce il cibo, contiene l'enzima amilasi (avvia la digestione dell'amido) e facilita la deglutizione.",
      parti: [
        { id: "parotide", nome: "Ghiandole parotidi", descrizione: "Le più voluminose, davanti alle orecchie.", funzione: "Producono saliva sierosa, ricca di amilasi.", fonti: [FONTE_STANDARD] },
        { id: "sottomandibolare", nome: "Ghiandole sottomandibolari", descrizione: "Sotto il corpo della mandibola.", funzione: "Producono la maggior parte della saliva a riposo.", fonti: [FONTE_STANDARD] },
        { id: "sottolinguale", nome: "Ghiandole sottolinguali", descrizione: "Sotto la lingua, le più piccole.", funzione: "Producono saliva ricca di muco.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "esofago",
      nome: "Esofago",
      meshId: "organo-esofago",
      descrizione:
        "Condotto muscolare lungo circa 25 cm che collega la faringe allo stomaco, passando dietro la trachea e attraverso il diaframma.",
      funzione:
        "Trasporta il bolo alimentare verso lo stomaco tramite contrazioni muscolari coordinate (peristalsi), senza intervenire nella digestione chimica.",
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "stomaco",
      nome: "Stomaco",
      meshId: "organo-stomaco",
      descrizione:
        "Organo cavo a forma di J, situato tra esofago e intestino tenue, nella parte superiore sinistra dell'addome.",
      funzione:
        "Riceve il bolo alimentare dall'esofago, lo mescola ai succhi gastrici trasformandolo in chimo e lo rilascia gradualmente nel duodeno.",
      curiosita: ["La mucosa gastrica si rinnova completamente ogni pochi giorni per resistere all'acidità dei succhi digestivi."],
      parti: [
        { id: "cardias", nome: "Cardias", descrizione: "Apertura superiore, punto di passaggio dall'esofago.", funzione: "Regola l'ingresso del bolo ed evita il reflusso.", fonti: [FONTE_STANDARD] },
        { id: "fondo", nome: "Fondo gastrico", descrizione: "Porzione superiore e arrotondata, sopra il cardias.", funzione: "Accumula temporaneamente aria e gas della digestione.", fonti: [FONTE_STANDARD] },
        { id: "corpo", nome: "Corpo", descrizione: "Parte centrale ed estesa dello stomaco.", funzione: "Sede principale di mescolamento del bolo col succo gastrico.", fonti: [FONTE_STANDARD] },
        { id: "piloro", nome: "Piloro", descrizione: "Tratto terminale, dotato di uno sfintere muscolare.", funzione: "Controlla il passaggio graduale del chimo al duodeno.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "fegato",
      nome: "Fegato",
      meshId: "organo-fegato",
      descrizione:
        "Ghiandola più voluminosa del corpo umano, nella parte superiore destra dell'addome, sotto il diaframma.",
      funzione:
        "Produce la bile (fondamentale per la digestione dei grassi), metabolizza i nutrienti assorbiti dall'intestino e filtra le sostanze tossiche dal sangue.",
      parti: [
        { id: "lobo-destro", nome: "Lobo destro", descrizione: "Il più grande dei due lobi principali.", funzione: "Stessa funzione metabolica del resto del fegato.", fonti: [FONTE_STANDARD] },
        { id: "lobo-sinistro", nome: "Lobo sinistro", descrizione: "Più piccolo, si estende verso lo stomaco.", funzione: "Stessa funzione metabolica del resto del fegato.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "cistifellea",
      nome: "Cistifellea",
      meshId: "organo-cistifellea",
      descrizione: "Piccolo sacco muscolare sotto il fegato, collegato al fegato e al duodeno da un sistema di dotti biliari.",
      funzione: "Immagazzina e concentra la bile prodotta dal fegato, rilasciandola nel duodeno durante la digestione dei grassi.",
      parti: [],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "pancreas",
      nome: "Pancreas",
      meshId: "organo-pancreas",
      descrizione: "Ghiandola allungata dietro lo stomaco, con funzione sia digestiva (esocrina) sia ormonale (endocrina).",
      funzione:
        "Produce succo pancreatico (enzimi digestivi per grassi, proteine e carboidrati) riversato nel duodeno, e ormoni come insulina e glucagone che regolano la glicemia.",
      curiosita: ["Le isole di Langerhans, che producono insulina, costituiscono solo circa l'1-2% del tessuto pancreatico."],
      parti: [
        { id: "testa", nome: "Testa", descrizione: "Porzione più larga, incastonata nell'ansa duodenale.", funzione: "Stessa funzione ghiandolare del resto dell'organo.", fonti: [FONTE_STANDARD] },
        { id: "corpo-pancreas", nome: "Corpo", descrizione: "Porzione centrale allungata.", funzione: "Stessa funzione ghiandolare del resto dell'organo.", fonti: [FONTE_STANDARD] },
        { id: "coda", nome: "Coda", descrizione: "Estremità sottile rivolta verso la milza.", funzione: "Stessa funzione ghiandolare del resto dell'organo.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "intestino-tenue",
      nome: "Intestino tenue",
      meshId: "organo-intestino-tenue",
      descrizione:
        "Tratto lungo diversi metri tra stomaco e intestino crasso, suddiviso in duodeno, digiuno e ileo. Nel modello 3D sono presenti come mesh reali duodeno e digiuno.",
      funzione:
        "Sede principale della digestione chimica e dell'assorbimento dei nutrienti, grazie alla superficie interna ripiegata in villi e microvilli.",
      parti: [
        { id: "duodeno", nome: "Duodeno", descrizione: "Primo tratto, riceve bile e succo pancreatico.", funzione: "Completa la digestione chimica di grassi, proteine e carboidrati.", fonti: [FONTE_STANDARD] },
        { id: "digiuno", nome: "Digiuno", descrizione: "Tratto intermedio, ricco di villi intestinali.", funzione: "Assorbimento della maggior parte dei nutrienti.", fonti: [FONTE_STANDARD] },
        { id: "ileo", nome: "Ileo", descrizione: "Tratto finale, non presente come mesh separata nel modello 3D (geometricamente accorpato al digiuno in questa versione).", funzione: "Assorbimento di vitamina B12, sali biliari e nutrienti residui.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
    {
      id: "intestino-crasso",
      nome: "Intestino crasso",
      meshId: "organo-intestino-crasso",
      descrizione:
        "Tratto finale dell'apparato digerente, circa 1,5 m, che incornicia l'intestino tenue. Comprende colon ascendente, trasverso, discendente, sigmoideo e l'appendice vermiforme.",
      funzione:
        "Assorbe acqua e sali minerali residui, ospita il microbiota intestinale e forma le feci prima dell'evacuazione.",
      curiosita: ["Il microbiota del colon contiene trilioni di batteri utili alla digestione e al sistema immunitario."],
      parti: [
        { id: "colon-ascendente", nome: "Colon ascendente", descrizione: "Risale lungo il lato destro dell'addome.", funzione: "Assorbimento di acqua e sali minerali.", fonti: [FONTE_STANDARD] },
        { id: "colon-trasverso", nome: "Colon trasverso", descrizione: "Attraversa l'addome orizzontalmente.", funzione: "Assorbimento di acqua e sali minerali.", fonti: [FONTE_STANDARD] },
        { id: "colon-discendente", nome: "Colon discendente", descrizione: "Scende lungo il lato sinistro dell'addome.", funzione: "Compattazione delle feci.", fonti: [FONTE_STANDARD] },
        { id: "colon-sigmoideo", nome: "Colon sigmoideo", descrizione: "Tratto a S che precede il retto.", funzione: "Deposito temporaneo delle feci.", fonti: [FONTE_STANDARD] },
        { id: "appendice", nome: "Appendice vermiforme", descrizione: "Piccola struttura a fondo cieco vicino al cieco.", funzione: "Ruolo non completamente chiarito; contiene tessuto linfatico.", fonti: [FONTE_STANDARD] },
      ],
      fonti: [FONTE_STANDARD],
    },
  ],
  fonti: [FONTE_STANDARD],
};
