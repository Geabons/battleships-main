import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";

const MAIN_MENU_ITEMS = buildMenu();

const GAME_FPS = 1000 / 60; // The theoretical refresh rate of our game engine
const MIN_WIDTH = 80;
const MIN_HEIGHT = 24;
let currentState = null; // The current active state in our finite-state machine.
let gameLoop = null; // Variable that keeps a reference to the interval I assigned to our game loop
let isPausedForResize = false;

let mainMenuScene = null;

function checkTerminalResolution() {
  const width = process.stdout.columns;
  const height = process.stdout.rows;

  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    // Terminal is too small
    if (!isPausedForResize) {
      isPausedForResize = true;
      clearScreen();
      print(`Terminal is too small! Please resize to at least ${MIN_WIDTH}x${MIN_HEIGHT}.\n`);
      if (gameLoop) clearInterval(gameLoop); // Stop the game loop
    }
    return false;
  } else {
    // Terminal size is okay
    if (isPausedForResize) {
      isPausedForResize = false;
      clearScreen();
      print("Resizing detected. Resuming game...\n");
      startGameLoop(); // Resume the game loop
    }
    return true;
  }
}

// Function to start the game loop
function startGameLoop() {
  if (gameLoop) clearInterval(gameLoop); // Clear any existing game loop to avoid duplicate loops
  gameLoop = setInterval(update, GAME_FPS);
}

// Initialization function
(function initialize() {
  print(ANSI.HIDE_CURSOR);
  clearScreen();

  mainMenuScene = createMenu(MAIN_MENU_ITEMS);
  SplashScreen.next = mainMenuScene;
  currentState = SplashScreen; // Set the initial game state

  // Check if the terminal size is adequate
  if (checkTerminalResolution()) {
    startGameLoop(); // Start the game if terminal size is adequate
  } else {
    print("Waiting for adequate terminal size...\n");
  }

  // Listen for terminal resize events and recheck size on resize
  process.stdout.on("resize", () => {
    checkTerminalResolution();
  });
})();

// Main game loop function
function update() {
  if (isPausedForResize) return; // Skip updates if paused for resize

  currentState.update(GAME_FPS);
  currentState.draw(GAME_FPS);

  // Check if we need to transition to a new state
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
      text: "Start Game",
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
      text: "Exit Game",
      id: menuItemCount++,
      action: function () {
        print(ANSI.SHOW_CURSOR);
        clearScreen();
        process.exit();
      },
    },
  ];
}
