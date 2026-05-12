import k from "../../kaplayContext.js";

export function spawnExp(player, pos, points, sprite) {
  return [
    k.sprite("drops", { frame: sprite }),
    k.pos(pos),
    k.area({ isSensor: true, collisionIgnore: ["", "enemy", "skill", "boundary", "platform"] }),
    k.anchor("center"),
    k.timer(),
    "exp",
    `exp${points}`,
    {
      init() {
        const expBar = k.get("expBar", { recursive: true })[0];
        // const expBar = k.get("ui")[0].get("expBarContainer")[0].get("expBar")[0];

        this.onCollide("player", () => {
          // console.log(`player gained ${points} exp!`);
          player.exp = player.exp += points;
          if (player.exp >= player.maxExp) player.levelUp();

          expBar.refresh(player.exp / player.maxExp);

          this.destroy();
        });

        //destroy after ten seconds to prevent too many objects in the game
        this.wait(10, () => this.destroy());
      },
    },
  ];
}
