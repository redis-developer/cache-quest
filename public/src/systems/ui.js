import k from "../kaplayContext.js";
import { playerState } from "../states/stateManager.js";
import {
  COLOR_CHARCOAL,
  COLOR_CHARCOAL02,
  COLOR_CHARCOAL04,
  COLOR_CHARCOAL05,
  COLOR_GOLD,
  COLOR_PARCHMENT,
  COLOR_RUST,
} from "./constants.js";

export async function createMenu(player) {
  if (player.paused && !player.menuOpen) return;
  if (player.menuOpen) {
    player.menuOpen = false;
    k.pressButton("pause");

    for (const m of k.get("menu")) m.destroy();
  } else {
    player.menuOpen = true;
    k.pressButton("pause");
    const menu = k.add([
      //transluscent background
      k.rect(k.width(), k.height()),
      k.color(k.BLACK),
      k.fixed(),
      k.opacity(0.4),
      k.layer("ui"),
      "menu",
    ]);
    if (player.tags.includes("dungeon")) {
      //create actions menu
      menu.add(createModal(k.center(), { width: 1100, height: 560 }));
      const VOFFSET = 0;

      menu.add([
        k.text(`Username:\n\nSession ID:`, {
          font: "space",
          letterSpacing: 3,
          size: 20,
        }),
        k.pos(k.center().add(-460, VOFFSET - 205)),
        k.color(k.WHITE),
        // k.anchor("topright"),
      ]);

      menu.add([
        k.text(`${playerState.get().name}\n\n${playerState.get().id}`, {
          font: "space",
          letterSpacing: 3,
          size: 20,
        }),
        k.pos(k.center().add(-220, VOFFSET - 205)),
        k.color(k.WHITE),
      ]);

      menu.add([
        k.sprite("actions"),
        k.scale(0.5),
        k.pos(k.center().add(0, VOFFSET)),
        k.anchor("center"),
      ]);
      const skillUnlocked = playerState.get().skillUnlocked;

      menu.add([
        k.sprite("actions-options", { frame: skillUnlocked.shuriken ? 1 : 0 }),
        k.pos(k.center().add(-465, VOFFSET + 130)),
        k.scale(0.5),
      ]);

      menu.add([
        k.sprite("actions-options", { frame: skillUnlocked.shieldAura ? 3 : 2 }),
        k.pos(k.center().add(15, VOFFSET + 50)),
        k.scale(0.5),
      ]);

      const btnCopy = await createCopyButton(player.pos);

      menu.onButtonPress("esc", () => {
        player.menuOpen = false;
        k.pressButton("pause");
        menu.destroy();
        btnCopy.destroy();
      });
    } else if (player.tags.includes("survivor")) {
      //create survivor menu
      menu.add(createModal(k.center(), { width: 850, height: 500 }));

      menu.add([
        k.text("Survivor Stats", {
          font: "redaction-bold",
          letterSpacing: 5,
          size: 40,
        }),
        k.pos(k.center().add(0, -180)),
        k.color(COLOR_GOLD),
        k.anchor("center"),
      ]);

      menu.add([
        k.text(`Username:\n\nLevel:\n\nSkills:`, {
          font: "space",
          letterSpacing: 3,
          size: 20,
        }),
        k.pos(k.center().add(-350, -140)),
        k.color(k.WHITE),
        // k.anchor("topright"),
      ]);

      menu.add([
        k.text(`${playerState.get().name}\n\n${playerState.get().leaderboard}`, {
          font: "space",
          letterSpacing: 3,
          size: 20,
        }),
        k.pos(k.center().add(0, -140)),
        k.color(k.WHITE),
      ]);

      const playerSkills = Object.values(player.skills);
      // console.log(playerSkills);

      for (let i = 0; i < playerSkills.length; i++) {
        if (!playerSkills[i].unlocked) {
          const skill = menu.add([
            k.text(`${playerSkills[i].name}`, {
              font: "space",
              letterSpacing: 3,
              size: 20,
            }),
            k.pos(k.center().add(-250 + i * 250, -10)),
            k.color(k.WHITE),
            k.anchor("center"),
          ]);

          //skill stats
          skill.add([
            k.rect(170, 55, { radius: 4 }),
            k.pos(0, 30),
            k.color(COLOR_CHARCOAL05),
            k.outline(2, k.rgb(COLOR_CHARCOAL04)),
            k.anchor("top"),
          ]);

          skill.add([
            k.text(`LOCKED`, {
              font: "space",
              letterSpacing: 3,
              size: 18,
            }),
            k.pos(0, 50),
            k.color(k.WHITE),
            k.anchor("top"),
          ]);

          continue;
        }

        //skill name
        const skill = menu.add([
          k.text(`${playerSkills[i].name}`, {
            font: "space",
            letterSpacing: 3,
            size: 20,
          }),
          k.pos(k.center().add(-250 + i * 250, -10)),
          k.color(k.WHITE),
          k.anchor("center"),
        ]);

        //skill stats
        skill.add([
          k.rect(170, 130, { radius: 4 }),
          k.pos(0, 30),
          k.color(COLOR_CHARCOAL05),
          k.outline(2, k.rgb(COLOR_CHARCOAL04)),
          k.anchor("top"),
        ]);

        if (playerSkills[i].stats.cooldown) {
          skill.add([
            k.text(
              `DMG: ${playerSkills[i].stats.damage}\n\nRNG: ${playerSkills[i].stats.range}\n\nCD: ${playerSkills[i].stats.cooldown / -1000}s`,
              {
                font: "space",
                letterSpacing: 3,
                size: 18,
              },
            ),
            k.pos(0, 50),
            k.color(k.WHITE),
            k.anchor("top"),
          ]);
        } else {
          skill.add([
            k.text(`DMG: ${playerSkills[i].stats.damage}\n\nRNG: ${playerSkills[i].stats.range}`, {
              font: "space",
              letterSpacing: 3,
              size: 18,
            }),
            k.pos(0, 50),
            k.color(k.WHITE),
            k.anchor("top"),
          ]);
        }
      }

      menu.onButtonPress("esc", () => {
        player.menuOpen = false;
        k.pressButton("pause");
        menu.destroy();
      });
    }
  }
}

