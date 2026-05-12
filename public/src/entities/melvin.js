import k from "../kaplayContext.js";
import { gameState } from "../states/stateManager.js";
import { generateDialog } from "../systems/dialog.js";
import { interactPrompt } from "../systems/interaction.js";
import { npcAttackHitbox } from "../systems/collision.js";
import { playAnimIfNotPlaying } from "../systems/utils.js";
import { getMelvinDialogue } from "../../assets/dialog/melvinDialogue.js";

export function spawnMelvin(pos) {
  return [
    k.sprite("melvin", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(-30, 0), 150, 100) }),
    k.pos(pos.x, pos.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    k.scale(0.8),
    "Melvin",
    {
      dialogue: null,
      init() {
        this.dialogue = getMelvinDialogue();
        interactPrompt(this, k.vec2(0, -75), 0.6, { width: 160, height: 120 });
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

export function spawnMelvinAlly(ally) {
  return [
    k.sprite("melvin", { anim: "idle" }),
    k.area({
      shape: new k.Rect(k.vec2(0), 150, 100),
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
    k.opacity(),
    k.scale(0.8),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("idle", ["idle", "detect", "alert", "attack"]),

    ally.name,
    ally.type,
    {
      id: ally.id,
      speed: 100,
      alertSpeed: 150,
      alertRange: 250,
      attackPower: 150,
      attackRange: 100,
      isAttacking: false,
      detectDelay: 0.7,
      dialogue: null,

      init() {
        this.dialogue = getMelvinDialogue();
        this.setBehavior();

        interactPrompt(this, k.vec2(0, -75), 0.6, { width: 170, height: 120 });
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
        let target = null;

        this.onStateEnter("idle", async () => {
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(this.detectDelay);

          this.enterState("detect");
        });

        this.onStateEnter("detect", async () => {
          // const spiders = k.get("spider", { recursive: true });
          // if (spiders.length > 0) {
          //   target = spiders[0];
          //   this.enterState("alert");
          // } else this.enterState("idle");

          const collisions = this.getCollisions();
          console.log(collisions);
          if (collisions.length > 0) {
            for (const col of collisions) {
              if (col.target.tags.includes("enemy")) {
                target = col.target;
                console.log(target);
                this.enterState("alert");
                break;
              } else this.enterState("idle");
            }
          } else this.enterState("idle");
        });

        this.onStateEnter("alert", () => {
          // if (!target) this.enterState("detect");
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");

          // await this.wait(2);
          // if (this.pos.dist(player.pos) < this.alertRange) this.enterState("idle");
        });

        this.onStateUpdate("alert", () => {
          this.flipX = target.pos.x <= this.pos.x;
          this.moveTo(k.vec2(target.pos), this.alertSpeed);
          // this.move(this.flipX ? -this.alertSpeed : this.alertSpeed, 0);

          if (this.pos.dist(target.pos) < this.attackRange) {
            this.enterState("attack");
            return;
          }

          // if (this.pos.dist(target.pos) > this.alertRange) this.enterState("idle");
        });

        this.onStateEnter("attack", async () => {
          // console.log("Sam attacking");

          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.5);
          npcAtk = this.add(
            npcAttackHitbox(k.vec2(this.flipX ? -60 : 60, 20), k.vec2(160, 180), this.attackPower),
          );
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
