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
import { spawnMelvin } from "../entities/melvin.js";
import { spawnNpc } from "../entities/npcTertiary.js";
import { getChapterTwoDialog } from "../../assets/dialog/chapter2.js";

export default async function level2(k) {
  //fetch map data
  const mapData = await fetchData("./assets/data/mountains.json");
  const collisions = mapData.layers.find((layer) => layer.name === "collisions").objects;
  const npcs = mapData.layers.find((layer) => layer.name === "npcs").objects;

  const main = mapData.layers.find((layer) => layer.name === "main").objects;
  const docData = main.find((obj) => obj.name === "Doc");
  const melvinData = main.find((obj) => obj.name === "Melvin");
  const leaderboard = main.find((obj) => obj.name === "leaderboard");
  const portalSurvivor2 = main.find((obj) => obj.name === "survivor2");
  const portalLevel1 = main.find((obj) => obj.name === "level1");
  const portalLevel3 = main.find((obj) => obj.name === "level3");

  //get story and dialog
  const story = gameState.get().story;
  const ch2Dialog = getChapterTwoDialog();

  //render base map layer and collisions
  setBackgroundColor("#47ABA9");

  const map = k.add([k.sprite("mountains")]);
  map.add([k.sprite("mountains1"), k.layer("foreground")]);

  generateCollisions(map, collisions);

  //clickable links
  // map.add(url(k.vec2(1520, 300), "redis.io", "https://redis.io")).init();
  // map.add(url(k.vec2(1520, 325), "Try Redis", "https://redis.io/try-free/")).init();

  //render UI before entities

  //interactions
  map.add(leaderboardPanel(leaderboard)).init();
  // map.add(savePoint(k.vec2(1000, 500))).init();

  //portals
  //survivor portal
  map
    .add(
      survivorPortal(portalSurvivor2, () => {
        playerState.set("position", player.pos);
        playerState.set("leaderboard", "Mountains");
        k.go("survivor2");
      }),
    )
    .init();

  //portal to level1
  map
    .add(
      levelPortal(portalLevel1, "LEVEL 1", async () => {
        playerState.set("leaderboard", "Grassland");
        playerState.set("map", "level1");
        playerState.set("position", { x: 1030, y: 500 });
        await savePlayerData();
        k.go("level1");
      }),
    )
    .init();

  //portal to level3
  if (story.chapter >= 3 || (story.chapter === 2 && story.subchapter >= 5)) {
    map
      .add(
        levelPortal(portalLevel3, "LEVEL 3", async () => {
          playerState.set("leaderboard", "Badlands");
          playerState.set("map", "level3");
          playerState.set("position", { x: 1920, y: 900 });
          await savePlayerData();
          k.go("level3");
        }),
      )
      .init();
  }

  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before NPCs because some NPCs references the player
  const player = k.add(playerTopDown());
  player.init(true);
  k.setCamPos(player.pos);

  //spawn NPCs
  //Doc
  map.add(spawnDoc(docData)).init();
  //Melvin
  map.add(spawnMelvin(melvinData)).init();
  //tertiary NPCs
  for (const npc of npcs) {
    map.add(spawnNpc(npc)).init();
  }

  //scene triggers
  //chapter 2 intro dialog
  if (story.chapter === 2 && story.subchapter === 1) {
    k.wait(0.2, async () => {
      generateDialog(ch2Dialog.intro, k.vec2(50));
      gameState.set("story", "subchapter", 2);
      playerState.set("skillUnlocked", "shuriken", true);
      await saveGameData();
      await savePlayerData();
    });
  }

  //if player just defeated spiderQueen, display chapter 2 ending dialog
  if (gameState.get().bossDefeated.chapter2 && story.chapter === 2 && story.subchapter === 5) {
    k.wait(0.2, async () => {
      generateDialog(ch2Dialog.end, k.vec2(50));
      gameState.set("story", "chapter", 3);
      gameState.set("story", "subchapter", 1);
      await saveGameData();
    });
  }

  //if player is answering Melvin's message in chapter 4
  if (story.chapter === 4 && story.subchapter === 2) {
    k.wait(0.2, async () => {
      generateDialog(ch2Dialog.transition, k.vec2(50), async () => {
        playerState.set("map", "level4");
        playerState.set("position", { x: 600, y: 450 });
        await saveGameData();
        await savePlayerData();
        k.go("level4");
      });
    });
  }

  //scene transitions
  player.onCollide("dungeon", async () => {
    //set and save player's new map and location
    playerState.set("map", "dungeon");
    playerState.set("position", { x: 180, y: 2640 });
    await savePlayerData();

    //load next scene
    k.go("dungeon");
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
  locationBanner(k.vec2(k.center().x, 650), "Copper Mountain", 5);
}