async function createCopyButton(playerPos) {
  await k.wait(0.5);
  const button = k.add([
    k.rect(40, 18, { radius: 3 }),
    k.pos(k.getCamPos().add(230, -86)),
    k.color(COLOR_GOLD),
    k.outline(1),
    k.area(),
    k.anchor("center"),
    k.layer("ui"),
    "menu",
  ]);

  //button text
  button.add([
    k.text("Copy", {
      font: "space",
      size: 12,
    }),
    k.color(k.BLACK),
    k.anchor("center"),
  ]);

  button.onHover(() => {
    button.color = k.rgb(COLOR_PARCHMENT);
  });

  button.onHoverEnd(() => {
    button.color = k.rgb(COLOR_GOLD);
  });

  button.onClick(async () => {
    const data = { username: playerState.get().name, session: playerState.get().id };
    const prettyJSON = JSON.stringify(data, null, 2);
    console.log(data);

    try {
      await navigator.clipboard.writeText(prettyJSON);
      createAlert(
        k.center().add(0, 235),
        { width: 550, height: 40, text: 24 },
        "Username and session ID copied",
        3,
      );
    } catch (err) {
      const m_alert = k.get("alert")[0];
      if (m_alert) m_alert.destroy();

      createAlert(
        k.center().add(0, 235),
        { width: 550, height: 40, text: 24 },
        "Failed to copy",
        3,
      );

      console.error("Failed to copy: ", err);
    }
  });

  return button;
}

export function createModal(pos, size) {
  return [
    k.sprite("menu", { width: size.width, height: size.height }),
    k.pos(pos.x, pos.y),
    k.anchor("center"),
    k.fixed(),
    k.layer("ui"),
  ];
}

