import k from "../../kaplayContext.js";

export function shieldAura(area, rng, dmg) {
  return [
    k.sprite("shieldAura", { anim: "activate", width: rng, height: rng }),
    k.area({
      isSensor: true,
      shape: new k.Polygon(area),
      collisionIgnore: ["", "player", "skill", "exp", "boundary", "platform"],
    }),
    k.anchor("center"),
    k.opacity(0),
    k.timer(),
    k.layer("foreground"),

    "shieldAura",
    "skill",
    {
      activate(knockback = false) {
        // console.log("Shield Aura Activate!");
        const collisions = this.getCollisions();

        for (const col of collisions) {
          if (col.target.tags.includes("enemy")) {
            col.target.hp -= dmg;
            if (knockback) {
              if (col.target.isStatic) return;

              const dir = col.target.pos.sub(this.parent.pos).unit();
              col.target.pos = col.target.pos.add(dir.scale(50));
              // col.target.applyImpulse(dir.scale(50));
            }
          }
        }
      },

      effectOn() {
        // console.log("Shield effect on");
        this.opacity = 0.7;
      },

      effectOff() {
        // console.log("Shield effect off");
        this.opacity = 0;
      },
    },
  ];
}
