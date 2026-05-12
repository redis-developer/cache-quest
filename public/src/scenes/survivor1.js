import { fetchData, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions } from "../systems/collision.js";
import { MAX_ENEMIES } from "../systems/constants.js";
import { createExpBar, createScoreBoard, locationBanner } from "../systems/ui.js";
import { playerSurvivor } from "../entities/player.js";
import { spawnGoblinSurvivor } from "../entities/goblin.js";

export default async function survivor1(k) {
  //fetch data
  const mapData = await fetchData("./assets/data/grasslandSurvivor.json");
  const collisions = mapData.layers.find((layer) => layer.name === "collisions").objects;
  const enemies = mapData.layers.find((layer) => layer.name === "enemies").objects;
  const playerSkills = await fetchData("./assets/data/skills.json");

  //render base map layer and collisions
  setBackgroundColor("#47ABA9");

  const map = k.add([k.sprite("grasslandSurvivor")]);
  map.add([k.sprite("grasslandSurvivor1"), k.layer("foreground")]);

  generateCollisions(map, collisions);

  //render UI before entities
  const ui = k.add(["ui"]);
  createExpBar(ui);
  const scoreBoard = createScoreBoard(ui);
  const score = scoreBoard.get("score")[0];

  //interactions
  //using global input handler (k) to toggle pause
  k.onButtonPress("pause", () => (map.paused = !map.paused));

  //spawn player before enemies because they reference player
  const player = k.add(playerSurvivor(k.vec2(1600), playerSkills, scoreBoard.get("level")[0]));
  player.init();

  //spawn enemies
  //spawn goblins every 8 seconds
  const goblinTimer = setInterval(() => {
    const numberOfEnemies = map.get("enemy").length;
    console.log("number of enemies: " + numberOfEnemies);
    if (numberOfEnemies > MAX_ENEMIES) return;

    if (!map.paused) {
      // console.log("spawning goblins");
      for (const enemy of enemies) {
        map.add(spawnGoblinSurvivor(enemy, player, score)).init();
      }
    }
  }, 8000);
  // }, 8000);
  // setTimeout(() => clearInterval(goblinTimer), 300000);

  //scene triggers
  k.onSceneLeave(() => clearInterval(goblinTimer));

  //scene settings

  //runs every frame, 60 times a second
  k.onUpdate(async () => {
    //camera follow player
    k.setCamPos(player.pos);
  });

  //level title, disappears after 5 seconds
  locationBanner(k.vec2(k.center().x, 150), "Grassland survivor", 5);
}
