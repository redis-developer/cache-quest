import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { locationScroll, createAlert } from "../systems/ui.js";
import { generateCollision, generateCollisions, generateTriggers } from "../systems/collision.js";
import { savePlayerData } from "../systems/saveload.js";
import { generateDialog } from "../systems/dialog.js";
import { getChapterTwoDialog } from "../../assets/dialog/chapter2.js";

import { playerState, gameState } from "../states/stateManager.js";
import { playerDungeon } from "../entities/player.js";
import { spawnSpider, spawnSpiderQueen } from "../entities/spider.js";

export default async function dungeon(k) {
  //fetch data
  const dungeonData = await fetchData("./assets/data/dungeon.json");
  const collisions = dungeonData.layers.find((layer) => layer.name === "collisions").objects;
  const triggers = dungeonData.layers.find((layer) => layer.name === "triggers").objects;
  const enemies = dungeonData.layers.find((layer) => layer.name === "enemies").objects;
  const spiderQueenData = enemies.find((obj) => obj.name === "spiderQueen");
  const spiders = enemies.filter((obj) => obj.name === "spider");
  const gate1Data = enemies.find((obj) => obj.name === "gate1");

  //get dialog
  const ch2Dialog = getChapterTwoDialog();

  //render base map layer and collisions
  setBackgroundColor("#0f0f0f");

  const map = k.add([k.sprite("dungeon")]);
  map.add([k.sprite("dungeon1"), k.layer("foreground")]);

  generateCollisions(map, collisions);

  let gate1 = null;
  if (!gameState.get().bossDefeated.chapter2) gate1 = map.add(generateCollision(gate1Data));

  //render UI before entities

  //interactions
  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before enemies because they reference player
  const player = k.add(playerDungeon());
  player.init();

  //spawn enemies
  // console.log("spawning enemies");
  for (const enemy of spiders) {
    map.add(spawnSpider(enemy)).init();
  }

  //scene triggers
  const story = gameState.get().story;
  if (story.chapter === 2 && !gameState.get().bossDefeated.chapter2) {
    //spawn boss
    const spiderQueen = map.add(spawnSpiderQueen(spiderQueenData));
    spiderQueen.init();

    generateTriggers(map, triggers);

    if (story.subchapter <= 2) {
      player.onCollide("dungeonEntrance", (trigger) => {
        generateDialog(ch2Dialog.dungeonEntrance, k.vec2(50), () => {
          createAlert(
            k.center().add(0, 250),
            { width: 550, height: 40, text: 24 },
            "Press 'F' to fire projectiles",
            5,
          );
        });
        gameState.set("story", "subchapter", 3);
        trigger.destroy();
      });
    }

    if (story.subchapter <= 3) {
      player.onCollide("dungeonBoss", (trigger) => {
        spiderQueen.enterState("patrol-right");
        generateDialog(ch2Dialog.dungeonBoss, k.vec2(50));
        gameState.set("story", "subchapter", 4);
        playerState.set("position", { x: 950, y: 380 });
        trigger.destroy();
      });
    }

    spiderQueen.onStateEnter("death", () => gate1.destroy());
  }

  //scene transitions
  player.onCollide("exit", async () => {
    // set and save player's new map and location
    playerState.set("map", "level2");
    if (story.chapter === 2 && gameState.get().bossDefeated.chapter2)
      playerState.set("position", { x: 1600, y: 850 });
    else playerState.set("position", { x: 1850, y: 550 });

    await savePlayerData();

    //load next scene
    k.go("level2");
  });

  //scene settings
  k.setCamScale(1.2);

  //runs every frame, 60 times a second
  k.onUpdate(async () => {
    //camera follow player
    k.setCamPos(player.pos);
  });

  //level title, disappears after 5 seconds
  locationScroll("Dungeon of\nDeprecation\nSpiders", 5);
}
