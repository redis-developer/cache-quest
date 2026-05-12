import k from "../kaplayContext.js";

export function generateCollision(col) {
  return [
    k.area({
      shape: new k.Rect(k.vec2(0), col.width, col.height),
    }),
    k.pos(col.x, col.y),
    k.body({ isStatic: true }),
    col.name,
    col.type,
  ];
}

export function generateCollisions(map, collisions) {
  for (const col of collisions) {
    map.add([
      k.area({
        shape: new k.Rect(k.vec2(0), col.width, col.height),
      }),
      k.pos(col.x, col.y),
      k.body({ isStatic: true }),
      col.name,
      col.type,
    ]);

    //   if using polygons for collision
    //   if (col.polygon) {
    //     const points = col.polygon.map((point) => k.vec2(point.x, point.y));
    //     map.add([
    //       k.area({ shape: new k.Polygon(points) }),
    //       k.pos(col.x, col.y),
    //       k.body({ isStatic: true }),
    //       col.type,
    //     ]);
    //   } else {
    //     map.add([
    //       k.area({
    //         shape: new k.Rect(k.vec2(0), col.width, col.height),
    //       }),
    //       k.pos(col.x, col.y),
    //       k.body({ isStatic: true }),
    //       col.type,
    //     ]);
    //   }
  }
}

export function generateTriggers(map, triggers) {
  for (const trig of triggers) {
    map.add([
      k.area({
        isSensor: true,
        shape: new k.Rect(k.vec2(0), trig.width, trig.height),
      }),
      k.pos(trig.x, trig.y),
      trig.name,
      trig.type,
    ]);
  }
}

export function enemyAttackHitbox(pos, size, dmg) {
  return [
    k.area({
      isSensor: true,
      shape: new k.Rect(pos, size.x, size.y),
      collisionIgnore: ["", "enemy", "wall"],
    }),
    k.anchor("center"),
    "enemyAttackHitbox",
    {
      damage: dmg,
    },
  ];
}

export function enemyRangedAttack(pos, dmg) {
  return [
    k.sprite("enemySpell", { anim: "activate" }),
    k.pos(pos),
    k.scale(),
    k.area({
      isSensor: true,
      // shape: new k.Rect(pos, size.x, size.y),
      collisionIgnore: ["", "enemy", "wall"],
    }),
    k.anchor("center"),
    k.layer("foreground"),
    "enemyAttackHitbox",
    {
      damage: dmg,
      init() {
        this.onAnimEnd(() => this.destroy());
      },
    },
  ];
}

export function npcAttackHitbox(pos, size, dmg) {
  return [
    k.area({
      isSensor: true,
      shape: new k.Rect(pos, size.x, size.y),
      collisionIgnore: ["", "player", "wall"],
    }),
    k.anchor("center"),
    "npcAttackHitbox",
    "playerSword",
    { damage: dmg },
  ];
}
