import k from "../kaplayContext.js";
import { gameState, playerState } from "../states/stateManager.js";
import { createLeaderboard } from "./leaderboard.js";
import { getLeaderboardEntries, saveGameData, savePlayerData } from "./saveload.js";
import { createAlert } from "./ui.js";
import { blinkEffect } from "./utils.js";

//interaction prompt
export function interactPrompt(
  gameObj,
  promptOffset = k.vec2(0, -60),
  promptScale = 0.7,
  areaSize = { width: 100, height: 80 },
  areaOffset = 0,
  displayText = "TALK",
  sprite = "talkPrompt",
  textSize = 24,
) {
  const interactArea = gameObj.add([
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0), areaSize.width, areaSize.height) }),
    k.pos(areaOffset),
    k.anchor("center"),
    "interactPrompt",
  ]);

  const prompt = interactArea.add([
    k.sprite(sprite),
    k.pos(promptOffset),
    k.scale(promptScale),
    k.anchor("center"),
    k.opacity(0),
    k.layer("foreground"),
  ]);

  const text = prompt.add([
    k.text(displayText, {
      font: "space",
      size: textSize,
      letterSpacing: 2.5,
    }),
    k.pos(0, -10),
    k.color(k.BLACK),
    k.anchor("center"),
    k.opacity(0),
  ]);

  interactArea.onCollide("player", () => {
    prompt.opacity = 1;
    text.opacity = 1;
  });
  interactArea.onCollideEnd("player", () => {
    prompt.opacity = 0;
    text.opacity = 0;
  });
  interactArea.on("Interact", () => {
    // console.log("Interacting with " + gameObj.tags[1]);
    gameObj.interact();
  });

  // return interactArea;
}

//level portal interaction
export function levelPortal(pos, levelName, callback) {
  return [
    k.sprite("owl"),
    k.pos(pos.x, pos.y),
    k.area(), //{ shape: new k.Rect(k.vec2(0, 25), 64, 64) }),
    k.anchor("center"),
    k.body({ isStatic: true }),
    "levelPortal",
    levelName,
    {
      init() {
        interactPrompt(
          this,
          k.vec2(0, -50),
          0.5,
          undefined,
          undefined,
          levelName,
          "interactPrompt",
        );
      },

      interact() {
        if (callback) callback();
      },
    },
  ];
}

//save point interaction
export function savePoint(pos) {
  return [
    k.sprite("quill"),
    k.pos(pos),
    k.area(),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.scale(1.5),
    "savePoint",
    {
      init() {
        interactPrompt(this);
      },

      interact() {
        k.pressButton("save");
      },
    },
  ];
}

//survivor portal interaction
export function survivorPortal(pos, callback) {
  return [
    // k.sprite("swordInStone"),
    k.rect(64, 64, { fill: false }),
    k.pos(pos.x, pos.y),
    k.area(), //{ shape: new k.Rect(k.vec2(0, 25), 64, 64) }),
    k.anchor("center"),
    k.body({ isStatic: true }),
    "survivorPortal",
    {
      init() {
        interactPrompt(
          this,
          k.vec2(0, -110),
          0.5,
          { width: 100, height: 150 },
          undefined,
          "BATTLE",
          "interactPrompt",
        );
      },

      interact() {
        if (callback) callback();
      },
    },
  ];
}

//leaderboard interaction
export function leaderboardPanel(pos) {
  return [
    // k.sprite("leaderboardFlag"),
    k.rect(32, 42, { fill: false }),
    k.pos(pos.x, pos.y),
    k.area(),
    k.scale(1.5),
    k.anchor("center"),
    k.body({ isStatic: true }),
    "leaderboard",
    {
      init() {
        // interactPrompt(this);
        interactPrompt(
          this,
          k.vec2(0, -85),
          0.4,
          { width: 50, height: 75 },
          undefined,
          "LEADERBOARD",
          "interactPrompt",
          20,
        );
      },

      async interact() {
        //get leaderboard entries
        const entries = await getLeaderboardEntries(10);

        //dummy data
        // const entries = [
        //   { rank: 1, name: "Redis", score: 6379 },
        //   { rank: 2, name: "Ha-ha", score: 4105 },
        //   { rank: 3, name: "ElBarto", score: 3870 },
        //   { rank: 4, name: "MillyH", score: 3570 },
        //   { rank: 5, name: "raPLH", score: 2250 },
        //   { rank: 6, name: "Dumb goblins", score: 120 },
        //   { rank: 7, name: "Max Power", score: 115 },
        //   { rank: 8, name: "HomerJay", score: 80 },
        //   { rank: 9, name: "Homerun", score: 75 },
        //   { rank: 10, name: "Mr.Plow", score: 50 },
        // ];

        // console.log("entries", entries);

        k.pressButton("pause");

        //create leaderboard ui
        createLeaderboard(
          {
            width: 700,
            height: k.height(),
            text: 18,
            padding: { side: 75, top: 50 },
          },
          entries,
        );
      },
    },
  ];
}

