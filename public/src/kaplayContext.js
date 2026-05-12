import kaplay from "../lib/kaplay4000-a26.mjs";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false, //Optimization: avoid global namespace
  crisp: true,
  // pixelDensity: 2,
  texFilter: "linear",
  debug: true,
  buttons: {
    up: {
      keyboard: ["up", "w"],
      gamepad: "dpad-up",
    },
    down: {
      keyboard: ["down", "s"],
      gamepad: "dpad-down",
    },
    left: {
      keyboard: ["left", "a"],
      gamepad: "dpad-left",
    },
    right: {
      keyboard: ["right", "d"],
      gamepad: "dpad-right",
    },
    menu: {
      keyboard: "tab",
      gamepad: "north",
    },
    interact: {
      keyboard: "e",
      gamepad: "west",
    },
    attack: {
      keyboard: "space",
      gamepad: "east",
    },
    projectile: {
      keyboard: "f",
      gamepad: "south",
    },
    shield: {
      keyboard: "shift",
      gamepad: ["ltrigger", "rtrigger"],
    },
    save: {
      keyboard: "!",
    },
    debug: {
      keyboard: ";",
    },
    pause: {
      // keyboard: "p",
      // gamepad: "select",
    },
    start: {
      keyboard: "enter",
      gamepad: "start",
    },
    esc: {
      keyboard: "escape",
      gamepad: ["home", "select"],
    },
  },
});

k.setLayers(["background", "main", "foreground", "ui"], "main");

/// load assets \\\

//maps
//main level
k.loadSprite("grassland", "assets/maps/grassland.png");
k.loadSprite("grassland1", "assets/maps/grassland1.png");
k.loadSprite("mountains", "assets/maps/mountains.png");
k.loadSprite("mountains1", "assets/maps/mountains1.png");
k.loadSprite("oasis", "assets/maps/oasis.png");
k.loadSprite("oasis1", "assets/maps/oasis1.png");
k.loadSprite("neonEntrance", "assets/maps/neonEntrance.png");
//dungeon
k.loadSprite("lair", "assets/maps/lair.png");
k.loadSprite("dungeon", "assets/maps/dungeon.jpg");
k.loadSprite("dungeon1", "assets/maps/dungeon1.png");
k.loadSprite("badlands", "assets/maps/badlands.png");
k.loadSprite("badlands1", "assets/maps/badlands1.png");
k.loadSprite("neonFactory", "assets/maps/neonFactory.png");
k.loadSprite("neonFactory1", "assets/maps/neonFactory1.png");
//survivor
k.loadSprite("grasslandSurvivor", "assets/maps/grasslandSurvivor.png");
k.loadSprite("grasslandSurvivor1", "assets/maps/grasslandSurvivor1.png");
k.loadSprite("mountainsSurvivor", "assets/maps/mountainsSurvivor.png");
k.loadSprite("mountainsSurvivor1", "assets/maps/mountainsSurvivor1.png");
k.loadSprite("badlandsSurvivor", "assets/maps/badlandsSurvivor.png");

//ui
k.loadFont("space", "assets/ui/SpaceMono.ttf", { filter: "linear" });
k.loadFont("redaction-bold", "assets/ui/Redaction35-Bold.otf", { filter: "linear" });
k.loadFont("redaction", "assets/ui/Redaction35.otf", { filter: "linear" });
k.loadSprite("title", "assets/ui/title.png");
k.loadSprite("logo", "assets/ui/logo.svg");
k.loadSprite("dialog", "assets/ui/dialogBox.png");
k.loadSprite("border", "assets/ui/border.png");
k.loadSprite("interactPrompt", "assets/ui/interactPrompt.png");
k.loadSprite("talkPrompt", "assets/ui/talkPrompt.png");
k.loadSprite("banner", "assets/ui/banner.png");
k.loadSprite("scroll", "assets/ui/scroll.png");
k.loadSprite("skullCross", "assets/ui/skullCross.png");
k.loadSprite("actions", "assets/ui/actions.png");
k.loadSprite("actions-options", "assets/ui/actions-options.png", {
  sliceX: 1,
  sliceY: 4,
});
k.loadSprite("menu", "assets/ui/menu.png", {
  slice9: { left: 64, right: 64, top: 64, bottom: 64 },
});

