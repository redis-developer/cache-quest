import k from "../../kaplayContext.js";

const FREETARGET_RANGE = 250;

//area of effect for projectile
export function shuriken(area, dmg) {
  return [
    k.area({
      isSensor: true,
      shape: new k.Polygon(area),
      collisionIgnore: [
        "player",
        "wall",
        "trigger",
        "skill",
        "exp",
        "enemyAttackHitbox",
        "npcAttackHitbox",
      ],
    }),
    k.timer(),

    "shuriken",
    "skill",
    {
      activate(player, sprite = "shuriken", dmgBuff = 1) {
        // console.log("Shuriken Activate!");

        const collisions = this.getCollisions();

        if (collisions.length > 0) {
          //lock on to closest enemy
          for (const col of collisions) {
            if (col.target.tags.includes("enemy")) {
              k.add(projectile(player.pos, col.target.pos, dmg * dmgBuff, sprite)).shoot();
              break;
            } else {
              freeTarget(player, dmg * dmgBuff, sprite);
              break;
            }
          }
        } else freeTarget(player, dmg * dmgBuff, sprite);
      },
    },
  ];
}

function projectile(sourcePos, targetPos, dmg, sprite) {
  return [
    k.sprite("projectiles", { anim: sprite }),
    k.pos(),
    k.anchor("center"),
    k.area({
      isSensor: true,
      collisionIgnore: ["", "player", "skill", "exp", "boundary", "platform"],
    }),
    k.animate(),
    k.rotate(),
    k.timer(),

    "projectile",
    {
      shoot() {
        this.onCollide("enemy", (enemy) => {
          enemy.hp -= dmg;
          this.destroy();
        });

        //fireball direction
        if (sprite === "fireball") this.angle = targetPos.sub(sourcePos).angle();

        this.animate("pos", [sourcePos, targetPos], { duration: 0.5 });
        this.wait(0.5, () => this.destroy());
      },
    },
  ];
}

function freeTarget(player, dmg, sprite) {
  // const fire = k.chance(chance);
  switch (player.direction) {
    case "side":
      k.add(
        projectile(
          player.pos,
          player.pos.add(k.vec2(player.flipX ? -FREETARGET_RANGE : FREETARGET_RANGE, 0)),
          dmg,
          sprite,
        ),
      ).shoot();

      break;
    case "up":
      k.add(
        projectile(player.pos, player.pos.add(k.vec2(0, -FREETARGET_RANGE)), dmg, sprite),
      ).shoot();
      break;
    case "down":
      k.add(
        projectile(player.pos, player.pos.add(k.vec2(0, FREETARGET_RANGE)), dmg, sprite),
      ).shoot();
      break;
  }
}
