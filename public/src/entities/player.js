import k from "../kaplayContext.js";
import { playerState, gameState } from "../states/stateManager.js";
import { playAnimIfNotPlaying, debugLog, blinkEffect } from "../systems/utils.js";
import { saveGameData, savePlayerData, saveScore } from "../systems/saveload.js";

//ui
import { healthBar, gameOver, createAlert, createMenu, gameOverDungeon } from "../systems/ui.js";

//skills
import { createSkillCard } from "../systems/skills/skillCard.js";
import { swordBeam } from "../systems/skills/swordBeam.js";
import { initShieldAura, initShuriken } from "../systems/skills/skillManager.js";

///////// player setup for top-down game modes \\\\\\\\\\

//--default player--\\
export function playerTopDown() {
  return [
    k.sprite("player", {
      anim: "idle-side",
    }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0, 20), 50, 35) }), //, collisionIgnore: ["interactPrompt"] }),
    k.body(),
    k.pos(playerState.get().position.x, playerState.get().position.y),
    k.opacity(),
    k.scale(0.7),
    k.anchor("center"),
    "player",
    "dungeon",
    {
      speed: 180,
      attackPower: 5,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "side",
      isAttacking: false,
      menuOpen: false,
      skills: {
        swordBeam: {
          name: "Sword Beam",
          unlocked: false,
          stats: {
            damage: 1,
            range: 150,
          },
        },
      },

      init(flip = false) {
        this.flipX = flip;
        setControlsTopDown(this);
        enableSave(this);
        enableDebug(this);
      },
    },
  ];
}

//--survivor player--\\
export function playerSurvivor(pos, playerSkills, scoreBoardLevel) {
  return [
    k.sprite("player", {
      anim: "idle-up",
    }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0), 40, 50) }),
    k.pos(pos),
    k.body({ mass: 300 }),
    k.anchor("center"),
    k.opacity(),
    k.timer(),
    k.scale(0.8),
    k.health(playerState.get().health.survivor),

    "player",
    "survivor",
    {
      speed: playerState.get().speed.survivor,
      attackPower: playerState.get().attack.survivor,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "up",
      isAttacking: false,
      isInvulnerable: false,
      menuOpen: false,
      level: 1,
      exp: 0,
      maxExp: 5,
      currentScore: 0,
      skills: playerSkills,
      healthBar: null,

      init() {
        setEventsSurvivor(this);
        setControlsTopDown(this);
        enableDebug(this);

        // this.add(healthBar({ width: 70, height: 10 })).refresh(1);
        this.healthBar = this.add(healthBar({ width: 80, height: 10 }));
        this.healthBar.refresh(1);

        //additional debug for survivor mode
        this.onButtonPress("debug", () => {
          console.log("current score: " + this.currentScore);
          console.log("current level: " + this.level);
          console.log("exp until next level: " + (this.maxExp - this.exp));
          // this.levelUp();
        });

        this.onButtonPress("esc", () => {
          this.trigger("death");
        });
      },

      updateHealthBar() {
        // console.log(`current hp: ${this.hp}/${this.maxHP}
        // percent: ${this.hp / this.maxHP}`);

        this.healthBar.refresh(this.hp / this.maxHP);
      },

      levelUp() {
        //return to idle animation
        playAnimIfNotPlaying(this, `idle-${this.direction}`);

        k.pressButton("pause");

        this.exp = 0;
        this.level = this.level += 1;
        this.hp += this.maxHP * 0.1;
        console.log(`player leveled up! Lvl ${this.level}`);

        //update UI
        scoreBoardLevel.refresh(this.level);

        if (this.level < 20) this.maxExp = this.level * 5;
        if (this.level >= 20 && this.level < 40) this.maxExp = this.level * 10;
        if (this.level >= 40) this.maxExp = this.level * 15;

        //only create skill cards for skills that have been unlocked through story
        // const allSkills = Object.keys(this.skills);
        // const skills = [];

        // for (const skill of allSkills) {
        //   if (playerState.get().skillUnlocked[skill]) skills.push(skill);
        // }

        //create skill cards for all skills regardless of story unlocked
        const skills = Object.keys(this.skills);

        for (let i = 0; i < skills.length; i++) {
          createSkillCard(
            //card.pos.x = player.pos.x - (skillCard size + spacing)  * (skillsArray.length/2 - i)
            k.vec2(this.pos.x - 350 * (skills.length / 2 - i), this.pos.y - 170),
            // k.center().sub(k.vec2(320 * (skills.length / 2 - i), 150)),
            { width: 320, height: 400, text: 32, padding: 50 },
            this.skills[skills[i]],
          );
        }
      },
    },
  ];
}