//interaction
k.loadSprite("owl", "assets/objects/owl.png");
// k.loadSprite("quill", "assets/objects/quill.png");
k.loadSprite("sign", "assets/objects/sign.png", {
  sliceX: 2,
  anims: {
    idle: 0,
    hover: 1,
  },
});

k.loadSprite("vat", "assets/objects/vat.png", {
  sliceX: 10,
  anims: {
    idle: { from: 0, to: 9, speed: 10, loop: true },
  },
});

// k.loadSprite("chest", "assets/objects/chest.png", {
//   sliceX: 2,
//   anims: {
//     idle: 0,
//     activate: 1,
//   },
// });

//characters
//main
k.loadSprite("player", "assets/characters/player.png", {
  sliceX: 6,
  sliceY: 12,
  anims: {
    "idle-side": { from: 0, to: 5, speed: 10, loop: true },
    "idle-down": { from: 6, to: 11, speed: 10, loop: true },
    "idle-up": { from: 12, to: 17, speed: 10, loop: true },
    "run-side": { from: 18, to: 23, speed: 10, loop: true },
    "run-down": { from: 24, to: 29, speed: 10, loop: true },
    "run-up": { from: 30, to: 35, speed: 10, loop: true },
    "attack1-side": { from: 36, to: 41, speed: 20, loop: false },
    "attack2-side": { from: 42, to: 47, speed: 20, loop: false },
    "attack1-down": { from: 48, to: 53, speed: 20, loop: false },
    "attack2-down": { from: 54, to: 59, speed: 20, loop: false },
    "attack1-up": { from: 60, to: 65, speed: 20, loop: false },
    "attack2-up": { from: 66, to: 71, speed: 20, loop: false },
    "jump": 18,
    "fall": 38,
  },
});

k.loadSprite("doc", "assets/characters/doc.png", {
  sliceX: 6,
  sliceY: 2,
  anims: {
    idle: { from: 0, to: 5, speed: 10, loop: true },
    heal: { from: 6, to: 10, speed: 10, loop: true },
  },
});

k.loadSprite("sam", "assets/characters/sam.png", {
  sliceX: 10,
  sliceY: 4,
  anims: {
    "idle": { from: 0, to: 9, speed: 10, loop: true },
    "run": { from: 30, to: 36, speed: 10, loop: true },
    "attack": { from: 10, to: 19, speed: 10, loop: false },
    "guard-in": { from: 20, to: 25, speed: 10, loop: false },
    "guard-out": { from: 25, to: 29, speed: 10, loop: false },
  },
});

k.loadSprite("melvin", "assets/characters/melvin.png", {
  sliceX: 9,
  sliceY: 3,
  anims: {
    idle: { from: 0, to: 8, speed: 10, loop: true },
    run: { from: 9, to: 16, speed: 10, loop: true },
    attack: { from: 17, to: 26, speed: 10, loop: false },
  },
});

k.loadSprite("kallie", "assets/characters/kallie.png", {
  sliceX: 7,
  sliceY: 3,
  anims: {
    idle: { from: 0, to: 6, speed: 10, loop: true },
    run: { from: 7, to: 12, speed: 10, loop: true },
    attack: { from: 13, to: 20, speed: 10, loop: false },
  },
});

//enemies
k.loadSprite("goblin", "assets/characters/goblin.png", {
  sliceX: 6,
  sliceY: 3,
  anims: {
    idle: { from: 0, to: 5, speed: 10, loop: true },
    run: { from: 6, to: 11, speed: 10, loop: true },
    attack: { from: 12, to: 17, speed: 10, loop: false },
  },
});

k.loadSprite("spider", "assets/characters/spider.png", {
  sliceX: 8,
  sliceY: 3,
  anims: {
    idle: { from: 0, to: 7, speed: 10, loop: true },
    attack: { from: 8, to: 15, speed: 10, loop: false },
    run: { from: 16, to: 20, speed: 10, loop: true },
  },
});

k.loadSprite("skeleton", "assets/characters/skeleton.png", {
  sliceX: 7,
  sliceY: 4,
  anims: {
    idle: { from: 0, to: 6, speed: 10, loop: true },
    attack: { from: 7, to: 13, speed: 10, loop: false },
    guard: { from: 14, to: 20, speed: 10, loop: true },
    run: { from: 21, to: 26, speed: 10, loop: true },
  },
});

