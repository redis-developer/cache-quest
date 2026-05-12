import { playerState } from "../../src/states/stateManager.js";

export function getNpcDialogue() {
  // const playerName = playerState.get().name;

  //NPC name labels
  const PAWN = "Helper";
  const GNOME = "Gnome";
  const LIZARD = "Hatchling";
  const SNAKE = "Snake";
  const GNOLL = "Gnoll";

  return {
    pawn1: [
      `${PAWN}: Here is the Lair of Latency Goblins.`,
      `${PAWN}: Press 'Esc' key to skip any dialogue and cutscenes. I wish you sub-ms speed.`,
    ],
    pawn2: [
      `${PAWN}: Welcome to the Skyflow Kingdom, a real-time system. Sam is our resident data sync app.`,
    ],
    pawn3: [
      `${PAWN}: Upgrade your stats, coming soon... maybe...`,
      `${PAWN}: Depends on how my visitors we get`,
    ],
    pawn4: [
      `${PAWN}: Press 'Esc' key to skip any dialogue and cutscenes.`,
      `${PAWN}: Press 'Tab' open see the controls.`,
    ],
    pawn5: [
      `${PAWN}: Interact with the sword in the stone to enter Grassland survivor. Beware, the enemies there are different. `,
      `${PAWN}: Everytime you enter, your skills reset and you start back at level 1. You must level up again to relearn your skills.`,
    ],
    pawn6: [`${PAWN}: There are other systems that needs assistance beyond this one.`],

    gnome1: [
      `${GNOME}: This is the entrance to the Dungeon of Deprecation Spiders within Copper Mountain.`,
      `${GNOME}: Press 'F' to fire a projectile, this will automatically target the closest enemy.`,
    ],
    gnome2: [
      `${GNOME}: Welcome to Copper Mountain a data storage system, Melvin is our data manager app.`,
    ],
    gnome3: [`${GNOME}: There is a different leaderboard for each location.`],
    gnome4: [
      `${GNOME}: You can actually use a controller to play most of this game.`,
      `${GNOME}: This feature is still in beta so keep your keyboard and mouse handy.`,
    ],
    gnome5: [
      `${GNOME}: Stronger enemies will appear the longer you stay in Survival mode. They also give more experience.`,
    ],
    gnome6: [`${GNOME}: The fireballs do twice as much damage as the shurikens.`],
    gnome7: [`${GNOME}: I wonder when RAM prices will go down.`],

    lizard1: [
      `${LIZARD}: This is the Oasis, an analytics system. We take in all species of data.`,
      `${LIZARD}: Kallie is the resource manager app. She's also my mom.`,
    ],
    lizard2: [
      `${LIZARD}: Mama Kallie took everyone in, now she's constantly under stress.`,
      `${LIZARD}: When I'm older, I'll help load balance.`,
    ],
    lizard3: [
      `${LIZARD}: We need scales to scale out our Oasis.`,
      `${LIZARD}: I wonder where they came from.`,
    ],
    lizard4: [
      `${LIZARD}: The more visitors we get, the more likely that we will get new features.`,
    ],
    snake1: [
      `${SNAKE}: Up ahead is the Badlands of Bottleneck Skeletons. I sense something else there though, something much more else...`,
      `${SNAKE}: Hold 'Shift' while you're in there to use your shield.`,
    ],
    snake2: [
      `${SNAKE}: It appearss that scaless are required.`,
      `${SNAKE}: Would snakess scaless do? Perhapss if more players visit, we will find out...`,
    ],
    snake3: [
      `${SNAKE}: My slytherin brethren are able to escape the heat within the walls of this Oasis.`,
      `${SNAKE}: Other species in this melting pot are not as capable.`,
    ],
    snake4: [
      `${SNAKE}: Suspisouss that Survivor mode is the only way to get onto the leaderboards.`,
      `${SNAKE}: Maybe if this game getss more players, there will be more leaderboardss.`,
    ],
    gnoll1: [`${GNOLL}: The SQL table refused to talk to the string, it wasn't their type! 🤣`],
    gnoll2: [`${GNOLL}: I live here!`],
    gnoll3: [
      `${GNOLL}: Kallie building more houses for us. She soupa nice.`,
      `${GNOLL}: Prolly good in soup too.`,
    ],
    gnoll4: [`${GNOLL}: We takeover badlands someday, Oasis good for now.`],
    gnoll5: [`${GNOLL}: I am a gnoll not a gnome, although I don't know.`],
  };
}