//--survivor player events--\\
function setEventsSurvivor(player) {
  player.onHurt(() => {
    // console.log("player hurt, current HP: " + player.hp);
    blinkEffect(player);

    player.updateHealthBar();
  });

  player.onHeal(() => {
    // console.log("player healed");
    player.updateHealthBar();
  });

  player.onCollideUpdate("enemy", async (enemy) => {
    if (!player.isInvulnerable) {
      player.hp -= enemy.attackPower;

      //brief invulnerability after player is hurt
      player.isInvulnerable = true;
      await player.wait(0.2);
      player.isInvulnerable = false;
    }
  });

  player.onDeath(async () => {
    console.log("player died");
    let highScore = false;
    const leaderboard = playerState.get().leaderboard;

    if (player.currentScore > playerState.get().highScore[leaderboard]) {
      playerState.set("highScore", leaderboard, player.currentScore);
      highScore = true;
      await saveScore(player.currentScore);
    }

    gameOver({ width: 400, height: 330, text: 24 }, player.currentScore, highScore);
    k.pressButton("pause");

    await savePlayerData();
    // await saveGameData();

    await k.wait(0.5);
    k.onButtonPress("start", () => k.go(playerState.get().map));
  });
}

//--dungeon player--\\
export function playerDungeon() {
  return [
    k.sprite("player", {
      anim: "idle-up",
    }),
    k.area({ isSensor: true, shape: new k.Rect(k.vec2(0), 40, 50) }),
    k.pos(playerState.get().position.x, playerState.get().position.y),
    k.body({ mass: 200 }),
    k.anchor("center"),
    k.opacity(),
    k.scale(),
    k.timer(),
    k.health(playerState.get().health.dungeon),

    "player",
    "dungeon",
    {
      speed: playerState.get().speed.dungeon,
      attackPower: playerState.get().attack.dungeon,
      attackCombo: 1,
      attackComboMax: 2,
      direction: "up",
      isAttacking: false,
      isInvulnerable: false,
      menuOpen: false,
      // healthBar: null,
      shuriken: null,
      shield: null,
      skills: {
        swordBeam: {
          name: "Sword Beam",
          unlocked: playerState.get().skillUnlocked["swordBeam"],
          stats: {
            damage: 5,
            range: 200,
          },
        },
        shuriken: {
          name: "Shuriken",
          unlocked: playerState.get().skillUnlocked["shuriken"],
          chance: 0.2,
          stats: {
            damage: 5,
            range: 200,
          },
        },
        shieldAura: {
          name: "Shield Aura",
          unlocked: playerState.get().skillUnlocked["shieldAura"],
          effectOn: false,
          canDamage: true,
          knockback: false,
          stats: {
            damage: 5,
            range: 150,
          },
        },
      },

      init() {
        setEventsDungeon(this);
        setControlsTopDown(this);
        setControlsDungeon(this);
        enableDebug(this);

        this.healthBar = this.add(healthBar({ width: 70, height: 10 }));
        this.healthBar.refresh(1);

        //initialize shuriken and shieldAura skills for dungeon mode, swordBeam is automatically unlocked
        if (this.skills.shuriken.unlocked) this.shuriken = initShuriken(this);
        if (this.skills.shieldAura.unlocked) this.shield = initShieldAura(this);
      },

      updateHealthBar() {
        // console.log(`current hp: ${this.hp}/${this.maxHP}
        // percent: ${this.hp / this.maxHP}`);
        this.healthBar.refresh(this.hp / this.maxHP);
      },
    },
  ];
}