k.loadSprite("vampire", "assets/characters/vampire.png", {
  sliceX: 8,
  sliceY: 3,
  anims: {
    idle: { from: 0, to: 7, speed: 10, loop: true },
    attack: { from: 8, to: 15, speed: 10, loop: false },
    run: { from: 16, to: 18, speed: 10, loop: true },
  },
});

k.loadSprite("ogre", "assets/characters/ogre.png", {
  sliceX: 8,
  sliceY: 5,
  anims: {
    idle: { from: 0, to: 7, speed: 10, loop: true },
    run: { from: 8, to: 15, speed: 10, loop: true },
    attack: { from: 16, to: 21, speed: 10, loop: false },
    recover: { from: 22, to: 30, speed: 10, loop: true },
    death: { from: 31, to: 39, speed: 10, loop: false },
  },
});

//survivor enemies
k.loadSprite("goblinSurvivor", "assets/characters/goblinSurvivor.png", {
  sliceX: 6,
  anims: {
    run: { from: 0, to: 5, speed: 10, loop: true },
    idle: 0,
  },
});

k.loadSprite("spiderSurvivor", "assets/characters/spiderSurvivor.png", {
  sliceX: 4,
  anims: {
    run: { from: 0, to: 3, speed: 12, loop: true },
    idle: 0,
  },
});

k.loadSprite("skeletonSurvivor", "assets/characters/skeletonSurvivor.png", {
  sliceX: 6,
  anims: {
    run: { from: 0, to: 5, speed: 12, loop: true },
    idle: 0,
  },
});

k.loadSprite("vampireSurvivor", "assets/characters/vampireSurvivor.png", {
  sliceX: 5,
  anims: {
    run: { from: 0, to: 4, speed: 10, loop: true },
    idle: 0,
  },
});

//npcs
k.loadSprite("pawn", "assets/characters/pawn.png", {
  sliceX: 8,
  anims: {
    idle: { from: 0, to: 7, speed: 10, loop: true },
  },
});

k.loadSprite("gnome", "assets/characters/gnome.png", {
  sliceX: 8,
  anims: {
    idle: { from: 0, to: 7, speed: 10, loop: true },
  },
});

k.loadSprite("lizard", "assets/characters/lizard.png", {
  sliceX: 7,
  anims: {
    idle: { from: 0, to: 6, speed: 10, loop: true },
  },
});

k.loadSprite("snake", "assets/characters/snake.png", {
  sliceX: 8,
  anims: {
    idle: { from: 0, to: 7, speed: 10, loop: true },
  },
});

k.loadSprite("gnoll", "assets/characters/gnoll.png", {
  sliceX: 6,
  anims: {
    idle: { from: 0, to: 5, speed: 10, loop: true },
  },
});

//fx\\
k.loadSprite("swordBeam", "assets/fx/swordBeam.png", {
  sliceX: 5,
  sliceY: 3,
  anims: {
    "activate-side": { from: 0, to: 4, speed: 8 },
    "activate-down": { from: 5, to: 9, speed: 8 },
    "activate-up": { from: 10, to: 14, speed: 8 },
  },
});

k.loadSprite("shieldAura", "assets/fx/shieldAura.png", {
  sliceX: 5,
  anims: {
    activate: { from: 0, to: 4, speed: 10, loop: true },
  },
});

k.loadSprite("projectiles", "assets/fx/projectiles.png", {
  sliceX: 5,
  sliceY: 2,
  anims: {
    fireball: { from: 0, to: 4, speed: 10, loop: true },
    shuriken: { from: 5, to: 6, speed: 10, loop: true },
    fireShuriken: { from: 7, to: 8, speed: 10, loop: true },
  },
});

k.loadSprite("embeddings", "assets/fx/embeddings.png", {
  sliceX: 6,
  sliceY: 6,
  anims: { activate: { from: 0, to: 35, speed: 10, loop: true } },
});

k.loadSprite("enemySpell", "assets/fx/enemySpell.png", {
  sliceX: 7,
  anims: { activate: { from: 0, to: 6, speed: 10, loop: false } },
});

k.loadSprite("drops", "assets/fx/drops.png", { sliceX: 4 });

export default k;
