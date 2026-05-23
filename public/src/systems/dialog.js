import k from "../kaplayContext.js";
import { COLOR_GREEN, COLOR_PARCHMENT } from "./constants.js";

export async function generateDialog(content, pos, callback) {
  const dialogBox = k.add([k.sprite("dialog"), k.pos(pos), k.fixed(), k.layer("ui")]);

  const speakerName = dialogBox.add([
    k.pos(40, 30),
    k.color(COLOR_GREEN),
    k.text("", {
      font: "redaction-bold",
      width: 400,
      size: 32,
    }),
  ]);

  const textContainer = dialogBox.add([
    k.pos(40, 72),
    k.color(COLOR_PARCHMENT),
    k.text("", {
      font: "space",
      width: 1130,
      lineSpacing: 6,
      size: 28,
    }),
  ]);

  const prompt = dialogBox.add([
    k.rect(30, 30, { radius: 5, fill: false }),
    k.pos(1010, 160),
    k.outline(2, k.rgb(COLOR_PARCHMENT)),
    k.opacity(),
    k.timer(),
    k.anchor("left"),
    {
      init() {
        this.loop(0.5, () => {
          this.opacity = this.opacity === 0 ? 1 : 0;
          for (const t of this.get("input")) t.opacity = t.opacity === 0 ? 1 : 0;
        });
      },
    },
  ]);

  prompt.add([
    k.text(`\tE`, {
      font: "space",
      lineSpacing: 6,
      size: 18,
    }),
    k.color(COLOR_PARCHMENT),
    k.anchor("left"),
    "input",
  ]);

  prompt.add([
    k.text(`Continue`, {
      font: "space",
      lineSpacing: 6,
      size: 20,
    }),
    k.color(COLOR_PARCHMENT),
    k.pos(35, 0),
    k.anchor("left"),
  ]);

  prompt.init();

  let textArr = [];
  let index = 0;
  let advanceText = false;
  let isPaused = true;
  k.pressButton("pause");

  //display the first line of dialog from content[]
  textArr = content[index].split(":");
  speakerName.text = textArr[0];

  for (const char of textArr[1].trim()) {
    textContainer.text += char;
    await delay(10);
  }
  advanceText = true;

  const dialogButton = k.onButtonPress(
    ["interact", "attack", "projectile"], //, "menu", "up", "down", "left", "right"],
    async () => {
      // console.log("advancing dialogue");
      //if dialog is still being displayed
      if (!advanceText) return;

      index++;

      //if there are no more dialog, destroy dialog box and unfreeze player
      if (!content[index]) {
        dialogBox.destroy();

        k.pressButton("pause");
        isPaused = false;
        dialogButton.cancel();

        if (callback) callback();

        return;
      }

      //else if there are still more dialog, reset dialog text and display new dialog
      advanceText = false;
      textArr = content[index].split(":");
      speakerName.text = textArr[0];
      textContainer.text = "";

      for (const char of textArr[1].trim()) {
        textContainer.text += char;
        await delay(10);
      }
      advanceText = true;
    },
  );

  const skipButton = k.onButtonPress("esc", () => {
    dialogBox.destroy();
    dialogButton.cancel();
    skipButton.cancel();

    if (isPaused) k.pressButton("pause");
    if (callback) callback();

    return;
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
