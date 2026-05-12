import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions, generateTriggers } from "../systems/collision.js";
import { locationScroll, createAlert } from "../systems/ui.js";
import { savePlayerData } from "../systems/saveload.js";
import { generateDialog } from "../systems/dialog.js";
import { getChapterThreeDialog } from "../../assets/dialog/chapter3.js";

import { playerState, gameState } from "../states/stateManager.js";
import { playerDungeon } from "../entities/player.js";
import { spawnSkeleton } from "../entities/skeleton.js";
import { spawnCostVampire } from "../entities/vampire.js";

export default async function badlands(k) {
  //fetch data
  const badlandsData = await fetchData("./assets/data/badlands.json");
  const collisions = badlandsData.layers.find((layer) => layer.name === "collisions").objects;
  const triggers = badlandsData.layers.find((layer) => layer.name === "triggers").objects;
  const enemies = badlandsData.layers.find((layer) => layer.name === "enemies").objects;
  const costVampireData = enemies.find((obj) => obj.name === "costVampire");
  const skeletons = enemies.filter((obj) => obj.name === "skeleton");

  //get dialog
  const ch3Dialog = getChapterThreeDialog();

  //render base map layer and collisions
  setBackgroundColor("#f0a261");

  const map = k.add([k.sprite("badlands")]);
  map.add([k.sprite("badlands1"), k.layer("foreground")]);

  generateCollisions(map, collisions);

  //render UI before entities

  //interactions
  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before enemies because they reference player
  const player = k.add(playerDungeon());
  player.init();
  player.scaleTo(0.75);

  //spawn enemies
  // console.log("spawning enemies");
  for (const enemy of skeletons) {
    map.add(spawnSkeleton(enemy)).init();
  }

  //scene triggers
  const story = gameState.get().story;
  if (story.chapter === 3 && !gameState.get().bossDefeated.chapter3) {
    //spawn boss
    map.add(spawnCostVampire(costVampireData)).init();

    generateTriggers(map, triggers);

    if (story.subchapter <= 2) {
      player.onCollide("badlandsEntrance", (trigger) => {
        generateDialog(ch3Dialog.badlandsEntrance, k.vec2(50), () => {
          createAlert(
            k.center().add(0, 250),
            { width: 560, height: 40, text: 24 },
            "Press 'Shift' to use Hybrid Shield",
            5,
          );
        });
        gameState.set("story", "subchapter", 3);
        trigger.destroy();
      });
    }

    if (story.subchapter <= 3) {
      player.onCollide("badlandsBoss", (trigger) => {
        generateDialog(ch3Dialog.badlandsBoss, k.vec2(50));
        gameState.set("story", "subchapter", 4);
        playerState.set("position", { x: 1800, y: 450 });
        trigger.destroy();
      });
    }
  }

  //scene transitions
  player.onCollide("exit", async () => {
    //set and save player's new map and location
    playerState.set("map", "level3");
    if (story.chapter === 3 && gameState.get().bossDefeated.chapter3)
      playerState.set("position", { x: 1920, y: 900 });
    else playerState.set("position", { x: 1980, y: 480 });

    await savePlayerData();

    //load next scene
    k.go("level3");
  });

  //scene settings
  k.setCamScale(1.5);

  //runs every frame, 60 times a second
  k.onUpdate(async () => {
    //camera follow player
    k.setCamPos(player.pos);
  });

  //level title, disappears after 5 seconds
  locationScroll("Badlands of\nBottleneck\nSkeletons", 5);
}