//embeddings interaction
export function embeddings(pos, callback) {
  return [
    k.sprite("embeddings", { anim: "activate" }),
    k.pos(pos.x, pos.y),
    k.area(), //{ shape: new k.Rect(k.vec2(0, 25), 64, 64) }),
    k.anchor("center"),
    k.body({ isStatic: true }),
    "embeddings",
    {
      init() {
        interactPrompt(
          this,
          k.vec2(0, -45),
          0.5,
          undefined,
          undefined,
          "EMBEDDINGS",
          "interactPrompt",
        );
      },

      interact() {
        if (callback) callback();

        this.destroy();
      },
    },
  ];
}

//embedding vat
export function vat(pos) {
  return [
    k.sprite("vat"),
    k.pos(pos.x, pos.y),
    k.area({ shape: new k.Rect(k.vec2(0), 28, 28) }),
    k.body({ isStatic: true }),
    k.anchor("bot"),
    k.scale(2),
    k.offscreen({ hide: true, pause: true, unpause: true }),
    k.health(50),
    k.opacity(),
    k.layer("main"),
    "vat",
    {
      init() {
        this.play("idle", { speed: k.randi(5, 11) });
        this.setEvents();
      },
      setEvents() {
        this.onHurt(() => {
          // console.log(`ogre hurt! Current HP: ${this.hp}`);
          blinkEffect(this);
          if (this.hp <= 0) {
            k.addKaboom(this.pos);
            k.shake(12);
            this.destroy();
          }
        });
      },
    },
  ];
}

//clickable sign
export function sign(pos, text, url) {
  return [
    k.sprite("sign", { anim: "idle" }),
    k.pos(pos),
    k.area(), //({ shape: new k.Rect(k.vec2(0, 20), 120, 40) }),
    k.body({ isStatic: true }),
    k.anchor("center"),
    "sign_" + url,
    {
      m_signText: null,
      init() {
        this.m_signText = this.add(signText(k.vec2(5, 5), text));
        this.onHover(() => {
          this.play("hover");
          this.m_signText.hover();
        });
        this.onHoverEnd(() => {
          this.play("idle");
          this.m_signText.default();
        });
        this.onClick(() => {
          window.open(url, "_blank");
        });
      },
    },
  ];
}

function signText(pos, text) {
  return [
    k.text(text, { size: 12, font: "redaction-bold" }),
    k.pos(pos),
    k.color(k.BLACK),
    k.anchor("center"),
    {
      default() {
        this.color = k.BLACK;
      },
      hover() {
        this.color = k.WHITE;
      },
    },
  ];
}

//clickable link
// export function url(pos, text, url) {
//   return [
//     k.text(text, { size: 16, font: "gameboy" }),
//     k.pos(pos),
//     k.color(k.WHITE), // Start with white text
//     k.area(),
//     text + " url",
//     {
//       init() {
//         this.onHover(() => {
//           // this.color = k.rgb(0, 0, 255); // Blue
//           this.color = k.rgb(255, 68, 56); // Redis Red
//           // this.textSize = 18;
//         });

//         this.onHoverEnd(() => {
//           this.color = k.rgb(255, 255, 255); // White
//           // this.textSize = 16;
//         });

//         // Open a new tab when the link is clicked
//         this.onClick(() => {
//           window.open(url, "_blank");
//         });
//       },
//     },
//   ];
// }

// export function chest(pos) {
//   return [
//     k.sprite("chest", { anim: "idle" }),
//     k.pos(pos),
//     k.area({ shape: new k.Rect(k.vec2(0), 35, 35) }),
//     k.anchor("center"),
//     k.body({ isStatic: true }),
//     k.scale(2),
//     "chest",
//     {
//       init() {
//         interactPrompt(this, "");
//       },

//       interact() {
//         if (gameState.get().chest.lair) {
//           this.play("activate");
//           createAlert(
//             { x: this.pos.x, y: this.pos.y - 150 },
//             { width: 300, height: 25, padding: 5, text: 10 },
//             { bg: k.rgb(0, 0, 0), ft: k.rgb(255, 255, 255) },
//             "Found power stone, atk +1",
//           );
//           playerState.set("attack", playerState.get().attack + 1);
//           gameState.set("treasure", "lair", false);
//           saveGameData();
//           savePlayerData();
//         }
//       },

//       activate() {
//         this.play("activate");
//       },
//     },
//   ];
// }

//generic interaction with callback
// export function interaction(
//   pos,
//   sprite,
//   callback,
//   displayText = "TALK",
//   promptOffset = k.vec2(0, -30),
// ) {
//   return [
//     k.sprite(sprite), //, { anim: "idle" }),
//     k.pos(pos.x, pos.y),
//     k.area(),
//     k.anchor("center"),
//     k.body({ isStatic: true }),
//     sprite,
//     {
//       init() {
//         interactPrompt(this);
//       },

//       interact() {
//         if (callback) callback();
//       },
//     },
//   ];
// }
