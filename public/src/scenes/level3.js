import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions } from "../systems/collision.js";
import { generateDialog } from "../systems/dialog.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";
import {
  leaderboardPanel,
  savePoint,
  survivorPortal,
  levelPortal,
} from "../systems/interaction.js";
import { locationBanner } from "../systems/ui.js";

import { playerState, gameState } from "../states/stateManager.js";
import { playerTopDown } from "../entities/player.js";
import { spawnDoc } from "../entities/doc.js";
import { spawnKallie } from "../entities/kallie.js";
import { getChapterThreeDialog } from "../../assets/dialog/chapter3.js";
import { spawnNpc } from "../entities/npcTertiary.js";

export default async function level3(k) {
  //fetch map data
  const mapData = await fetchData("./assets/data/oasis.json");
  const collisions = mapData.layers.find((layer) => layer.name === "collisions").objects;
  const npcs = mapData.layers.find((layer) => layer.name === "npcs").objects;

  const main = mapData.layers.find((layer) => layer.name === "main").objects;
  const docData = main.find((obj) => obj.name === "Doc");
  const kallieData = main.find((obj) => obj.name === "Kallie");
  const leaderboard = main.find((obj) => obj.name === "leaderboard");
  const portalSurvivor3 = main.find((obj) => obj.name === "survivor3");
  const portalLevel2 = main.find((obj) => obj.name === "level2");

  //get story and dialog
  const story = gameState.get().story;
  const ch3Dialog = getChapterThreeDialog();

  //render base map layer and collisions
  setBackgroundColor("#47ABA9");

  const map = k.add([k.sprite("oasis")]);
  map.add([k.sprite("oasis1"), k.layer("foreground")]);

  generateCollisions(map, collisions);

  //clickable links
  // map.add(url(k.vec2(1520, 300), "redis.io", "https://redis.io")).init();
  // map.add(url(k.vec2(1520, 325), "Try Redis", "https://redis.io/try-free/")).init();

  //render UI before entities

  //interactions
  map.add(leaderboardPanel(leaderboard)).init();
  // map.add(savePoint(k.vec2(1000, 500))).init();

  //survivor portal
  map
    .add(
      survivorPortal(portalSurvivor3, async () => {
        if (story.chapter === 4 && story.subchapter === 1) {
          // gameState.set("story", "chapter", 4);
          gameState.set("story", "subchapter", 2);
          await saveGameData();
        }
        playerState.set("position", player.pos);
        playerState.set("leaderboard", "Badlands");
        k.go("survivor3");
      }),
    )
    .init();

  //portal to level2
  map
    .add(
      levelPortal(portalLevel2, "LEVEL 2", async () => {
        playerState.set("leaderboard", "Mountains");
        playerState.set("map", "level2");
        playerState.set("position", { x: 1600, y: 850 });
        await savePlayerData();
        k.go("level2");
      }),
    )
    .init();

  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before NPCs because some NPCs references the player
  const player = k.add(playerTopDown());
  player.init(true);
  k.setCamPos(player.pos);

  //spawn NPCs
  //Doc
  map.add(spawnDoc(docData)).init();
  //Kallie
  map.add(spawnKallie(kallieData)).init();
  //tertiary NPCs
  for (const npc of npcs) {
    map.add(spawnNpc(npc)).init();
  }

  //scene triggers
  //intro dialog
  if (story.chapter === 3 && story.subchapter === 1) {
    k.wait(0.2, async () => {
      generateDialog(ch3Dialog.intro, k.vec2(50, 500));
      gameState.set("story", "subchapter", 2);
      playerState.set("skillUnlocked", "shieldAura", true);
      await saveGameData();
      await savePlayerData();
    });
  }

  //if player just defeated costVampire, display chapter 3 ending dialog
  if (gameState.get().bossDefeated.chapter3 && story.chapter === 3 && story.subchapter === 5) {
    k.wait(0.2, async () => {
      generateDialog(ch3Dialog.end, k.vec2(50, 500));
      gameState.set("story", "chapter", 4);
      gameState.set("story", "subchapter", 1);
      await saveGameData();
    });
  }

  //if player just left survivor mode after ending chapter 3
  if (story.chapter === 4 && story.subchapter === 2) {
    generateDialog(ch3Dialog.transition, k.vec2(50, 300));
    // gameState.set("story", " subchapter", 3);
    // await saveGameData();
  }

  //scene transitions
  player.onCollide("badlands", async () => {
    //set and save player's new map and location
    playerState.set("map", "badlands");
    playerState.set("position", { x: 600, y: 2500 });
    await savePlayerData();

    //load next scene
    k.go("badlands");
  });

  //scene settings
  k.setCamScale(1.8);

  //runs every frame, 60 times a second
  k.onUpdate(async () => {
    //camera follow player
    // k.setCamPos(player.pos);

    //tween camera to player position
    if (player.pos.dist(k.getCamPos()) > 3) {
      await k.tween(
        k.getCamPos(),
        player.pos,
        0.15,
        (newPos) => k.setCamPos(newPos),
        k.easings.linear,
      );
    }

    // console.log("FPS: " + k.debug.fps());
  });

  //level title, disappears after 5 seconds
  locationBanner(k.vec2(k.center().x, 650), "Oasis", 5);
}
