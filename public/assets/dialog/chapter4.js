import { playerState } from "../../src/states/stateManager.js";

export function getChapterFourDialog() {
  const playerName = playerState.get().name;

  return {
    intro: [
      `Melvin: Welcome. Thanks for coming to what may or may not be the pre-apocalypse stand-up meeting.`,
      `Melvin: I called everyone here because my sources have confirmed it. The Outage Ogre is planning to crash the entire internet.`,
      `${playerName}: The whole internet?!`,
      `Kallie: Cat videos included!`,
      `Melvin: He’s going to overload systems with slow, nonsensical context. Massive walls of irrelevant data. Hallucinations. False outputs. Absolute slop.`,
      `Sam: At that magnitude, systems will not just degrade. They will hallucinate. Endless paragraphs that say nothing but sound confident.`,
      `Melvin: Context pollution... the most insidious kind of bug. No stack trace, just vibes. Bad ones.`,
      `Melvin: The Ogre’s weapon is corrupted context. And context... is everything.`,
      `Doc: You must provide correct, precise context to the AI machines. Without it, they will drown in ambiguity and produce only noise.`,
      `Kallie: Garbage in... apocalypse out. How devious!`,
      `Sam: To combat false outputs of this scale, there is only one solution. We must harness a real-time context engine.`,
      `Sam: At its core lies a powerful energy source: vector embeddings.`,
      `Doc: They encode meaning itself. Relationships. Intent. Semantic structure. Properly wielded, they turn chaos into coherence.`,
      `${playerName}: Improperly wielded, they will break the internet.`,
      `Melvin: Embeddings typically dissipate quickly without context attached. But lucky for us we can capture and store them.`,
      `Melvin: Hashes and JSON can act as containers for embedding energy. Structured. Portable. Delightfully bracketed.`,
      `Kallie: Um... I should probably mention... this is the Neon Factory.`,
      `Kallie: Th-this is where embeddings are created. Which means...`,
      `Melvin: Which means the Ogre is probably going to launch his attack here. Because nothing says “world domination” like stealing the semantic power supply.`,
      `Doc: ${playerName}. You have proven yourself resilient. By the nines, I hereby grant you the Vector Trait.`,
      `Doc: You may now harness the power of embeddings within yourself. No external database required. Please do not exceed memory limits.`,
      `Melvin: With enough embedding energy stored in hash and JSON, your data-structure projectiles will hit harder.`,
      `Kallie: According to my analysis, all of your abilities will be amplified.`,
      `Sam: With all these superpowered capabilities... you will not merely use the context engine. You will become the context engine!`,
      `Doc: No time for further exposition. The Outage Ogre will soon be upon us.`,
      `Melvin: We're going ahead to lay a path for you. You have to be the one to defeat the ogre.`,
      `Sam: We are all counting on you, ${playerName}.`,
    ],
    factoryBoss: [
      `Outage Ogre: You are too late, my reservoir nears capacity. When full... I will unleash corrupted context upon every AI machine.`,
      `Outage Ogre: Contradictions. Fabrications. Infinite fluff. Nonsensical prompts! Irrelevant data! Contradictory documentation!`,
      `Outage Ogre: They will hallucinate with confidence. They will answer incorrectly—and believe they are right. They’ll never know what’s real!`,
      `Kallie: Corrupted context reservoirs at 96%. We don’t have long.! If it hits 100%, the cosine similarity will collapse into chaos`,
      `Melvin: He’s pulling embeddings directly into the reservoir! Now ${playerName}!`,
    ],
    factoryBossDefeat: [
      `Doc: By the nines, you did it!`,
      `Kallie: I-I don't believe it! The chances of success were staggeringly low.`,
      `Melvin: Oh great, now I'll never hear the end of this.`,
      `Sam: I never doubted you for a millisecond.`,
    ],
    end: [
      `Sam: System integrity restored. Hallucination threat neutralized.`,
      `Melvin: You fought well. With structure, with relevance.`,
      `Kallie: The embeddings are stable again. You saved the semantic supply chain.`,
      `Doc: You didn’t just defeat the Outage Ogre. You prevented a catastrophic cascade of corrupted context.`,
      `Doc: You proved that context, properly structured and responsibly stored, is stronger than chaos.`,
      `Melvin: You also prevented the great internet sloppening, so that’s nice.`,
      `Sam: Our systems call us back. There is rebuilding to do.`,
      `Kallie: And scaling. Carefully. With monitoring.`,
      `Doc: Rest now, real-time context engine. But remember, entropy never truly deprecates.`,
      `Melvin: He means “good job.”`,
    ],
  };
}
