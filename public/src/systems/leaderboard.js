import k from "../kaplayContext.js";
import { playerState } from "../states/stateManager.js";
import {
  COLOR_CHARCOAL,
  COLOR_CHARCOAL04,
  COLOR_CHARCOAL05,
  COLOR_GOLD,
  COLOR_PARCHMENT,
} from "./constants.js";

export function createLeaderboard(size, entries) {
  const boardTitle = playerState.get().leaderboard;

  //translucent background and base attributes
  const board = k.add([
    //translucent background
    k.rect(k.width(), k.height()),
    k.anchor("center"),
    k.color(k.BLACK),
    k.opacity(0.4),
    //attributes persists for child objects
    k.pos(k.center()),
    k.fixed(),
    k.layer("ui"),
    "leaderboard",
  ]);

  //leaderboard
  board.add([k.rect(size.width, size.height), k.anchor("center"), k.color(COLOR_CHARCOAL)]);

  //borders
  board.add([k.sprite("border"), k.pos(-size.width / 2, -size.height / 2)]);
  board.add([k.sprite("border", { flipX: true }), k.pos(size.width / 2 - 25, -size.height / 2)]);

  //leaderboard title
  board.add([
    // boardTitle.charAt(0).toUpperCase() + boardTitle.slice(1)
    k.text(boardTitle + " Survivor", {
      font: "redaction-bold",
      letterSpacing: 3,
      size: size.text * 3,
    }),
    k.pos(0, -size.height / 2 + size.padding.top),
    k.color(COLOR_GOLD),
    k.anchor("center"),
  ]);

  board.add([
    k.text("LEADERBOARD", {
      font: "space",
      letterSpacing: 3,
      size: size.text,
    }),
    k.pos(0, -size.height / 2 + size.padding.top + size.text * 3),
    k.color(COLOR_GOLD),
    k.anchor("center"),
  ]);

  //TODO: implement fakeMouse for gamepad
  //https://kaplayjs.com/docs/guides/fake_mouse/

  for (const entry of entries)
    createEntry(
      board,
      -250,
      {
        width: size.width - size.padding.side * 2,
        height: 40,
        text: size.text,
        padding: 10,
      },
      entry,
    );

  //interactable elements must be a separate object
  //the k.fixed() component removes button handler events
  createCloseButton();

  board.onButtonPress("esc", () => {
    destroyLeaderboard();
  });
}

function createEntry(container, offset, size, ent) {
  const entry = container.add([
    k.rect(size.width, size.height, { radius: 4 }),
    k.pos(0, offset + (size.height + size.padding) * ent.rank),
    k.color(COLOR_CHARCOAL05),
    k.outline(2, k.rgb(COLOR_CHARCOAL04)),
    k.anchor("center"),
    // k.area(),
  ]);

  //entry rank
  entry.add([
    k.pos(-size.width / 2 + 10, 0),
    k.color(COLOR_GOLD),
    k.text(ent.rank.toString().padStart(2, "0"), {
      font: "space",
      size: size.text,
    }),
    k.anchor("left"),
  ]);

  //entry name
  entry.add([
    k.pos(-size.width / 2 + 50, 0),
    k.color(k.WHITE),
    k.text(ent.name.toUpperCase(), {
      font: "space",
      size: size.text,
      letterSpacing: 1.2,
    }),
    k.anchor("left"),
  ]);

  //entry score
  entry.add([
    k.pos(size.width / 2 - 20, 0),
    k.color(k.WHITE),
    k.text(ent.score.toLocaleString(), {
      font: "space",
      size: size.text,
      letterSpacing: 1.2,
      // align: "center",
    }),
    k.anchor("right"),
  ]);

  //requires k.area component
  // entry.onHover(() => {
  //   entry.color = k.rgb(138, 153, 160); // Dusk 50%
  // });

  // entry.onHoverEnd(() => {
  //   entry.color = k.rgb(92, 112, 122); // Dusk 70%
  // });
}

function createCloseButton() {
  const button = k.add([
    k.rect(20, 20, { radius: 4 }),
    k.pos(k.getCamPos().add(-340, -185)),
    k.color(COLOR_GOLD),
    k.outline(1),
    k.area(),
    k.anchor("center"),
    k.layer("ui"),
    "leaderboard",
  ]);

  //button text
  button.add([
    k.text("X", {
      font: "space",
      size: 16,
    }),
    k.color(k.BLACK),
    k.anchor("center"),
  ]);

  button.onHover(() => {
    button.color = k.rgb(COLOR_PARCHMENT);
  });

  button.onHoverEnd(() => {
    button.color = k.rgb(COLOR_GOLD);
  });

  button.onClick(() => {
    destroyLeaderboard();
  });

  return button;
}

function destroyLeaderboard() {
  const lb = k.get("leaderboard");

  for (const e of lb) e.destroy();

  //TODO: remove fakeMouse
  //https://kaplayjs.com/docs/guides/fake_mouse/

  //unpause game
  k.pressButton("pause");
}