//--dungeon player events--\\
function setEventsDungeon(player) {
  player.onHurt(() => {
    // console.log("player hurt, current HP: " + player.hp);
    blinkEffect(player);

    player.updateHealthBar();
  });

  player.onHeal(() => {
    // console.log("player healed");
    player.updateHealthBar();
  });

  player.onCollideUpdate("enemy", async (enemy) => {
    if (!player.isInvulnerable) {
      if (player.skills.shieldAura.effectOn) player.hp -= enemy.attackPower * 0.5;
      else player.hp -= enemy.attackPower * 0.8;

      //brief invulnerability after player is hurt
      player.isInvulnerable = true;
      await player.wait(0.2);
      player.isInvulnerable = false;
    }
  });

  player.onCollide("enemyAttackHitbox", (enAtk) => {
    if (player.skills.shieldAura.effectOn) player.hp -= enAtk.damage * 0.5;
    else player.hp -= enAtk.damage;
  });

  player.onDeath(async () => {
    console.log("player died");

    gameOverDungeon({ width: 400, height: 330, text: 24 });

    k.pressButton("pause");

    await k.wait(0.5);
    k.onButtonPress("start", () => k.go(playerState.get().map));
  });
}

function setControlsDungeon(player) {
  player.onButtonPress("projectile", () => {
    if (player.shuriken) {
      if (player.skills.shuriken.chance === 1) player.shuriken.activate(player, "fireShuriken", 5);
      else if (k.chance(player.skills.shuriken.chance))
        player.shuriken.activate(player, "fireball", 2);
      else player.shuriken.activate(player, "shuriken");
    }
  });

  player.onButtonPress("shield", () => {
    if (player.shield && player.skills.shieldAura.knockback) player.shield.activate(true);
  });

  player.onButtonDown("shield", () => {
    if (player.shield) {
      if (!player.skills.shieldAura.effectOn) {
        player.shield.effectOn();
        player.skills.shieldAura.effectOn = true;
      }

      if (player.skills.shieldAura.canDamage) {
        player.shield.activate();
        player.skills.shieldAura.canDamage = false;
        player.wait(0.2, () => (player.skills.shieldAura.canDamage = true));
      }
    }
  });

  player.onButtonRelease("shield", () => {
    if (player.shield) {
      player.shield.effectOff();
      player.skills.shieldAura.effectOn = false;
    }
  });
}