//location banner
export function locationBanner(pos, locationName, duration) {
  const title = k.add([
    k.sprite("banner"),
    k.pos(pos),
    k.anchor("center"),
    k.fixed(),
    k.timer(),
    k.layer("ui"),
    "title",
  ]);

  title.add([
    k.text(locationName, { size: 32, font: "redaction-bold", align: "center" }),
    // k.pos(0, -10),
    k.color("#7a4323"),
    k.anchor("center"),
  ]);

  title.wait(duration, () => title.destroy());
}

//location scroll
export function locationScroll(locationName, duration) {
  const title = k.add([
    k.sprite("scroll"),
    k.pos(140, 550),
    k.anchor("center"),
    k.fixed(),
    k.timer(),
    k.layer("ui"),
    "title",
  ]);

  title.add([
    k.text(locationName, {
      size: 26,
      font: "redaction",
      letterSpacing: 2,
      align: "center",
    }),
    k.pos(10, -5),
    k.color(k.BLACK),
    k.anchor("center"),
  ]);

  title.wait(duration, () => title.destroy());
}

export function healthBar(size) {
  return [
    k.pos(-size.width / 2, 35),
    k.rect(size.width, size.height, { radius: 1 }),
    k.color(COLOR_CHARCOAL),
    k.layer("ui"),
    k.outline(6),
    "healthBar",
    {
      currentPercent: 0,
      changeThreshold: 0.05,

      refresh(percent) {
        //don't refresh ui if change is less than threshold
        if (Math.abs(this.currentPercent - percent) < this.changeThreshold) return;

        const fill = this.get("fillBar")[0];
        if (fill) fill.destroy();

        this.add(
          fillBar({ width: size.width * percent, height: size.height, radius: 0 }, COLOR_RUST),
        );
        this.currentPercent = percent;
      },
    },
  ];
}

export function createScoreBoard(ui) {
  const container = ui.add([
    k.rect(150, 75, { radius: 5 }),
    k.pos(10, 50),
    k.color(COLOR_CHARCOAL),
    k.outline(2, k.rgb(COLOR_PARCHMENT)),
    k.fixed(),
    k.layer("ui"),
    "scoreBoard",
  ]);

  container.add([
    k.text("SCORE: 0", {
      font: "space",
      size: 14,
    }),
    k.pos(20, 15),
    k.color(COLOR_PARCHMENT),
    "score",
    {
      refresh(newScore) {
        this.text = "SCORE: " + newScore;
      },
    },
  ]);

  container.add([
    k.text("LEVEL: 1", {
      font: "space",
      size: 14,
    }),
    k.pos(20, 40),
    k.color(COLOR_PARCHMENT),
    "level",
    {
      refresh(level) {
        this.text = "LEVEL: " + level;
      },
    },
  ]);

  return container;
}

export function createExpBar(ui) {
  const container = ui.add([
    k.rect(1280, 38),
    k.color(COLOR_CHARCOAL),
    k.pos(0),
    k.fixed(),
    k.layer("ui"),
    "expBarContainer",
  ]);

  container.add([
    k.text("NEXT LEVEL: ", {
      font: "space",
      size: 14,
    }),
    k.color(COLOR_PARCHMENT),
    k.pos(20, 12),
  ]);

  container.add(expBar({ x: 120, y: 12 }, { width: 1000, height: 15 }));
}

function expBar(pos, size) {
  return [
    k.pos(pos.x, pos.y),
    k.rect(size.width, size.height, { radius: 2 }),
    k.color(COLOR_CHARCOAL04),
    k.fixed(),
    k.layer("ui"),
    "expBar",
    {
      refresh(percent) {
        const fill = this.get("fillBar")[0];
        if (fill) fill.destroy();
        this.add(
          fillBar(
            { width: size.width * percent, height: size.height, radius: 2 },
            COLOR_CHARCOAL02,
          ),
        );
      },
    },
  ];
}

