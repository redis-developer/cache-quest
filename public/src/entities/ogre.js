import k from "../kaplayContext.js";
import { blinkEffect, playAnimIfNotPlaying } from "../systems/utils.js";
import { enemyAttackHitbox } from "../systems/collision.js";
import { gameState, playerState } from "../states/stateManager.js";
import { generateDialog } from "../systems/dialog.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";

export function spawnOgre(enemy) {
  return [
    k.sprite("ogre", { anim: "idle" }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0), 120, 150) }),
    k.pos(enemy.x, enemy.y),
    k.anchor("center"),
    k.body({ mass: 1000 }),
    k.opacity(),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("sleep", ["sleep", "idle", "patrol-right", "patrol-left", "alert", "attack", "death"]),
    k.health(800),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 50,
      alertSpeed: 100,
      alertRange: 300,
      attackPower: 20,
      attackRange: 100,
      isAttacking: false,
      isAlive: true,

      init() {
        this.setEvents();
        this.setBehavior();
      },

      setEvents() {
        this.onHurt(() => {
          // console.log(`ogre hurt! Current HP: ${this.hp}`);
          blinkEffect(this);
          if (this.hp <= 0) {
            this.enterState("death");
          }
        });

        this.onCollide("playerSword", (sword) => {
          // console.log("ogre hit by sword!");
          this.hp -= sword.damage;
          sword.destroy();
        });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];
        let enAtk = null; //enemy attack collision

        this.onStateEnter("sleep", () => this.play("idle"));

        this.onStateEnter("idle", async () => {
          // console.log(`ogre ${this.id} entered idle, player distance: ${this.pos.dist(player.pos)}`);
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(2); //Optimization: use GameObject local timers

          if (this.flipX) this.enterState("patrol-right");
          else this.enterState("patrol-left");
        });

        this.onStateEnter("patrol-right", async () => {
          // console.log(
          //   `ogre ${this.id} entered patrol-right, player distance: ${this.pos.dist(player.pos)}`
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
          //   `ogre ${this.id} entered patrol-left, player distance: ${this.pos.dist(player.pos)}`
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
          //   `ogre ${this.id} entered alert, player distance: ${this.pos.dist(player.pos)}`
          // );
          if (!this.isAttacking) playAnimIfNotPlaying(this, "run");
        });

        this.onStateUpdate("alert", () => {
          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(k.vec2(player.pos), this.alertSpeed);
          // this.move(this.flipX ? -this.alertSpeed : this.alertSpeed, 0);

          if (this.pos.dist(player.pos) < this.attackRange) {
            this.enterState("attack");
            return;
          }
        });

        this.onStateEnter("attack", async () => {
          // console.log("ogre attacking");

          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(k.vec2(player.pos), this.alertSpeed);

          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.5);
          enAtk = this.add(
            enemyAttackHitbox(
              k.vec2(this.flipX ? -100 : 100, 0),
              k.vec2(80, 200),
              this.attackPower,
            ),
          );
        });

        this.onStateEnter("death", async () => {
          console.log(`ogre ${this.id} died!`);
          this.isAlive = false;
          gameState.set("bossDefeated", "chapter4", true);
          gameState.set("story", "chapter", 4);
          gameState.set("story", "subchapter", 8);

          await saveGameData();
          await savePlayerData();
          await this.play("death", {
            onEnd: () => {
              ogreDeath(this);
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

function ogreDeath(ogre) {
  const lastWords = [
    `Outage Ogre: No, my beautiful slop!`,
    `Outage Ogre: You cannot defeat... infallible facts... sourced from online forums...`,
    `${playerState.get().name}: The vats are still collecting embeddings!`,
    `Kallie: Corrupted context reservoirs at 99%!`,
    `Doc: You must destroy the reservoirs now!`,
  ];

  generateDialog(lastWords, k.vec2(50), async () => {
    // playerState.set("position", { x: 1600, y: 850 });
    // playerState.set("map", "level2");
    // k.go("level2");
    await blinkEffect(ogre);
    ogre.destroy();
  });
}