////////-------------\\\\\\\\
// top-down player controls \\
function setControlsTopDown(player) {
  //Optimization: use GameObject local input handlers
  //https://kaplayjs.com/docs/guides/optimization/

  //joystick movement
  const joystick = player.onGamepadStick("left", (vec) => {
    if (player.isAttacking) return;

    //up
    if (vec.y < -0.75) {
      player.flipX = false;
      player.direction = "up";
      player.move(0, vec.y * player.speed);
      playAnimIfNotPlaying(player, "run-up");
      return;
    }

    //down
    if (vec.y > 0.75) {
      player.flipX = false;
      player.direction = "down";
      player.move(0, vec.y * player.speed);
      playAnimIfNotPlaying(player, "run-down");
      return;
    }

    //left
    if (vec.x < -0.3) {
      player.flipX = true;
      player.direction = "side";
      playAnimIfNotPlaying(player, "run-side");
      player.move(vec.x * player.speed, vec.y * player.speed);
      return;
    }

    //right
    if (vec.x > 0.3) {
      player.flipX = false;
      player.direction = "side";
      playAnimIfNotPlaying(player, "run-side");
      player.move(vec.x * player.speed, vec.y * player.speed);
      return;
    }

    playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  //movement
  player.onButtonDown((btn) => {
    if (player.isAttacking) return;

    if (btn === "up") {
      //prevent diagonal movement
      if (k.isButtonDown(["left", "right"])) return;
      joystick.paused = true;
      player.direction = "up";
      player.move(0, -player.speed);
      playAnimIfNotPlaying(player, "run-up");

      return;
    }

    if (btn === "down") {
      //prevent diagonal movement
      if (k.isButtonDown(["left", "right"])) return;
      joystick.paused = true;
      player.direction = "down";
      player.move(0, player.speed);
      playAnimIfNotPlaying(player, "run-down");

      return;
    }

    if (btn === "left") {
      joystick.paused = true;
      player.flipX = true;
      player.direction = "side";
      player.move(-player.speed, 0);
      playAnimIfNotPlaying(player, "run-side");

      return;
    }

    if (btn === "right") {
      joystick.paused = true;
      player.flipX = false;
      player.direction = "side";
      player.move(player.speed, 0);
      playAnimIfNotPlaying(player, "run-side");

      return;
    }
  });

  //return to idle
  player.onButtonRelease((btn) => {
    if (player.isAttacking) return;
    if (["up", "down", "left", "right"].includes(btn)) {
      joystick.paused = false;
    }

    playAnimIfNotPlaying(player, `idle-${player.direction}`);
  });

  //interact
  player.onButtonPress("interact", () => {
    if (player.isAttacking) return;
    // console.log("player collisions", player.getCollisions());
    if (player.getCollisions().length < 1) return;
    playAnimIfNotPlaying(player, `idle-${player.direction}`);

    // k.debug.log("Interacting with " + player.getCollisions()[0].target.tags[1]);
    // debugLog("log", "Interacting with " + player.getCollisions()[0].target.tags[1]);

    player.getCollisions()[0].target.trigger("Interact");

    // for (const col of player.getCollisions()) {
    //   col.target.trigger("Interact", player);
    // }
  });

  //attack
  player.onButtonPress("attack", () => {
    if (player.isAttacking) return;
    player.isAttacking = true;
    const swrdBm = player.skills.swordBeam;

    switch (player.direction) {
      case "up":
        player.add(playerSword(k.vec2(-20, -100), k.vec2(40, 60), player.attackPower));
        if (swrdBm.unlocked)
          player.add(swordBeam(k.vec2(0, -swrdBm.stats.range), "up", swrdBm.stats.damage)).slash();
        break;
      case "down":
        player.add(playerSword(k.vec2(-20, 45), k.vec2(40, 50), player.attackPower));
        if (swrdBm.unlocked)
          player.add(swordBeam(k.vec2(0, swrdBm.stats.range), "down", swrdBm.stats.damage)).slash();
        break;
      default:
        player.add(
          playerSword(k.vec2(player.flipX ? -100 : 40, -20), k.vec2(60, 40), player.attackPower),
        );
        if (swrdBm.unlocked)
          player
            .add(
              swordBeam(
                k.vec2(player.flipX ? -swrdBm.stats.range : swrdBm.stats.range, 0),
                "side",
                swrdBm.stats.damage,
              ),
            )
            .slash();
        break;
    }

    player.play(`attack${player.attackCombo}-${player.direction}`);
    // playAnimIfNotPlaying(player, `attack${player.attackCombo}-${player.direction}`);

    // increment attack combo or reset to 1 if at max
    player.attackCombo = player.attackCombo < player.attackComboMax ? player.attackCombo + 1 : 1;
  });

  //on animation end
  player.onAnimEnd((anim) => {
    if (anim.substring(0, 6) === "attack") {
      // console.log("Attack animation ended");
      const sword = player.get("playerSword")[0];
      if (sword) sword.destroy();
      player.isAttacking = false;
      playAnimIfNotPlaying(player, `idle-${player.direction}`);
    }
  });

  k.onButtonPress("pause", () => {
    player.paused = !player.paused;
    if (player.shield) {
      player.shield.effectOff();
      player.skills.shieldAura.effectOn = false;
    }
  });

  k.onButtonPress("menu", () => {
    createMenu(player);
  });
}

////////-------------\\\\\\\\
// player utility functions \\
function playerSword(pos, size, dmg) {
  return [
    k.area({
      isSensor: true,
      shape: new k.Rect(pos, size.x, size.y),
      collisionIgnore: ["", "player", "boundary", "platform"],
    }),
    "playerSword",
    { damage: dmg },
  ];
}

function enableSave(player) {
  player.onButtonPress("save", async () => {
    playerState.set("position", { x: player.pos.x, y: player.pos.y });

    const save = await savePlayerData();
    const game = await saveGameData();
    if (save) debugLog("log", save);
    if (game) debugLog("log", game);
  });
}

function enableDebug(player) {
  //debug
  player.onButtonPress("debug", () => {
    // debugLog("log", "playerState:\n" + JSON.stringify(playerState.get(), null, 2));
    // debugLog("log", "gameState:\n" + JSON.stringify(gameState.get(), null, 2));

    console.log("player:", playerState.get());
    console.log("game:", gameState.get());
    console.log("total number of enemies: " + k.get("enemy", { recursive: true }).length);
    console.log("fps: " + k.debug.fps());
  });
}
