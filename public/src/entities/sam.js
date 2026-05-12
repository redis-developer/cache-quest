import k from "../kaplayContext.js";
import { blinkEffect, playAnimIfNotPlaying } from "../systems/utils.js";
import { generateDialog } from "../systems/dialog.js";
import { enemyAttackHitbox, npcAttackHitbox } from "../systems/collision.js";
import { gameState, playerState } from "../states/stateManager.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";
import { getSamDialogue } from "../../assets/dialog/samDialogue.js";
import { interactPrompt } from "../systems/interaction.js";

export function spawnSam(pos) {
  return [
    k.sprite("sam", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 10), 150, 80) }),
    k.pos(pos.x, pos.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    "Sam",
    {
      dialogue: null,
      init(flip = false) {
        this.flipX = flip;
        this.dialogue = getSamDialogue();
        interactPrompt(
          this,
          k.vec2(0, -30),
          0.5,
          { width: 90, height: 100 },
          k.vec2(flip ? -60 : 60, 10),
        );
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

export function spawnSamBoss(enemy) {
  return [
    k.sprite("sam", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 10), 140, 60) }),
    k.pos(enemy.x, enemy.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.opacity(),
    k.scale(1.5),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("idle", ["idle", "patrol-right", "patrol-left", "alert", "attack", "death"]),
    k.health(80),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 80,
      alertSpeed: 100,
      alertRange: 450,
      attackPower: 10,
      attackRange: 130,
      isAttacking: false,
      isAlive: true,

      init() {
        this.setEvents();
        this.setBehavior();
      },

      setEvents() {
        this.onHurt(() => {
          // console.log(`Sam hurt! Current HP: ${this.hp}`);
          if (this.hp <= 0) this.enterState("death");
          blinkEffect(this);
        });

        // this.onCollide("playerSword", (sword) => {
        //   // console.log("Sam hit by sword!");
        //   this.hp -= sword.damage;
        //   sword.destroy();
        // });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];
        let enAtk = null; //enemy attack collision

        this.onStateEnter("idle", async () => {
          // console.log(`Sam ${this.id} entered idle, player distance: ${this.pos.dist(player.pos)}`);
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(2); //Optimization: use GameObject local timers

          if (this.flipX) this.enterState("patrol-right");
          else this.enterState("patrol-left");
        });

        this.onStateEnter("patrol-right", async () => {
          // console.log(
          //   `Sam ${this.id} entered patrol-right, player distance: ${this.pos.dist(player.pos)}`
          // );
          this.flipX = false;
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");
          await this.wait(3);
          if (this.state === "patrol-right") this.enterState("patrol-left");
        });

        this.onStateUpdate("patrol-right", () => {
          if (this.pos.dist(player.pos) < this.alertRange) {
            this.enterState("alert");
            return;
          }
          this.move(this.speed, 0);
        });

        this.onStateEnter("patrol-left", async () => {
          // console.log(
          //   `Sam ${this.id} entered patrol-left, player distance: ${this.pos.dist(player.pos)}`
          // );
          this.flipX = true;
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");
          await this.wait(3);
          if (this.state === "patrol-left") this.enterState("patrol-right");
        });

        this.onStateUpdate("patrol-left", () => {
          if (this.pos.dist(player.pos) < this.alertRange) {
            this.enterState("alert");
            return;
          }
          this.move(-this.speed, 0);
        });

        this.onStateEnter("alert", () => {
          // console.log(
          //   `Sam ${this.id} entered alert, player distance: ${this.pos.dist(player.pos)}`
          // );
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");

          // await this.wait(2);
          // if (this.pos.dist(player.pos) < this.alertRange) this.enterState("idle");
        });

        this.onStateUpdate("alert", () => {
          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(k.vec2(player.pos), this.alertSpeed);
          // this.move(this.flipX ? -this.alertSpeed : this.alertSpeed, 0);

          if (this.pos.dist(player.pos) < this.attackRange) {
            this.enterState("attack");
            return;
          }

          if (this.pos.dist(player.pos) > this.alertRange) this.enterState("idle");
        });

        this.onStateEnter("attack", async () => {
          // console.log("Sam attacking");
          playAnimIfNotPlaying(this, "idle");
          await this.wait(0.5);

          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.5);
          enAtk = this.add(
            enemyAttackHitbox(
              k.vec2(this.flipX ? -60 : 60, 10),
              k.vec2(140, 150),
              this.attackPower,
            ),
          );
        });

        this.onStateEnter("death", async () => {
          console.log(`Sam ${this.id} defeated.`);
          this.isAlive = false;

          const samDialogue = getSamDialogue();
          playerState.set("position", { x: 1030, y: 500 });
          playerState.set("map", "level1");
          gameState.set("bossDefeated", "chapter1", true);
          gameState.set("story", "chapter", 1);
          gameState.set("story", "subchapter", 5);

          await saveGameData();
          await savePlayerData();
          this.play("guard-in", {
            onEnd: () => {
              generateDialog(samDialogue.guard1, k.vec2(50), () => {
                this.play("guard-out", { onEnd: () => k.pressButton("pause") });

                generateDialog(samDialogue.guard2, k.vec2(50), () => k.go("level1"));
              });
              //
            },
          });
        });

        this.onAnimEnd((anim) => {
          if (anim === "attack") {
            if (enAtk) k.destroy(enAtk); //remove attack collision
            this.isAttacking = false;
            if (this.isAlive) this.enterState("alert");
            else this.enterState("death");
          }
        });
      },
    },
  ];
}

