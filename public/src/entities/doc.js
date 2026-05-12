import k from "../kaplayContext.js";
import { gameState } from "../states/stateManager.js";
import { generateDialog } from "../systems/dialog.js";
import { getDocDialogue } from "../../assets/dialog/docDialogue.js";
import { interactPrompt } from "../systems/interaction.js";

export function spawnDoc(pos) {
  return [
    k.sprite("doc", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 5), 50, 50) }),
    k.pos(pos.x, pos.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    k.scale(0.65),
    "Doc",
    {
      dialogue: null,
      story: null,
      player: null,
      init(flip = true) {
        this.flipX = flip;
        this.dialogue = getDocDialogue();
        this.player = k.get("player")[0];
        interactPrompt(this);
      },

      interact() {
        // const dialogue = getDocDialogue();
        const story = gameState.get().story;

        if (this.player.pos.x < pos.x) this.flipX = true;
        else this.flipX = false;

        let chapterKey = "chapter" + story.chapter + "_" + story.subchapter;

        //if subchapter dialogue not found, default to subchapter 2
        if (!this.dialogue[chapterKey]) chapterKey = "chapter" + story.chapter + "_2";
        generateDialog(this.dialogue[chapterKey], k.vec2(50, 500));
      },
    },
  ];
}
