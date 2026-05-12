import { playerState } from "../../src/states/stateManager.js";

export function getKallieDialogue() {
  const playerName = playerState.get().name;
  const SPEAKER = "Kallie";

  return {
    chapter1_2: [
      `${SPEAKER}: I'm not supposed to be here yet. You must be debugging something, carry on.`,
    ],
    chapter2_1: [
      `${SPEAKER}: I'm not supposed to be here yet. You must be debugging something, carry on.`,
    ],
    chapter2_2: [
      `${SPEAKER}: I'm not supposed to be here yet. You must be debugging something, carry on.`,
    ],
    chapter3_1: [
      `${SPEAKER}: I'm not supposed to be here yet. You must be debugging something, carry on.`,
      ,
    ],
    chapter3_2: [
      `${SPEAKER}: If those skeletons don’t go, my system is going to time out forever...`,
    ],
    chapter4_1: [`${SPEAKER}: My dashboards shows green for resources for now... `],
    chapter4_2: [`${SPEAKER}: Did you get a message from Melvin too?`],
    chapter4_3: [`${SPEAKER}: Analyzing chances of winning...`],
    chapter4_4: [`${SPEAKER}: Analyzing chances of winning...`],
    chapter4_5: [
      `${SPEAKER}: How am I supposed to ingest clean data with all of these skeletons swarming me!`,
    ],
    chapter4_6: [
      `${SPEAKER}: How am I supposed to ingest clean data with all of these skeletons swarming me!`,
    ],
    chapter4_7: [
      `${SPEAKER}: Analysis complete. The Ogre almost has all the embeddings he needs. ${playerName}, you must hurry!`,
    ],
    chapter5_1: [`${SPEAKER}: Scaling carefully with monitoring.`],
  };
}
