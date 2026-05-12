import k from "../kaplayContext.js";
import { gameState } from "../states/stateManager.js";
import { generateDialog } from "../systems/dialog.js";
import { interactPrompt } from "../systems/interaction.js";
import { npcAttackHitbox } from "../systems/collision.js";
import { playAnimIfNotPlaying } from "../systems/utils.js";
import { getKallieDialogue } from "../../assets/dialog/kallieDialogue.js";

export function spawnKallie(pos) {
  return [
    k.sprite("kallie", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 5), 85, 110) }),
    k.pos(pos.x, pos.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    k.scale(0.8),
    "Kallie",
    {
      dialogue: null,
      init() {
        this.dialogue = getKallieDialogue();
        interactPrompt(this, k.vec2(5, -70), 0.6, { width: 120, height: 130 });
      },

      interact() {
        const story = gameState.get().story;
        let chapterKey = "chapter" + story.chapter + "_" + story.subchapter;

        //if subchapter dialogue not found, default to subchapter 2
        if (!this.dialogue[chapterKey]) chapterKey = "chapter" + story.chapter + "_2";

        generateDialog(this.dialogue[chapterKey], k.vec2(50, 500));
      },
    },
  ];
}

export function spawnKallieAlly(ally) {
  return [
    k.sprite("kallie", { anim: "idle" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 5), 85, 110),
      collisionIgnore: [
        // "wall",
        "trigger",
        "skill",
        "exp",
        "enemyAttackHitbox",
        "npcAttackHitbox",
        "interactPrompt",
      ],
    }),
    k.pos(ally.x, ally.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.scale(0.8),
    k.state("idle", ["idle", "detect", "attack"]),
    ally.name,
    ally.type,
    {
      id: ally.id,
      // speed: 100,
      attackPower: 150,
      isAttacking: false,
      detectDelay: 0.5,
      dialogue: null,

      init() {
        this.dialogue = getKallieDialogue();
        this.setBehavior();

        interactPrompt(this, k.vec2(5, -70), 0.6, { width: 120, height: 130 });
      },

      interact() {
        const story = gameState.get().story;
        let chapterKey = "chapter" + story.chapter + "_" + story.subchapter;

        //if subchapter dialogue not found, default to subchapter 2
        if (!this.dialogue[chapterKey]) chapterKey = "chapter" + story.chapter + "_2";

        generateDialog(this.dialogue[chapterKey], k.vec2(50, 500));
      },

      setBehavior() {
        let npcAtk = null; //ally attack collision
        // let target = null;

        this.onStateEnter("idle", async () => {
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(this.detectDelay);
          this.enterState("detect");
        });

        this.onStateEnter("detect", () => {
          const collisions = this.getCollisions();
          // console.log(collisions);
          if (collisions.length > 0) {
            for (const col of collisions) {
              if (col.target.tags.includes("enemy")) {
                // target = col.target; //save reference to target used to face this npc towards
                this.enterState("attack");
                break;
              } else this.enterState("idle");
            }
          } else this.enterState("idle");
        });

        this.onStateEnter("attack", async () => {
          // console.log("Sam attacking");

          // this.flipX = target.pos.x <= this.pos.x; //turn towards target
          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.2);
          npcAtk = this.add(npcAttackHitbox(k.vec2(0), k.vec2(170), this.attackPower));
        });

        this.onAnimEnd((anim) => {
          if (anim === "attack") {
            if (npcAtk) k.destroy(npcAtk); //remove attack collision
            this.isAttacking = false;
            this.enterState("idle");
          }
        });
      },
    },
  ];
}
