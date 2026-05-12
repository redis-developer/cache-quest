import k from "../../kaplayContext.js";

export function swordBeam(end, dir, dmg) {
  return [
    k.sprite("swordBeam"), //, { anim: "activate" }
    k.pos(),
    k.area({ isSensor: true, collisionIgnore: ["", "player", "skill", "exp", "wall"] }),
    k.animate(),
    k.anchor("center"),

    "swordBeam",
    "skill",
    {
      slash() {
        if (end.x < 0) this.flipX = true;

        this.onCollide("enemy", (enemy) => (enemy.hp -= dmg));

        this.play(`activate-${dir}`);
        this.animate("pos", [this.pos, end], { duration: 0.6, loops: 1 });

        this.onAnimateFinished(() => this.destroy());
      },
    },
  ];
}
