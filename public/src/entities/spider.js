import k from "../kaplayContext.js";
import { blinkEffect, playAnimIfNotPlaying } from "../systems/utils.js";
import { enemyAttackHitbox } from "../systems/collision.js";
import { gameState, playerState } from "../states/stateManager.js";
import { spawnExp } from "../systems/skills/exp.js";
import { generateDialog } from "../systems/dialog.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";

export function spawnSpider(enemy) {
  return [
    k.sprite("spider", { anim: "idle" }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0), 100, 70) }),
    k.pos(enemy.x, enemy.y),
    k.anchor("center"),
    k.body(),
    k.opacity(),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true, distance: 900 }), //Optimization: hide offscreen objects
    k.state("patrol-left", ["idle", "patrol-right", "patrol-left", "alert", "attack", "death"]),
    k.health(25),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 70,
      alertSpeed: 150,
      alertRange: 350,
      attackPower: 5,
      attackRange: 75,
      isAttacking: false,
      isAlive: true,

      init() {
        this.setEvents();
        this.setBehavior();
      },

      setEvents() {
        this.onHurt(() => {
          // console.log(`spider ${this.id} hurt! Current HP: ${this.hp}`);
          if (this.hp <= 0) this.enterState("death");
          blinkEffect(this);
        });

        this.onCollide("playerSword", (sword) => {
          // console.log("spider hit by sword!");
          this.hp -= sword.damage;
          // sword.destroy();
        });

        //resets enemy position when player moves too far away
        this.onExitScreen(() => {
          this.moveTo(enemy.x, enemy.y);
        });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];
        let enAtk = null; //enemy attack collision

        this.onStateEnter("idle", async () => {
          // console.log(
          //   `spider ${this.id} entered idle, player distance: ${this.pos.dist(player.pos)}`
          // );
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(2); //Optimization: use GameObject local timers

          if (this.flipX) this.enterState("patrol-right");
          else this.enterState("patrol-left");
        });

        this.onStateEnter("patrol-right", async () => {
          // console.log(
          //   `spider ${this.id} entered patrol-right, player distance: ${this.pos.dist(player.pos)}`
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
          //   `spider ${this.id} entered patrol-left, player distance: ${this.pos.dist(player.pos)}`
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
          //   `spider ${this.id} entered alert, player distance: ${this.pos.dist(player.pos)}`
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
          // console.log("spider attacking");
          playAnimIfNotPlaying(this, "idle");
          await this.wait(0.5);

          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.3);
          enAtk = this.add(
            enemyAttackHitbox(k.vec2(this.flipX ? -45 : 45, 0), k.vec2(90, 100), this.attackPower),
          );
        });

        this.onStateEnter("death", () => {
          // console.log(`spider ${this.id} died!`);
          this.isAlive = false;
          playerState.set("enemiesKilled", "spider", playerState.get().enemiesKilled.spider + 1);
          this.destroy();
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

export function spawnSpiderSurvivor(enemy, target, score) {
  return [
    k.sprite("spiderSurvivor", { anim: "run" }),
    k.area({ isSensor: true }),
    k.pos(enemy.x, enemy.y),
    k.body(),
    k.anchor("center"),
    k.opacity(),
    k.scale(0.8),
    k.state("alert", ["alert", "death"]),
    k.health(25),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 60,
      attackPower: 2,
      points: 20,
      exp: 5,
      expSprite: 1,

      init() {
        this.onCollide("playerSword", (sword) => {
          this.hp -= sword.damage;
        });

        this.onHurt(() => {
          // console.log(`Goblin ${this.id} hurt! Current HP: ${this.hp}`);
          if (this.hp <= 0) {
            this.enterState("death");
          }

          blinkEffect(this);
        });

        // this.onStateEnter("alert", () => {
        //   playAnimIfNotPlaying(this, "run");
        // });

        this.onStateUpdate("alert", () => {
          // if (!player) player = k.get(target)[0];
          this.flipX = target.pos.x <= this.pos.x;
          this.moveTo(target.pos, this.speed);
        });

        this.onStateEnter("death", () => {
          playerState.set("enemiesKilled", "goblin", playerState.get().enemiesKilled.goblin + 1);
          target.currentScore += this.points;

          if (score) {
            score.refresh(target.currentScore);
            k.add(spawnExp(target, this.pos, this.exp, this.expSprite)).init();
          }

          this.destroy();
        });

        // this.onUpdate(() => {
        //   this.flipX = target.pos.x <= this.pos.x;
        //   this.moveTo(k.vec2(target.pos), this.speed);
        // });
      },
    },
  ];
}

export function spawnSpiderQueen(enemy) {
  return [
    k.sprite("spider", { anim: "idle" }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0, 10), 120, 60) }),
    k.pos(enemy.x, enemy.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.opacity(),
    k.scale(2),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("idle", ["idle", "patrol-right", "patrol-left", "alert", "attack", "death"]),
    k.health(120),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 50,
      alertSpeed: 100,
      alertRange: 450,
      attackPower: 20,
      attackRange: 55,
      isAttacking: false,
      isAlive: true,

      init() {
        this.setEvents();
        this.setBehavior();
      },

      setEvents() {
        this.onHurt(() => {
          // console.log(`spiderQueen hurt! Current HP: ${this.hp}`);
          blinkEffect(this);
          if (this.hp <= 0) {
            this.enterState("death");
          }
        });

        this.onCollide("playerSword", (sword) => {
          // console.log("spiderQueen hit by sword!");
          this.hp -= sword.damage;
          sword.destroy();
        });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];
        let enAtk = null; //enemy attack collision

        this.onStateEnter("idle", async () => {
          // console.log(`spiderQueen ${this.id} entered idle, player distance: ${this.pos.dist(player.pos)}`);
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(2); //Optimization: use GameObject local timers

          if (this.flipX) this.enterState("patrol-right");
          else this.enterState("patrol-left");
        });

        this.onStateEnter("patrol-right", async () => {
          // console.log(
          //   `spiderQueen ${this.id} entered patrol-right, player distance: ${this.pos.dist(player.pos)}`
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
          //   `spiderQueen ${this.id} entered patrol-left, player distance: ${this.pos.dist(player.pos)}`
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
          //   `spiderQueen ${this.id} entered alert, player distance: ${this.pos.dist(player.pos)}`
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
          // console.log("spiderQueen attacking");
          playAnimIfNotPlaying(this, "idle");
          await this.wait(0.5);

          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");
          await this.wait(0.5);
          enAtk = this.add(
            enemyAttackHitbox(k.vec2(this.flipX ? -60 : 60, 10), k.vec2(40, 50), this.attackPower),
          );
        });

        this.onStateEnter("death", async () => {
          console.log(`spiderQueen ${this.id} died!`);
          this.isAlive = false;
          gameState.set("bossDefeated", "chapter2", true);
          gameState.set("story", "chapter", 2);
          gameState.set("story", "subchapter", 5);

          await saveGameData();
          await savePlayerData();
          await spiderQueenDeath();

          this.destroy();
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

async function spiderQueenDeath() {
  const lastWords = [
    `Spider queen: wAiT! ThIS aPI Is sTill iN USE—`,
    `${playerState.get().name}: Not anymore.`,
  ];

  generateDialog(lastWords, k.vec2(50), () => {
    // playerState.set("position", { x: 1600, y: 850 });
    // playerState.set("map", "level2");
    // k.go("level2");
  });
}
