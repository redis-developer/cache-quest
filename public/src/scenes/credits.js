import { fetchData, screenFx, setBackgroundColor } from "../systems/utils.js";
import { generateCollisions, generateTriggers } from "../systems/collision.js";
import { playerDungeon, playerSurvivor } from "../entities/player.js";
import { createAlert, createModal } from "../systems/ui.js";
import { playerState } from "../states/stateManager.js";
import { savePlayerData } from "../systems/saveload.js";

export default async function credits(k) {
  setBackgroundColor("#0b131e");

  k.wait(2, () => {
    createAlert(
      k.center().add(0, -300),
      { width: 670, height: 80, text: 24 },
      "Thank you for playing Cache Quest\nPress Enter to return to Skyflow Kingdom.",
      0,
    );
  });

  const menu = k.add(createModal(k.center(), { width: 1050, height: 500 }));

  menu.add([
    k.text(`Producer\n\nDeveloper\n\nArtists\n\n\n\nUI Designer\n\nEditor`, {
      font: "space",
      letterSpacing: 3,
      size: 30,
      align: "right",
    }),
    k.pos(-20, -170),
    k.color(k.WHITE),
    k.anchor("topright"),
  ]);

  menu.add([
    k.text(
      `Bekah Reddis\n\nChanh Tran\n\nPixel Frog\n\nSzadi art\n\nMeghan Wittbrodt\n\nSylvia Ogweng`,
      {
        font: "space",
        letterSpacing: 3,
        size: 30,
      },
    ),
    k.pos(20, -170),
    k.color(k.WHITE),
  ]);

  k.onButtonPress("start", async () => {
    playerState.set("leaderboard", "Grassland");
    playerState.set("map", "level1");
    playerState.set("position", { x: 1030, y: 500 });
    await savePlayerData();
    k.go("level1");
  });
}
