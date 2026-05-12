// import mainMenuText from "../content/mainMenuText.js";

import { debugLog, setBackgroundColor } from "../systems/utils.js";
import {
  loadPlayerData,
  loadGameData,
  createPlayerData,
  createGameData,
  getSessionId,
} from "../systems/saveload.js";
import { createAlert } from "../systems/ui.js";
import { playerState, gameState } from "../states/stateManager.js";

export default async function mainMenu(k) {
  k.onDraw(() => k.drawSprite({ sprite: "title" }));
  k.onDraw(() => k.drawSprite({ sprite: "logo", pos: k.vec2(575, 40) }));

  const menu = k.add([]);

  // menu.add([k.sprite("logo"), k.pos(575, 10)]);

  const input = menu.add([
    k.text("Username: ", { size: 36, font: "redaction-bold" }),
    k.pos(k.center().add(-250, 125)),
    k.color("#fae0c3"),
  ]);

  input.add([
    k.rect(275, 50, { radius: 10 }),
    k.pos(210, -5),
    k.outline(3, k.rgb("#f2c63f")),
    k.color("#000000"),
  ]);

  menu.add([
    k.text("PRESS ENTER TO START", { size: 24, font: "space" }),
    k.anchor("center"),
    k.pos(k.center().add(0, 260)),
  ]);

  //get session id
  const session = await getSessionId();

  //if game is not connected to backend, run game locally by pressing attack button
  if (!session) {
    //debug
    menu.onButtonPress(["attack"], () => {
      playerState.set("name", "RedisDev");

      k.go(playerState.get().map);
    });
    return;
  }
  // load player and game data from Redis
  let loadPlayer = await loadPlayerData(session.id);
  let loadGame = await loadGameData(session.id);

  //if player and game exists
  if (loadPlayer && loadGame) {
    console.log(loadPlayer);
    console.log(loadGame);

    //display player name
    input.add([
      k.text(playerState.get().name.toUpperCase(), { size: 26, font: "space" }),
      k.color("#f2c63f"),
      k.pos(220, 8),
    ]);

    menu.onButtonPress("start", () => {
      k.go(playerState.get().map);
    });
  } else {
    //else create new game

    //blinking text cursor
    const cursor = input.add([
      k.rect(3, 35),
      k.color("#f2c63f"),
      k.pos(220, 5),
      k.opacity(),
      k.timer(),
      {
        init() {
          this.loop(0.5, () => (this.opacity = this.opacity === 0 ? 1 : 0));
        },
      },
    ]);
    cursor.init();

    const username = input.add([
      k.text("", { size: 26, font: "space" }),
      k.color("#f2c63f"),
      k.textInput(true, 15),
      k.pos(220, 5),
      "inputName",
    ]);
    username.onInput(() => cursor.moveTo(220 + username.text.length * 16, 5));

    menu.onButtonPress("start", async () => {
      const playerName = username.text.replace(/[^a-zA-Z0-9]/g, "");
      if (playerName === "") {
        console.log("player name empty");
        createAlert(
          k.center().add(0, 50),
          { width: 630, height: 50, text: 24 },
          "Type player name before pressing Enter.",
          3,
        );
        return;
      }

      playerState.set("name", playerName);
      playerState.set("id", session.id);
      gameState.set("id", session.id);
      const createPlayer = await createPlayerData();
      const createGame = await createGameData();

      // debugLog("log", `New game created, player ID: ${session.id}`);
      console.log(createPlayer);
      console.log(createGame);
      k.go(playerState.get().map);
    });
  }
}
