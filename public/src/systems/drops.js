import k from "../kaplayContext.js";

export function spawnScale(pos) {
  return [
    k.sprite("drops", { frame: 3 }),
    k.pos(pos),
    k.area({ isSensor: true, collisionIgnore: ["", "enemy", "skill", "boundary", "platform"] }),
    k.anchor("center"),
    k.timer(),
    k.scale(0.5),
    "scale",
    {
      init() {
        this.onCollide("player", (player) => {
          // console.log("collected scale, healing player");
          player.hp += 20;

          //TODO: add player scale count, play healing effect

          this.destroy();
        });

        //destroy after ten seconds to prevent too many objects in the game
        // this.wait(10, () => this.destroy());
      },
    },
  ];
}
