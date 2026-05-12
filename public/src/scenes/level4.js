import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions } from "../systems/collision.js";
import { generateDialog } from "../systems/dialog.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";
import { savePoint, levelPortal } from "../systems/interaction.js";
import { locationBanner } from "../systems/ui.js";

import { playerState, gameState } from "../states/stateManager.js";
import { playerTopDown } from "../entities/player.js";
import { spawnDoc } from "../entities/doc.js";
import { spawnSam } from "../entities/sam.js";
import { spawnMelvin } from "../entities/melvin.js";
import { spawnKallie } from "../entities/kallie.js";
import { spawnNpc } from "../entities/npcTertiary.js";
import { getChapterFourDialog } from "../../assets/dialog/chapter4.js";

export default async function level4(k) {
  //fetch map data
  const mapData = await fetchData("./assets/data/neonEntrance.json");
  const collisions = mapData.layers.find((layer) => layer.name === "collisions").objects;
  // const npcs = mapData.layers.find((layer) => layer.name === "npcs").objects;

  const main = mapData.layers.find((layer) => layer.name === "main").objects;
  const docData = main.find((obj) => obj.name === "Doc");
  const samData = main.find((obj) => obj.name === "Sam");
  const melvinData = main.find((obj) => obj.name === "Melvin");
  const kallieData = main.find((obj) => obj.name === "Kallie");
  const portalLevel1 = main.find((obj) => obj.name === "level1");
  const portalLevel2 = main.find((obj) => obj.name === "level2");
  const portalLevel3 = main.find((obj) => obj.name === "level3");

  //get story and dialog
  const story = gameState.get().story;
  const ch4Dialog = getChapterFourDialog();

  //render base map layer and collisions
  setBackgroundColor("#0b131e");

  const map = k.add([k.sprite("neonEntrance")]);

  generateCollisions(map, collisions);

  //interactions
  // map.add(savePoint(k.vec2(1000, 500))).init();

  // if (gameState.get().bossDefeated.chapter4) {
  //   map
  //     .add(
  //       levelPortal(portalLevel1, "LEVEL 1", async () => {
  //         playerState.set("leaderboard", "grassland");
  //         playerState.set("map", "level1");
  //         playerState.set("position", { x: 1030, y: 700 });
  //         await savePlayerData();
  //         k.go("level1");
  //       }),
  //     )
  //     .init();

  //   map
  //     .add(
  //       levelPortal(portalLevel2, "LEVEL 2", async () => {
  //         playerState.set("leaderboard", "mountains");
  //         playerState.set("map", "level2");
  //         playerState.set("position", { x: 1600, y: 850 });
  //         await savePlayerData();
  //         k.go("level2");
  //       }),
  //     )
  //     .init();

  //   map
  //     .add(
  //       levelPortal(portalLevel3, "LEVEL 3", async () => {
  //         playerState.set("leaderboard", "badlands");
  //         playerState.set("map", "level3");
  //         playerState.set("position", { x: 1920, y: 900 });
  //         await savePlayerData();
  //         k.go("level3");
  //       }),
  //     )
  //     .init();
  // }

  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before NPCs because some NPCs references the player
  const player = k.add(playerTopDown());
  player.init(true);
  k.setCamPos(player.pos);

  //spawn NPCs
  if (story.chapter === 4) {
    //Doc
    map.add(spawnDoc(docData)).init();
    // //secondary NPCs
    map.add(spawnSam(samData)).init(true);
    map.add(spawnKallie(kallieData)).init();
    map.add(spawnMelvin(melvinData)).init();
  }

  //scene triggers
  //intro dialog
  if (story.chapter === 4 && story.subchapter === 2) {
    k.wait(0.2, async () => {
      generateDialog(ch4Dialog.intro, k.vec2(50, 20));
      gameState.set("story", "subchapter", 3);
      await saveGameData();
    });
  }

  //if player just defeated outageOgre
  if (gameState.get().bossDefeated.chapter4 && story.chapter === 4 && story.subchapter === 8) {
    k.wait(0.2, async () => {
      gameState.set("story", "chapter", 5);
      gameState.set("story", "subchapter", 1);
      playerState.set("map", "level1");

      await saveGameData();
      await savePlayerData();

      generateDialog(ch4Dialog.end, k.vec2(50), () => k.go("credits"));
    });
  }

  //scene transitions
  player.onCollide("neonfactory", async () => {
    //set and save player's new map and location
    gameState.set("story", "subchapter", 4);
    playerState.set("map", "neonfactory");
    playerState.set("position", { x: 160, y: 3100 });

    await saveGameData();
    await savePlayerData();

    //load next scene
    k.go("neonfactory");
  });

  //scene settings
  k.setCamScale(1.5);

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
  locationBanner(k.vec2(k.center().x, 650), "Neon Factory", 5);
}
