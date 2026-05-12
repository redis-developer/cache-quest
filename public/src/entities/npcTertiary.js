import k from "../kaplayContext.js";
import { generateDialog } from "../systems/dialog.js";
import { interactPrompt } from "../systems/interaction.js";
import { getNpcDialogue } from "../../assets/dialog/npcDialogue.js";

export function spawnNpc(npc) {
  return [
    k.sprite(npc.type, { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 5), 64, 64) }),
    k.pos(npc.x, npc.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    k.scale(0.65),
    npc.name,
    npc.type,
    {
      dialogue: null,
      story: null,
      player: null,
      init() {
        this.flipX = k.chance(0.5);
        this.dialogue = getNpcDialogue();
        this.player = k.get("player")[0];
        interactPrompt(this);
      },

      interact() {
        if (this.player.pos.x < npc.x) this.flipX = true;
        else this.flipX = false;

        generateDialog(this.dialogue[npc.name], k.vec2(50, 500));
      },
    },
  ];
}
