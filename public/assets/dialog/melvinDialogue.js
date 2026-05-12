import { playerState } from "../../src/states/stateManager.js";

export function getMelvinDialogue() {
  const playerName = playerState.get().name;
  const SPEAKER = "Melvin";

  return {
    chapter1_2: [
      `${SPEAKER}: I'm not supposed to be here yet. Oh, you must be debugging something. Carry on.`,
    ],
    chapter2_1: [`${SPEAKER}: Hey there, thanks for answering my call.`],
    chapter2_2: [`${SPEAKER}: Please eradicate the Deprecation Spiders from Copper Mountain.`],
    chapter3_1: [
      `${SPEAKER}: Thank goodness the Spider queen is defeated, although her minions are still lurking. Thin their ranks in Mountains survivor.`,
    ],
    chapter3_2: [`${SPEAKER}: Please help out my friend Kallie, she could surely use it.`],
    chapter4_1: [
      `${SPEAKER}: Thank you so much for aiding my friend! She now has more room to breathe.`,
    ],
    chapter4_2: [`${SPEAKER}: Let's meet up with the others.`],
    chapter4_3: [
      `${SPEAKER}: We're going ahead to lay a path for you. You have to be the one to defeat the ogre.`,
    ],
    chapter4_4: [`${SPEAKER}: Just like we planned, ${playerName}! Get the embeddings!`],
    chapter4_5: [`${SPEAKER}: Just like we planned, ${playerName}! Get the embeddings!`],
    chapter4_6: [
      `${SPEAKER}: Kallie snuck past the spiders. Said she needed to do some analysis. That lizard is far braver than I ever thought!`,
    ],
    chapter4_7: [
      `${SPEAKER}: Kallie snuck past the spiders. Said she needed to do some analysis. That lizard is far braver than I ever thought!`,
    ],
    chapter5_1: [`${SPEAKER}: Good job, ${playerName}.`],
  };
}
