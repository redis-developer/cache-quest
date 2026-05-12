import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions } from "../systems/collision.js";
import { generateDialog } from "../systems/dialog.js";
import { URL_TRY_REDIS } from "../systems/constants.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";
import { leaderboardPanel, survivorPortal, levelPortal, sign } from "../systems/interaction.js";
import { locationBanner, createAlert } from "../systems/ui.js";

import { playerState, gameState } from "../states/stateManager.js";
import { playerTopDown } from "../entities/player.js";
import { spawnSam } from "../entities/sam.js";
import { spawnDoc } from "../entities/doc.js";
import { spawnNpc } from "../entities/npcTertiary.js";
import { getChapterOneDialog } from "../../assets/dialog/chapter1.js";

export default async function level1(k) {
  //fetch map data
  const mapData = await fetchData("./assets/data/grassland.json");
  const collisions = mapData.layers.find((layer) => layer.name === "collisions").objects;
  const npcs = mapData.layers.find((layer) => layer.name === "npcs").objects;

  const main = mapData.layers.find((layer) => layer.name === "main").objects;
  const docData = main.find((obj) => obj.name === "Doc");
  const samData = main.find((obj) => obj.name === "Sam");
  const leaderboard = main.find((obj) => obj.name === "leaderboard");
  const portalSurvivor1 = main.find((obj) => obj.name === "survivor1");
  const portalLevel2 = main.find((obj) => obj.name === "level2");

  //get story and dialog
  const story = gameState.get().story;
  const ch1Dialog = getChapterOneDialog();

  //render base map layer and collisions
  setBackgroundColor("#47aba9");

  const map = k.add([k.sprite("grassland")]);
  map.add([k.sprite("grassland1"), k.layer("foreground")]);

  //alternative to render map using onDraw()
  //const map = k.add();
  //map.onDraw(() => k.drawSprite({ sprite: "grassland" }));
  //render top map layer
  //const map1 = k.add([k.layer("foreground")]);
  // map1.onDraw(() => k.drawSprite({ sprite: "grassland1" }));

  generateCollisions(map, collisions);

  //clickable links
  // map.add(url(k.vec2(1600, 600), "redis.io", "https://redis.io")).init();
  // map.add(url(k.vec2(1600, 625), "Try Redis", "https://redis.io/try-free/")).init();
  map.add(sign(k.vec2(1550, 615), "Try Redis", URL_TRY_REDIS)).init();

  //render UI before entities

  //interactions
  map.add(leaderboardPanel(leaderboard)).init();
  // map.add(savePoint(k.vec2(1000, 500))).init();

  //portals
  //survivor portal
  map
    .add(
      survivorPortal(portalSurvivor1, () => {
        playerState.set("position", player.pos);
        playerState.set("leaderboard", "Grassland");
        k.go("survivor1");
      }),
    )
    .init();

  //portal to level2
  if (story.chapter >= 2 || (story.chapter === 1 && story.subchapter >= 5)) {
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
  }

  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before NPCs because some NPCs references the player
  const player = k.add(playerTopDown());
  // player.flipX = false;
  player.init();

  k.setCamPos(player.pos);

  ////////////////testing
  // const playerSkills = await fetchData("./assets/data/skills.json");
  // const testTimer = setInterval(() => console.log("hello"), 1000);
  // const testTimer1 = setInterval(() => console.log("world"), 1100);

  // //embeddings
  // map
  //   .add(
  //     embeddings({ x: 1250, y: 550 }, [testTimer, testTimer1], () => {
  //       console.log("timers stopped");
  //       player.skills.swordBeam.stats = playerSkills.swordBeam.statsMax;
  //       player.skills.swordBeam.unlocked = true;
  //     }),
  //   )
  //   .init();

  //portal to level4
  // map
  //   .add(
  //     levelPortal({ x: 960, y: 640 }, "Level 4", async () => {
  //       playerState.set("map", "level4");
  //       playerState.set("position", { x: 650, y: 450 });
  //       // await savePlayerData();
  //       k.go("level4");
  //     }),
  //   )
  //   .init();
  ////////////////testing

  //spawn NPCs
  //Doc
  map.add(spawnDoc(docData)).init(); //k.vec2(1350, 570)
  //Sam
  if (gameState.get().bossDefeated.chapter1) map.add(spawnSam(samData)).init();
  //tertiary NPCs
  for (const npc of npcs) {
    map.add(spawnNpc(npc)).init();
  }

  //scene triggers
  //chapter 1 intro dialog
  if (story.chapter === 1 && story.subchapter === 1) {
    k.wait(0.2, async () => {
      generateDialog(ch1Dialog.intro, k.vec2(50), () => {
        createAlert(
          k.center().add(0, 250),
          { width: 650, height: 40, text: 24 },
          "Press 'E' to Interact, 'Tab' for Menu",
          5,
        );
      });
      gameState.set("story", "subchapter", 2);
      await saveGameData();
    });
  }

  //if player just defeated Sam, display chapter 1 ending dialog
  if (gameState.get().bossDefeated.chapter1 && story.chapter === 1 && story.subchapter === 5) {
    k.wait(0.2, async () => {
      generateDialog(ch1Dialog.end, k.vec2(50));
      gameState.set("story", "chapter", 2);
      gameState.set("story", "subchapter", 1);
      await saveGameData();
    });
  }

  //scene transitions
  player.onCollide("lair", async () => {
    //set and save player's new map and location
    playerState.set("map", "lair");
    playerState.set("position", { x: 290, y: 1450 });
    await savePlayerData();

    //load next scene
    k.go("lair");
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
  locationBanner(k.vec2(k.center().x, 650), "Skyflow Kingdom", 5);
}
