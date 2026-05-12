import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions, generateTriggers } from "../systems/collision.js";
import { locationScroll, createAlert } from "../systems/ui.js";
import { savePlayerData } from "../systems/saveload.js";
import { generateDialog } from "../systems/dialog.js";
import { getChapterOneDialog } from "../../assets/dialog/chapter1.js";

import { playerState, gameState } from "../states/stateManager.js";
import { playerDungeon } from "../entities/player.js";
import { spawnGoblin } from "../entities/goblin.js";
import { spawnSamBoss } from "../entities/sam.js";

export default async function lair(k) {
  //fetch data
  const lairData = await fetchData("./assets/data/lair.json");
  const collisions = lairData.layers.find((layer) => layer.name === "collisions").objects;
  const triggers = lairData.layers.find((layer) => layer.name === "triggers").objects;
  const enemies = lairData.layers.find((layer) => layer.name === "enemies").objects;
  const samData = enemies.find((obj) => obj.name === "Sam");
  const goblins = enemies.filter((obj) => obj.name === "goblin");

  //get dialog
  const ch1Dialog = getChapterOneDialog();

  //render base map layer and collisions
  setBackgroundColor("#0a0909");

  const map = k.add([k.sprite("lair")]);

  generateCollisions(map, collisions);

  //render UI before entities

  //interactions
  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before enemies because they reference player
  const player = k.add(playerDungeon());
  player.init();

  //spawn enemies
  // console.log("spawning enemies");
  for (const enemy of goblins) {
    map.add(spawnGoblin(enemy)).init();
  }

  //render foreground layer
  // k.onDraw(() => k.drawSprite({ sprite: "lair1" }));

  //scene triggers
  const story = gameState.get().story;
  if (story.chapter === 1 && !gameState.get().bossDefeated.chapter1) {
    //spawn boss
    const sam = map.add(spawnSamBoss(samData)); //save reference for boss trigger
    sam.init();

    generateTriggers(map, triggers);

    if (story.subchapter <= 2) {
      player.onCollide("lairEntrance", (trigger) => {
        generateDialog(ch1Dialog.lairEntrance, k.vec2(50), () => {
          createAlert(
            k.center().add(0, 250),
            { width: 550, height: 40, text: 24 },
            "Press 'Space' to use Cache Beam",
            5,
          );
        });
        gameState.set("story", "subchapter", 3);
        trigger.destroy();
      });
    }

    if (story.subchapter <= 3) {
      player.onCollide("lairBoss", (trigger) => {
        sam.enterState("patrol-right");
        generateDialog(ch1Dialog.lairBoss, k.vec2(50, 500));
        gameState.set("story", "subchapter", 4);
        playerState.set("position", { x: 2950, y: 1500 });
        trigger.destroy();
      });
    }
  }

  //scene transitions
  player.onCollide("exit", async () => {
    //set and save player's new map and location
    playerState.set("map", "level1");
    playerState.set("position", { x: 1570, y: 200 });
    await savePlayerData();

    //load next scene
    k.go("level1");
  });

  //scene settings
  k.setCamScale(1.2);

  //runs every frame, 60 times a second
  k.onUpdate(async () => {
    //camera follow player
    k.setCamPos(player.pos);
  });

  //level title, disappears after 5 seconds
  locationScroll("Lair of\nLatency\nGoblins", 5);
}
