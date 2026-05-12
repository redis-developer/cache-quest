import { fetchData, screenFx, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions, generateTriggers } from "../systems/collision.js";
import { generateDialog } from "../systems/dialog.js";
import { MAX_ENEMIES } from "../systems/constants.js";
import { playerDungeon } from "../entities/player.js";
import { spawnGoblinSurvivor } from "../entities/goblin.js";
import { spawnSpiderSurvivor } from "../entities/spider.js";
import { spawnSkeletonSurvivor } from "../entities/skeleton.js";
import { spawnVampireSurvivor } from "../entities/vampire.js";
import { embeddings, vat } from "../systems/interaction.js";
import { spawnSamAlly } from "../entities/sam.js";
import { createAlert, locationScroll } from "../systems/ui.js";
import { spawnDoc } from "../entities/doc.js";
import { gameState, playerState } from "../states/stateManager.js";
import { spawnMelvinAlly } from "../entities/melvin.js";
import { spawnKallieAlly } from "../entities/kallie.js";
import { spawnOgre } from "../entities/ogre.js";
import { getChapterFourDialog } from "../../assets/dialog/chapter4.js";

export default async function neonfactory(k) {
  //fetch data
  const mapData = await fetchData("./assets/data/neonFactory.json");
  const collisions = mapData.layers.find((layer) => layer.name === "collisions").objects;
  const triggers = mapData.layers.find((layer) => layer.name === "triggers").objects;
  const enemies = mapData.layers.find((layer) => layer.name === "enemies").objects;
  const goblins = enemies.filter((obj) => obj.name === "goblin");
  const spiders = enemies.filter((obj) => obj.name === "spider");
  const skeletons = enemies.filter((obj) => obj.name === "skeleton");
  const vampires = enemies.filter((obj) => obj.name === "vampire");
  const ogreData = enemies.find((obj) => obj.name === "Ogre");
  const main = mapData.layers.find((layer) => layer.name === "main").objects;
  const docData = main.find((obj) => obj.name === "Doc");
  const samData = main.find((obj) => obj.name === "Sam");
  const melvinData = main.find((obj) => obj.name === "Melvin");
  const kallieData = main.find((obj) => obj.name === "Kallie");
  const embedData1 = main.find((obj) => obj.name === "embedding1");
  const embedData2 = main.find((obj) => obj.name === "embedding2");
  const embedData3 = main.find((obj) => obj.name === "embedding3");
  const vatsUpper = main.filter((obj) => obj.type === "vat");
  const vatsLower = main.filter((obj) => obj.type === "vatl");

  //get dialog
  const ch4Dialog = getChapterFourDialog();

  const playerSkills = await fetchData("./assets/data/skills.json");
  //render base map layer and collisions
  setBackgroundColor("#0b131e");
  const screen = k.add(screenFx());

  const map = k.add([k.sprite("neonFactory")]);

  generateCollisions(map, collisions);

  //render UI before entities

  //spawn player first because other entities will reference player
  const player = k.add(playerDungeon());
  player.init();
  player.scaleTo(0.7);

  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  if (gameState.get().story.chapter === 4 && !gameState.get().bossDefeated.chapter4) {
    //spawn allies
    const doc = map.add(spawnDoc(docData));
    doc.init();
    doc.play("heal");

    const sam = map.add(spawnSamAlly(samData));
    sam.init();

    const melvin = map.add(spawnMelvinAlly(melvinData));
    melvin.flipX = true;
    melvin.init();

    const kallie = map.add(spawnKallieAlly(kallieData));
    kallie.init();

    //spawn enemies
    const ogre = map.add(spawnOgre(ogreData));
    ogre.init();

    //spawn goblins every seconds
    const goblinTimer = setInterval(() => {
      if (map.get("enemy").length > MAX_ENEMIES) return;
      if (!map.paused) {
        // console.log("spawning goblins");
        for (const g of goblins) {
          //TODO: change target to Sam
          map.add(spawnGoblinSurvivor(g, sam)).init();
        }
      }
    }, 1000);

    //spawn spiders every 4 seconds
    const spiderTimer = setInterval(() => {
      if (map.get("enemy").length > MAX_ENEMIES) return;
      if (!map.paused) {
        // console.log("spawning spiders");
        for (const s of spiders) {
          map.add(spawnSpiderSurvivor(s, melvin)).init();
        }
      }
    }, 4000);

    // //after 10 seconds, spawn skeletons every 5 seconds
    let skeletonTimer;
    setTimeout(
      () =>
        (skeletonTimer = setInterval(() => {
          if (map.get("enemy").length > MAX_ENEMIES) return;
          if (!map.paused) {
            // console.log("spawning skeletons");
            for (const sk of skeletons) {
              map.add(spawnSkeletonSurvivor(sk, kallie)).init();
            }
          }
        }, 5000)),
      10000,
    );

    //interactions
    //vector embeddings vats
    for (const v of vatsUpper) map.add(vat(v)).init();
    for (const v of vatsLower) {
      const vt = map.add(vat(v));
      vt.init();
      vt.layer = "foreground";
    }

    //scene triggers
    generateTriggers(map, triggers);

    //triggers
    player.onCollide("gate1", () => {
      // k.pressButton("pause");
      sam.interact();
      createAlert(
        k.center(),
        { width: 550, height: 80, text: 24 },
        "Find the embeddings in this area\nand press 'E' to interact",
        5,
      );
      player.pos = player.pos.add(k.vec2(0, 30));
    });

    player.onCollide("gate2", () => {
      // k.pressButton("pause");
      melvin.interact();
      player.pos = player.pos.add(k.vec2(0, 30));
      createAlert(
        k.center(),
        { width: 550, height: 80, text: 24 },
        "Find the embeddings in this area\nand press 'E' to interact",
        5,
      );
    });

    player.onCollide("gate3", () => {
      // k.pressButton("pause");
      kallie.interact();
      player.pos = player.pos.add(k.vec2(0, 30));
      createAlert(
        k.center(),
        { width: 550, height: 80, text: 24 },
        "Find the embeddings in this area\nand press 'E' to interact",
        5,
      );
    });

    // embeddings
    map
      .add(
        embeddings(embedData1, () => {
          clearInterval(goblinTimer);
          player.skills.swordBeam.stats = playerSkills.swordBeam.statsMax;
          createAlert(
            k.center().add(0, -200),
            { width: 650, height: 40, text: 24 },
            "The embeddings powered up your Cache Beam",
            5,
          );
          screen.flash();
          gameState.set("story", "subchapter", 5);
          map.get("gate1")[0].destroy();
        }),
      )
      .init();

    map
      .add(
        embeddings(embedData2, () => {
          clearInterval(spiderTimer);
          player.skills.shuriken.stats = playerSkills.shuriken.statsMax;
          player.skills.shuriken.chance = 1;
          createAlert(
            k.center().add(0, -200),
            { width: 700, height: 40, text: 24 },
            "The embeddings super charged your projectiles",
            5,
          );
          screen.flash();
          gameState.set("story", "subchapter", 6);
          map.get("gate2")[0].destroy();
        }),
      )
      .init();

    map
      .add(
        embeddings(embedData3, () => {
          clearInterval(skeletonTimer);
          player.skills.shieldAura.stats = playerSkills.shieldAura.statsMax;
          player.skills.shieldAura.knockback = true;
          createAlert(
            k.center().add(0, -200),
            { width: 900, height: 40, text: 24 },
            "Your Hybrid Shield now knocks enemies back upon activation",
            5,
          );
          screen.flash();
          gameState.set("story", "subchapter", 7);
          map.get("gate3")[0].destroy();
        }),
      )
      .init();

    let vampireTimer;
    player.onCollide("factoryBoss", (trigger) => {
      generateDialog(ch4Dialog.factoryBoss, k.vec2(50, 500), () => {
        vampireTimer = setInterval(() => {
          if (map.get("enemy").length > 140) return;
          if (!map.paused) {
            // console.log("spawning spiders");
            for (const v of vampires) {
              map.add(spawnVampireSurvivor(v, player)).init();
            }
          }
        }, 2000);

        ogre.enterState("alert");
        trigger.destroy();
      });
    });

    ogre.onStateEnter("death", () => {
      if (vampireTimer) clearInterval(vampireTimer);

      //prevent player from leaving after boss defeat
      player.onCollide("gate4", () => {
        doc.interact();
        player.pos = player.pos.add(k.vec2(0, -30));
      });

      for (const v of map.get("vat")) {
        v.tag("enemy");
        v.onDestroy(() => {
          if (map.get("vat").length === 0)
            generateDialog(ch4Dialog.factoryBossDefeat, k.vec2(50), () => {
              playerState.set("map", "level4");
              playerState.set("position", { x: 580, y: 440 });
              k.go("level4");
            });
        });
      }
    });

    k.onSceneLeave(() => {
      clearInterval(goblinTimer);
      clearInterval(spiderTimer);
      clearInterval(skeletonTimer);
      if (vampireTimer) clearInterval(vampireTimer);
    });
  }

  //render foreground layer
  k.onDraw(() => k.drawSprite({ sprite: "neonFactory1" }));

  //scene settings
  k.setCamScale(1.5);
  k.pixelDensity = 1;

  //runs every frame, 60 times a second
  k.onUpdate(async () => {
    //camera follow player
    k.setCamPos(player.pos);
  });

  //level title, disappears after 5 seconds
  locationScroll("Neon\nFactory", 5);
}
