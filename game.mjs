import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { language, getLanguage, setLanguage } from "./utils/Dictionary.mjs";


const MAIN_MENU_ITEMS = buildMenu();

const GAME_FPS = 1000 / 60;
const MIN_HEIGHT = 24;
const MIN_WIDTH = 80;
let currentState = null;
let gameLoop = null;
let isPausedForResize = false;

let mainMenuScene = null;

setLanguage("en");

function checkTerminalResolution() {
  const width = process.stdout.columns;
  const height = process.stdout.rows;

  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    if (!isPausedForResize) {
      isPausedForResize = true;
      clearScreen();
      print(getLanguage().TERMINAL_SIZE(MIN_WIDTH, MIN_HEIGHT));
      if (gameLoop) clearInterval(gameLoop);
    }
    return false;
  } else {
    if (isPausedForResize) {
      isPausedForResize = false;
      clearScreen();
      print("Resizing detected. Resuming game...\n");
      startGameLoop();
    }
    return true;
  }
}

function startGameLoop() {
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, GAME_FPS);
}

(function initialize() {
  print(ANSI.HIDE_CURSOR);
  clearScreen();

  mainMenuScene = createMenu(MAIN_MENU_ITEMS);
  SplashScreen.next = mainMenuScene;
  currentState = SplashScreen;

  if (checkTerminalResolution()) {
    startGameLoop();
  } else {
    print("Waiting for adequate terminal size...\n");
  }

  process.stdout.on("resize", () => {
    checkTerminalResolution();
  });
})();

function update() {
  if (isPausedForResize) return;

  currentState.update(GAME_FPS);
  currentState.draw(GAME_FPS);

  if (currentState.transitionTo != null) {
    currentState = currentState.next;
    print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
  }
}

// Support / Utility functions ---------------------------------------------------------------

function buildMenu() {
  let menuItemCount = 0;
  return [
    {
      text: getLanguage().START_GAME,
      id: menuItemCount++,
      action: function () {
        clearScreen();
        let innbetween = createInnBetweenScreen();
        innbetween.init(
          `SHIP PLACMENT\nFirst player get ready.\nPlayer two look away`,
          () => {
            let p1map = createMapLayoutScreen();
            p1map.init(FIRST_PLAYER, (player1ShipMap) => {
              let innbetween = createInnBetweenScreen();
              innbetween.init(
                `SHIP PLACEMENT\nSecond player get ready.\nPlayer one look away`,
                () => {
                  let p2map = createMapLayoutScreen();
                  p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                    return createBattleshipScreen(
                      player1ShipMap,
                      player2ShipMap
                    );
                  });
                  return p2map;
                }
              );
              return innbetween;
            });

            return p1map;
          },
          3
        );
        currentState.next = innbetween;
        currentState.transitionTo = "Map layout";
      },
    },
    {
      text: getLanguage().EXIT_GAME,
      id: menuItemCount++,
      action: function () {
        print(ANSI.SHOW_CURSOR);
        clearScreen();
        process.exit();
      },
    },
    {
      text: getLanguage().CHANGE_LANGUAGE,
      id: menuItemCount++,
      action: function () {
        const currentLanguage = getLanguage();
        if (getLanguage() === language.en) {
          setLanguage("no");
        } else {
          setLanguage("en");
        }
        print(getLanguage().LANGUAGE_CHANGED);
        clearScreen();
        mainMenuScene = createMenu(buildMenu()); 
        currentState = mainMenuScene;
      },
    },
  ];
}

export { MIN_HEIGHT };
export { MIN_WIDTH };
