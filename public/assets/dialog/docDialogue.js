import { playerState } from "../../src/states/stateManager.js";

export function getDocDialogue() {
  const playerName = playerState.get().name;
  const SPEAKER = "Doc";

  return {
    chapter1_2: [
      `${SPEAKER}: What are you still doing here, ${playerName}!? Sam is not going to save himself! Also, press 'Tab' to see the controls.`,
    ],
    chapter2_1: [
      `${SPEAKER}: Interact with the sword in the stone to get to Grassland survivor or the owl statue on the beach to go to the next level.`,
    ],
    chapter2_2: [
      `${SPEAKER}: It's hightime we singe the sinewy spider webs of obsolescence. Press 'F' when close to an enemy to fire a data structure projectile.`,
    ],
    chapter3_1: [
      `${SPEAKER}: Deprecation is a perpetual problem as time ticks. Fend off their waves in Mountains survivor by examining the sword in the stone.`,
      `${SPEAKER}: Find the owl statue to the west of here when you're ready to move on.`,
    ],
    chapter3_2: [
      `${SPEAKER}: Hold 'Shift' to activate your hybrid shield. Remember this only work outside survival modes.`,
    ],
    chapter4_1: [
      `${SPEAKER}: Excellent work! Now Kallie will have the capacity to scale. No time for rest now. Something big is coming, ${playerName}.`,
      `${SPEAKER}: You must prepare yourself. Enter the Badlands survivor to fend off waves of enemies and train your skills.`,
    ],
    chapter4_2: [
      `${SPEAKER}: We must not tarry. Let us make our way to Copper mountain to speak to Melvin. There is an owl statue south of here.`,
    ],
    chapter4_3: [`${SPEAKER}: Referencing docs...`],
    chapter4_4: [`${SPEAKER}: I'll cast a protection on everyone. Go on ahead, ${playerName}.`],
    chapter4_5: [`${SPEAKER}: I'll cast a protection on everyone. Go on ahead, ${playerName}.`],
    chapter4_6: [`${SPEAKER}: I'll cast a protection on everyone. Go on ahead, ${playerName}.`],
    chapter4_7: [`${SPEAKER}: I'll cast a protection on everyone. Go on ahead, ${playerName}.`],
    chapter4_8: [`${SPEAKER}: ${playerName}, you must destroy the reservoirs now!`],
    chapter5_1: [`${SPEAKER}: Remember, entropy never truly deprecates.`],
  };
}
