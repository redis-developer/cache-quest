import { playerState } from "../../src/states/stateManager.js";

export function getSamDialogue() {
  const playerName = playerState.get().name;
  const SPEAKER = "Sam";

  return {
    guard1: [
      `${playerName}: Doc sent me, the system needs you moving again.`,
      `${SPEAKER}: Doc... He is still out there?`,
      `${SPEAKER}: Maybe... maybe I have been fighting the wrong enemy. I can feel the corruption fading...`,
      `${SPEAKER}: I see that your time unit is milliseconds, give me a few thousand to catch my breath.`,
    ],
    guard2: [
      `${SPEAKER}: ...`,
      `${SPEAKER}: ...  ...`,
      `${SPEAKER}: Okay, ${playerName}. Let us go.`,
    ],
    survivorMode: [
      `${SPEAKER}: You may have thinned their ranks at their lair but our work is far from over.`,
      `${SPEAKER}: There is another place where they congregate en masse. Examine the sword in the stone to get there`,
    ],
    chapter1_2: [
      `${SPEAKER}: I am not supposed to be here yet. Oh, you must be debugging something. Carry on.`,
    ],
    chapter2_1: [
      `${SPEAKER}: Thank you for getting me out of the lair. You may have thinned their ranks but our work is far from over.`,
      `${SPEAKER}: There is another place where they congregate en masse. The only way to get there is by the sword in the stone at the northern edge of this island.`,
    ],
    chapter2_2: [`${SPEAKER}: Spiders... hmm...`],
    chapter3_1: [`${SPEAKER}: Good work with the spiders.`],
    chapter3_2: [`${SPEAKER}: Kallie sounds serious. Frantic but serious.`],
    chapter4_1: [`${SPEAKER}: Good work with the skeletons.`],
    chapter4_2: [`${SPEAKER}: It seems that our presence is required.`],
    chapter4_3: [`${SPEAKER}: We are all counting on you, ${playerName}`],
    chapter4_4: [`${SPEAKER}: Quick! Get the embeddings!`],
    chapter4_5: [`${SPEAKER}: Looks like those embeddings also powered up your Cache Beam attack.`],
    chapter4_6: [`${SPEAKER}: Looks like those embeddings also powered up your Cache Beam attack.`],
    chapter4_7: [`${SPEAKER}: Looks like those embeddings also powered up your Cache Beam attack.`],
    chapter5_1: [`${SPEAKER}: There is rebuilding to do.`],
  };
}