// function spawnSamGuard(pos) {
//   return [
//     k.sprite("sam", { anim: "guard-in", flipX: true }),
//     // k.area({ shape: new k.Rect(k.vec2(0, 10), 120, 60) }),
//     // k.area(),
//     // k.rect(140, 50),
//     k.pos(pos),
//     k.scale(1.5),
//     k.anchor("center"),
//     // k.body({ isStatic: true }),
//     k.timer(),
//     "Sam",
//     {
//       async init() {
//         const samDialog = getSamDialogue();
//         generateDialog(samDialog.guard, k.vec2(50), () => {
//           playerState.set("position", { x: 1030, y: 500 });
//           playerState.set("map", "level1");
//           k.go("level1");
//         });

//         await this.wait(3, () => {
//           this.play("guard-out");
//         });
//       },
//     },
//   ];
// }

export function spawnSamAlly(ally) {
  return [
    k.sprite("sam", { anim: "idle" }),
    k.area({
      shape: new k.Rect(k.vec2(0), 140, 80),
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
    k.state("idle", ["idle", "detect", "attack"]),
    ally.name,
    ally.type,
    {
      id: ally.id,
      // speed: 50,
      attackPower: 150,
      isAttacking: false,
      detectDelay: 0.8,
      dialogue: null,

      init() {
        this.dialogue = getSamDialogue();
        this.setBehavior();

        interactPrompt(
          this,
          k.vec2(0, -50),
          0.5,
          { width: 170, height: 110 },
          // k.vec2(this.flipX ? -15 : 15, 0),
        );
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

        this.onStateEnter("detect", () => {
          const collisions = this.getCollisions();
          // console.log(collisions);
          if (collisions.length > 0) {
            for (const col of collisions) {
              if (col.target.tags.includes("enemy")) {
                target = col.target; //save reference to target used to face this npc towards
                this.enterState("attack");
                break;
              } else this.enterState("idle");
            }
          } else this.enterState("idle");
        });

        this.onStateEnter("attack", async () => {
          // console.log("Sam attacking");

          this.flipX = target.pos.x <= this.pos.x; //turn towards target
          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.5);
          npcAtk = this.add(
            npcAttackHitbox(k.vec2(this.flipX ? -60 : 60, 10), k.vec2(120, 120), this.attackPower),
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