function fillBar(size, color) {
  return [k.rect(size.width, size.height, { radius: size.radius }), k.color(color), "fillBar"];
}

//a notification
export function createAlert(pos, size, text, duration) {
  const alert = k.add([
    k.rect(size.width, size.height, { radius: 5 }),
    k.pos(pos),
    k.color(COLOR_GOLD),
    k.outline(2, k.rgb(k.BLACK)),
    k.timer(),
    k.anchor("center"),
    k.fixed(),
    k.layer("ui"),
    "alert",
  ]);

  alert.add([
    k.text(text, { font: "space", size: size.text, lineSpacing: 8 }),
    k.color(k.BLACK),
    k.anchor("center"),
  ]);
  if (duration > 0) alert.wait(duration, () => alert.destroy());
}

//gameover notification
export function gameOver(size, score, highscore) {
  const gameOverPanel = k.add([
    k.rect(size.width, size.height, { radius: 10 }),
    k.pos(k.center()),
    k.color(COLOR_CHARCOAL),
    k.outline(2, k.rgb(COLOR_PARCHMENT)),
    k.fixed(),
    k.anchor("center"),
    k.layer("ui"),
    "gameOver",
  ]);

  const ALERT_HEIGHT = 50;
  const alertText = highscore ? "NEW HIGH SCORE" : "TRY AGAIN";

  const alert = gameOverPanel.add([
    k.rect(size.width * 0.75, ALERT_HEIGHT, { radius: 8 }),
    k.pos(0, -size.height / 2 - ALERT_HEIGHT * 0.35),
    k.color(COLOR_GOLD),
    k.outline(2, k.rgb(k.BLACK)),
    k.anchor("center"),
    "alert",
  ]);

  alert.add([
    k.text(alertText, { font: "space", size: size.text }),
    k.color(k.BLACK),
    k.anchor("center"),
  ]);

  gameOverPanel.add([k.sprite("skullCross"), k.pos(0, -85), k.anchor("center"), k.scale(0.9)]);

  gameOverPanel.add([
    k.text("You died.", {
      font: "redaction-bold",
      size: size.text * 2,
    }),
    k.pos(0),
    k.color(COLOR_PARCHMENT),
    k.anchor("center"),
  ]);

  gameOverPanel.add([
    k.text("SCORE: " + score, {
      font: "space",
      size: size.text,
    }),
    k.pos(0, 65),
    k.color(COLOR_PARCHMENT),
    k.anchor("center"),
  ]);

  gameOverPanel.add([
    k.text("PRESS ENTER TO CONTINUE", { font: "space", size: size.text * 0.75 }),
    k.pos(0, 120),
    k.color(COLOR_PARCHMENT),
    k.anchor("center"),
  ]);
}

export function gameOverDungeon(size) {
  const gameOverPanel = k.add([
    k.rect(size.width, size.height, { radius: 10 }),
    k.pos(k.center()),
    k.color(COLOR_CHARCOAL),
    k.outline(2, k.rgb(COLOR_PARCHMENT)),
    k.fixed(),
    k.anchor("center"),
    k.layer("ui"),
    "gameOver",
  ]);

  gameOverPanel.add([k.sprite("skullCross"), k.pos(0, -60), k.anchor("center"), k.scale(0.9)]);

  gameOverPanel.add([
    k.text("Game over.", {
      font: "redaction-bold",
      size: size.text * 2,
    }),
    k.pos(0, 15),
    k.color(COLOR_PARCHMENT),
    k.anchor("center"),
  ]);

  gameOverPanel.add([
    k.text("PRESS ENTER TO TRY AGAIN", { font: "space", size: size.text * 0.75 }),
    k.pos(0, 75),
    k.color(COLOR_PARCHMENT),
    k.anchor("center"),
  ]);
}

function uiBackground() {
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.BLACK),
    k.fixed(),
    k.opacity(0.4),
    k.layer("ui"),
  ]);
}
