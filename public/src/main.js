import k from "./kaplayContext.js";

import mainMenu from "./scenes/mainMenu.js";
import level1 from "./scenes/level1.js";
import level2 from "./scenes/level2.js";
import level3 from "./scenes/level3.js";
import level4 from "./scenes/level4.js";

import survivor1 from "./scenes/survivor1.js";
import survivor2 from "./scenes/survivor2.js";
import survivor3 from "./scenes/survivor3.js";

import lair from "./scenes/lair.js";
import dungeon from "./scenes/dungeon.js";
import badlands from "./scenes/badlands.js";
import neonfactory from "./scenes/neonfactory.js";

import credits from "./scenes/credits.js";

//create scenes
const scenes = {
  mainMenu,
  level1,
  level2,
  level3,
  level4,
  survivor1,
  survivor2,
  survivor3,
  lair,
  dungeon,
  badlands,
  neonfactory,
  credits,
};

for (const sceneName in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("mainMenu");
