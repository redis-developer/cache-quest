import k from "../kaplayContext.js";
import { blinkEffect, playAnimIfNotPlaying } from "../systems/utils.js";
import { enemyAttackHitbox, enemyRangedAttack } from "../systems/collision.js";
import { gameState, playerState } from "../states/stateManager.js";
import { spawnExp } from "../systems/skills/exp.js";
import { generateDialog } from "../systems/dialog.js";
import { saveGameData, savePlayerData } from "../systems/saveload.js";

export function spawnCostVampire(enemy) {
  return [
    k.sprite("vampire", { anim: "idle" }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0), 50, 60) }),
    k.pos(enemy.x, enemy.y),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.opacity(),
    k.scale(1.2),
    k.timer(), //Optimization: use GameObject local timers
    k.offscreen({ hide: true, pause: true, unpause: true }), //Optimization: hide offscreen objects
    k.state("idle", ["idle", "patrol-right", "patrol-left", "alert", "attack", "death"]),
    k.health(200),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 50,
      alertSpeed: 100,
      alertRange: 450,
      attackPower: 10,
      attackRange: 300,
      isAttacking: false,
      isAlive: true,
      hasSpawn: false,

      init() {
        this.flipX = true;
        this.setEvents();
        this.setBehavior();
      },

      setEvents() {
        this.onHurt(() => {
          // console.log(`vampire hurt! Current HP: ${this.hp}`);
          if (this.hp <= 0) this.enterState("death");
          blinkEffect(this);
        });

        this.onCollide("playerSword", (sword) => {
          // console.log("vampire hit by sword!");
          this.hp -= sword.damage;
          sword.destroy();
        });
      },

      setBehavior() {
        const player = k.get("player")[0]; //, { recursive: true })[0];
        let enAtk = null; //enemy attack collision

        this.onStateEnter("idle", async () => {
          // console.log(`vampire ${this.id} entered idle, player distance: ${this.pos.dist(player.pos)}`);
          if (!this.isAttacking) playAnimIfNotPlaying(this, "idle");
          await this.wait(2); //Optimization: use GameObject local timers

          if (this.flipX) this.enterState("patrol-right");
          else this.enterState("patrol-left");
        });

        this.onStateEnter("patrol-right", async () => {
          // console.log(
          //   `vampire ${this.id} entered patrol-right, player distance: ${this.pos.dist(player.pos)}`
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
          //   `vampire ${this.id} entered patrol-left, player distance: ${this.pos.dist(player.pos)}`
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
          //   `vampire ${this.id} entered alert, player distance: ${this.pos.dist(player.pos)}`
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
          // console.log("vampire attacking");
          playAnimIfNotPlaying(this, "idle");
          await this.wait(0.5);

          this.isAttacking = true;
          playAnimIfNotPlaying(this, "attack");

          const targetPos = player.pos.clone();
          //time for player to evade attack
          await this.wait(0.3);

          enAtk = k.add(enemyRangedAttack(targetPos, this.attackPower));
        });

        this.onStateEnter("death", async () => {
          console.log(`vampire ${this.id} died!`);
          this.isAlive = false;
          if (enAtk) k.destroy(enAtk); //remove attack collision

          gameState.set("bossDefeated", "chapter3", true);
          gameState.set("story", "chapter", 3);
          gameState.set("story", "subchapter", 5);

          await saveGameData();
          await savePlayerData();
          await costVampireDeath(this, player);

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

async function costVampireDeath(vampire, player) {
  if (vampire.hasSpawn) return;
  const lastWords = [
    `Cost vampire: You cannot defeat me. I am recurring!`,
    `${playerState.get().name}: Insidious, indeed.`,
  ];

  generateDialog(lastWords, k.vec2(50), () => {
    //damage cloud
    const cloud = k.add(enemyRangedAttack(vampire.pos, 10));
    cloud.scaleTo(3);
    cloud.init();

    const RADIUS = 10;
    //spawn mini vampires
    for (let i = 0; i < 10; i++) {
      // const spawnPos = pos.add(k.randi(-5, 5));
      const enemy = {
        id: 1,
        name: "vampire",
        type: "enemy",
        x: vampire.pos.x + k.randi(-RADIUS, RADIUS),
        y: vampire.pos.y + k.randi(-RADIUS, RADIUS),
      };
      k.add(spawnVampireSurvivor(enemy, player)).init();
    }

    vampire.hasSpawn = true;
  });
}

export function spawnVampireSurvivor(enemy, target, score) {
  return [
    k.sprite("vampireSurvivor", { anim: "run" }),
    k.area({ isSensor: true }),
    k.pos(enemy.x, enemy.y),
    k.body({ mass: 200 }),
    k.anchor("center"),
    k.opacity(),
    k.scale(0.8),
    k.state("alert", ["alert", "death"]),
    k.health(30),
    enemy.name,
    enemy.type,
    {
      id: enemy.id,
      speed: 65,
      attackPower: 4,
      points: 30,
      exp: 10,
      expSprite: 2,

      init() {
        this.onCollide("playerSword", (sword) => {
          this.hp -= sword.damage;
        });

        this.onHurt(() => {
          // console.log(`Vampire ${this.id} hurt! Current HP: ${this.hp}`);
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
