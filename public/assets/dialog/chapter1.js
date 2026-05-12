import { playerState } from "../../src/states/stateManager.js";

export function getChapterOneDialog() {
  const playerName = playerState.get().name;

  return {
    intro: [
      `${playerName}: Hello there.`,
      `Doc: Name’s Doc, though don’t go thinking I fix bones or viruses. I’m more of a guide than a doctor.`,
      `Doc: First guidance I'll give you is to press 'E' to interact with your surroundings, 'Tab' for information, and press 'Esc' to skip any dialogue.`,
      `Doc: But enough of that. Right now, we’ve got ourselves a bit of a cache crisis.`,
      `${playerName}: A cache crisis? That sounds serious.`,
      `Doc: It’s Sam, poor fella’s a turtle. Not the fastest creature, I’ll admit, but lately he’s been crawling. The Latency Goblins got him.`,
      `${playerName}: Latency Goblins?`,
      `Doc: Nasty little packets of mischief. They’ve dragged Sam off to their lair. They want him sluggish so users lose patience and everything starts to lag.`,
      `${playerName}: That explains the panic. So what do we do?`,
      `Doc: We? Ha! Nice try. You’re going to the Lair of Latency Goblins. I’d go myself, but someone’s got to stay here and manage the AOF.`,
      `Doc: Please, ${playerName}. Rescue Sam before it’s too late.`,
      `${playerName}: Alright, Doc. I’ll find Sam and bring him back snappy.`,
      `Doc: That’s the spirit! You must venture forth to the Lair of Latency Goblins and save him!`,
      `Doc: I wish you good luck and sub-ms speed.`,
    ],
    lairEntrance: [
      `Goblin: Intruder! Who dares enter the Lair of the Latency Goblins?!`,
      `${playerName}: I’m here to rescue Sam. Release him and you might live to delay another day!`,
      `Goblin: Sam?! The turtle who used to move fast? He belongs to us now. The slower he crawls, the stronger we grow.`,
      `${playerName}: Not for long. I’m taking him back.`,
      `Goblin: Wha—! No! You can’t be here! Guards! Guards! The intruder seeks the turtle! Sound the alarm!`,
    ],
    lairBoss: [
      `${playerName}: Sam! Hang on, I’m here to get you out of this.`,
      `Sam: You...? Another goblin trick. I’ve seen your kind before. You slow me down, whisper lies of elasticity and false promises of five 9's.`,
      `Sam: But when the inevitable faltering of US-East quakens the foundations of the Net, all is lost.`,
      `${playerName}: No, Sam! I’m not one of them. Doc sent me to find you.`,
      `Sam: They used that name before to lead me further into this maze. Keeping me trapped here away from my guardianship.`,
      `${playerName}: The goblins want to keep you trapped so everything lags to a crash.`,
      `Sam: Enough! I will not be led further astray.`,
    ],

    end: [
      `Doc: Sam! By the nines, you’re alive! I thought the goblins had drained the last bit of bandwidth out of you!`,
      `Sam: It was close.  I was starting to believe I’d never be snappy again.`,
      `Doc: You actually did it. You faced the goblins and that’s no small feat.`,
      `${playerName}: I just did what needed to be done. But... why did the goblins want Sam so badly?`,
      `Doc: You’ve seen what they can do, slowing everything, spreading lag, choking the flow.`,
      `Doc: You see, Sam’s not just a turtle. He's the data sync app of Skyflow Kingdom. When he slows down, everything slows down with him.`,
      `Doc: Without him, the whole network of this system begins to drift apart.`,
      `Sam: Every second of balance runs through me, that’s why they wanted me stuck.`,
      `Doc: And that’s why we’ll need you both in what’s coming next.`,
      `Doc: The goblins were only the beginning, their master is already preparing for the next phase.`,
      `${playerName}: You’re saying this was just the warm-up?`,
      `Doc: I’m afraid so. You can hone your skills by defeating more goblins in survivor mode. You can get there by the sword in the stone to the north`,
      `Doc: When you're ready to move on, examine the owl statue on the beach to the south.`,
    ],
  };
}
