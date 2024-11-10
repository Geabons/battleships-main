import { MIN_HEIGHT } from "../game.mjs";
import { MIN_WIDTH } from "../game.mjs";

const language = {
  en: {
    TERMINAL_SIZE: (width, height) =>
      `Terminal is too small! Please resize to at least ${MIN_WIDTH}x${MIN_HEIGHT} characters.\n`,
    WAITING_FOR_RESIZE: "Waiting for adequate terminal size...\n",
    CHANGE_LANGUAGE: "Swap language",
    LANGUAGE_CHANGED: "Language Changed",
    START_GAME: "Start Game",
    EXIT_GAME: "Exit Game",
    PLACE_BATTLESHIP_P1: `SHIP PLACEMENT\nFirst player get ready.\nPlayer two look away`,
    PLACE_BATTLESHIP_P2: `SHIP PLACEMENT\nSecond player get ready.\nPlayer one look away`,
    MAP: "Map layout",
    NEXT_STATE: "Next state",
    SHIP_PLACEMENT: "SHIP PLACEMENT PHASE\n\n",
    CONTROLS: "Controls:",
    ARROW_KEYS: "Arrow keys: Move cursor\n",
    ROTATE: "R: Rotate ship\n",
    PLACE_SHIP: "Enter: Place ship\n",
    SHIP_TO_PLACE: "ships to place:",
    SPACE: "Spaces",
    IN_BETWEEN: "Transitioning away from in between screen",
    BATTLESHIP: "There should be a battleship game here",
  },
  no: {
    TERMINAL_SIZE: (width, height) =>
      `Terminalen er for liten! vær så snill å endre den til minst ${MIN_WIDTH}x${MIN_HEIGHT} karakterer.\n`,
    WAITING_FOR_RESIZE: "Venter på riktig størrelse for Terminal...",
    CHANGE_LANGUAGE: "Endre språk",
    LANGUAGE_CHANGED: "Språk endret",
    START_GAME: "Start spill",
    EXIT_GAME: "Avslutt Spill",
    PLACE_BATTLESHIP_P1: `SKIP PLASSERING\nFørste spiller vær klar.\nSpiller to se bort`,
    PLACE_BATTLESHIP_P2: `SKIP PLASSERING\nAndre spiller vær klar.\nSpiller en se bort`,
    MAP: "Kartoppsett",
    NEXT_STATE: "Neste stadiet",
    SHIP_PLACEMENT: "SKIP PLASSERINGS FASE\n\n",
    CONTROLS: "Kontrollere:",
    ARROW_KEYS: "Pil knappene: Flytt peker\n",
    ROTATE: "R: Roter skip",
    PLACE_SHIP: "Enter: Plasser skip",
    SHIP_TO_PLACE: "Skip å plassere:",
    SPACE: "Områder",
    IN_BETWEEN: "beveger vekk fra imellom skjerm",
    BATTLESHIP: "Det burde  være et Battleship spill her",
  },
};

let currentLanguage = language.en;

function setLanguage(lang) {
  if (language[lang]) {
    currentLanguage = language[lang];
  }
}

function getLanguage() {
  return currentLanguage;
}

export { language, setLanguage, getLanguage };
