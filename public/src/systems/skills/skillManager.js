import k from "../../kaplayContext.js";
import { shieldAura } from "./shieldAura.js";
import { shuriken } from "./shuriken.js";

//skills for survivor mode
export const skillUnlockArray = { unlockSwordBeam, unlockShieldAura, unlockShuriken };

function unlockSwordBeam() {
  // console.log("Sword Beam updated");
  //activation is implemented in player.js => setControlsTopDown()
}

function unlockShuriken() {
  // console.log("Shuriken updated");

  const player = k.get("player")[0];

  //remove old shuriken if there is one
  if (player.get("shuriken").length > 0) player.get("shuriken")[0].destroy();

  //get updated stats
  const shurikenStats = player.skills.shuriken.stats;

  //coordinates for an octagon around player origin
  const area = VERTICES.map((vertex) =>
    k.vec2(vertex.x * shurikenStats.range, vertex.y * shurikenStats.range),
  );

  //shuriken object
  const fuma = player.add(shuriken(area, shurikenStats.damage));

  fuma.loop(shurikenStats.cooldown / -1000, () => {
    if (k.chance(0.2)) fuma.activate(player, "fireball", 2);
    else fuma.activate(player);
  });
}

function unlockShieldAura() {
  // console.log("Shield Aura updated");

  const player = k.get("player")[0];

  //remove old shield if there is one
  if (player.get("shieldAura").length > 0) player.get("shieldAura")[0].destroy();

  //get updated stats
  const shieldStats = player.skills.shieldAura.stats;

  //coordinates for an octagon around player origin
  const area = VERTICES.map((vertex) =>
    k.vec2(vertex.x * shieldStats.range, vertex.y * shieldStats.range),
  );

  //shieldAura object
  const shield = player.add(shieldAura(area, shieldStats.range * 3, shieldStats.damage));
  shield.effectOn();
  shield.loop(shieldStats.cooldown / -1000, () => shield.activate());
}

//skills for dungeon
export function initShuriken(player) {
  console.log("Dungeon projectiles initialized");

  //shuriken = area of effect for projectiles
  //remove old shuriken if there is one
  // if (player.get("shuriken").length > 0) player.get("shuriken")[0].destroy();

  //get updated stats
  const shurikenStats = player.skills.shuriken.stats;

  //coordinates for an octagon around player origin
  const area = VERTICES.map((vertex) =>
    k.vec2(vertex.x * shurikenStats.range, vertex.y * shurikenStats.range),
  );

  //shuriken object
  return player.add(shuriken(area, shurikenStats.damage));
}

export function initShieldAura(player) {
  console.log("Dungeon shield initialized");

  //remove old shield if there is one
  // if (player.get("shieldAura").length > 0) player.get("shieldAura")[0].destroy();

  //get updated stats
  const shieldStats = player.skills.shieldAura.stats;

  //coordinates for an octagon around player origin
  const area = VERTICES.map((vertex) =>
    k.vec2(vertex.x * shieldStats.range, vertex.y * shieldStats.range),
  );

  //shieldAura object
  return player.add(shieldAura(area, shieldStats.range * 3, shieldStats.damage));
}

//base coordinates for an octagon around origin (0,0)
const VERTICES = [
  {
    x: -1,
    y: -1,
  },
  {
    x: 0,
    y: -1.4,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: 1.4,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 0,
    y: 1.4,
  },
  {
    x: -1,
    y: 1,
  },
  {
    x: -1.4,
    y: 0,
  },
];
