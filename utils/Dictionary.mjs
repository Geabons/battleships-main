import { MIN_HEIGHT } from "../game.mjs";
import { MIN_WIDTH } from "../game.mjs";

const language = {
  en: {
    TERMINAL_SIZE: (width, height) =>
      `Terminal is too small! Please resize to at least ${MIN_WIDTH}x${MIN_HEIGHT}.\n`,
    RESIZING: "Resizing detected. Resuming game...\n",
    CHANGE_LANGUAGE: "Swap language",
    LANGUAGE_CHANGED: "Language Changed",
    START_GAME: "Start Game",
    EXIT_GAME: "Exit Game"
  },
  no: {
    TERMINAL_SIZE: (width, height) =>
      `Terminalen er for liten! vær så snill å endre den til minst ${MIN_WIDTH}x${MIN_HEIGHT}.\n`,
    RESIZING: "Endre størrelse oppdaget. Gjenopptar spillet...",
    CHANGE_LANGUAGE: "Endre språk",
    LANGUAGE_CHANGED: "Språk endret",
    START_GAME: "Start spill",
    EXIT_GAME: "Avslutt Spill"
  },
};

let currentLanguage = language.en;

function setLanguage(lang){
    if (language[lang]){
        currentLanguage = language[lang];
    }
}

function getLanguage(){
    return currentLanguage;
}

export { language, setLanguage, getLanguage };
