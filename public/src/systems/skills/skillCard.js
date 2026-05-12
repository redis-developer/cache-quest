import k from "../../kaplayContext.js";
import { skillUnlockArray } from "./skillManager.js";
import { COLOR_CHARCOAL05, COLOR_GOLD, COLOR_PARCHMENT } from "../constants.js";

export function createSkillCard(pos, size, skill) {
  const CENTER_X = size.width / 2;
  const BUTTON_HEIGHT = 40;
  const BUTTON_WIDTH = size.width - size.padding * 2;
  const BUTTON_VBOX_PAD = 160;
  const BUTTON_TEXT_SIZE = 18;
  const SPACING = 15;

  const card = k.add([
    k.sprite("menu", { width: size.width, height: size.height }),
    k.pos(pos.x, pos.y),
    k.layer("ui"),
    "skillCard",
  ]);

  //add skill name
  card.add([
    k.text(skill.name, {
      font: "redaction-bold",
      size: size.text,
    }),
    k.color(k.WHITE),
    k.pos(CENTER_X, size.padding + 40),
    k.anchor("center"),
  ]);

  const stats = Object.keys(skill.stats);

  //TODO: if all skills are maxed, create level up notification and grant currency
  //TODO: implement fakeMouse for gamepad
  //https://kaplayjs.com/docs/guides/fake_mouse/

  //if skill is unlocked
  if (skill.unlocked) {
    for (let i = 0; i < stats.length; i++) {
      //if skill stat is not maxed, create stats buttons
      if (skill.stats[stats[i]] < skill.statsMax[stats[i]]) {
        createButton(
          card,
          k.vec2(CENTER_X, (BUTTON_HEIGHT + SPACING) * i + BUTTON_VBOX_PAD),
          {
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            text: BUTTON_TEXT_SIZE,
          },
          "+ " + stats[i].toUpperCase(),
          { enabled: COLOR_GOLD, hover: COLOR_PARCHMENT },
          () => {
            console.log(`${skill.name} improved ${stats[i]}`);

            //increment stats
            skill.stats[stats[i]] += skill.statsIncrement[stats[i]];

            //re-initialize skill
            skillUnlockArray[skill.unlock]();
          },
        );
      } else {
        //else if skill is maxed, create void button
        createVoidButton(
          card,
          k.vec2(CENTER_X, (BUTTON_HEIGHT + SPACING) * i + BUTTON_VBOX_PAD),
          {
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            text: BUTTON_TEXT_SIZE,
          },
          stats[i].toUpperCase() + " MAXED",
        );
      }
    }
  } else {
    //else if skill is not unlocked, create unlock button
    createButton(
      card,
      k.vec2(CENTER_X, BUTTON_VBOX_PAD),
      {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        text: BUTTON_TEXT_SIZE,
      },
      "UNLOCK",
      { enabled: "#c9c9c9", hover: "#f3f3f3" },
      () => {
        //unlock player skill
        skill.unlocked = true;
        skillUnlockArray[skill.unlock]();
      },
    );
  }

  //do once, create skip button and translucent background
  if (skill.name === "Hybrid Shield") {
    createButton(
      card,
      k.vec2(CENTER_X, BUTTON_VBOX_PAD + (BUTTON_HEIGHT + SPACING) * 5.5),
      {
        width: size.width - size.padding / 2,
        height: BUTTON_HEIGHT,
        text: BUTTON_TEXT_SIZE,
      },
      "SKIP",
      { enabled: COLOR_GOLD, hover: COLOR_PARCHMENT },
      () => console.log("skipped skill level up"),
    );

    //translucent background
    k.add([
      k.rect(k.width(), k.height()),
      k.anchor("center"),
      k.color(k.BLACK),
      k.opacity(0.4),
      //attributes
      k.pos(k.center()),
      k.fixed(),
      k.layer("foreground"),
      "translucent",
    ]);
  }
}

function createButton(container, pos, size, text, color, handler) {
  const button = container.add([
    k.rect(size.width, size.height, { radius: 8 }),
    k.pos(pos),
    k.color(color.enabled),
    k.area(),
    k.outline(1),
    k.anchor("center"),
  ]);

  //button text
  button.add([
    k.text(text, {
      font: "space",
      size: size.text,
      letterSpacing: 3,
    }),
    // k.pos(0, -5),
    k.color(k.BLACK),
    k.anchor("center"),
  ]);

  button.onHover(() => {
    button.color = k.rgb(color.hover);
  });

  button.onHoverEnd(() => {
    button.color = k.rgb(color.enabled);
  });

  button.onClick(() => {
    // button.color = k.rgb(138, 153, 160); // Dusk 50%
    // button.color = k.rgb(22, 51, 65); // Dusk 90%
    handler();
    destroySkillCards();
  });
}

function createVoidButton(container, pos, size, text) {
  const button = container.add([
    k.rect(size.width, size.height, { radius: 8 }),
    k.pos(pos),
    k.color(COLOR_CHARCOAL05),
    k.area(),
    k.anchor("center"),
  ]);

  button.add([
    k.text(text, {
      font: "space",
      size: size.text,
    }),
    k.pos(0, -5),
    k.color(k.WHITE),
    k.anchor("center"),
  ]);
}

function destroySkillCards() {
  const skillCards = k.get("skillCard");
  for (const card of skillCards) card.destroy();

  // console.log(k.get("translucent"));
  k.get("translucent")[0].destroy();

  //TODO: remove fakeMouse
  //https://kaplayjs.com/docs/guides/fake_mouse/

  //unpause game
  k.pressButton("pause");
}
