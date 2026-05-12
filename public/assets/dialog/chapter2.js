import { playerState } from "../../src/states/stateManager.js";

export function getChapterTwoDialog() {
  const playerName = playerState.get().name;

  return {
    intro: [
      `Melvin: Finally! I put in a request for a Docs reference cycles ago. My system is... let’s say deprecated-adjacent.`,
      `${playerName}: Define "deprecated-adjacent".`,
      `Melvin: My storage is rigid, inflexible. The information contained here needs the capability to grow, shrink, and pivot faster than a startup’s rebranding.`,
      `Melvin: I need more flexible data structures before everything collapses into a single, horrifying CSV!`,
      `Doc: Is that why everything looks so boxed in?`,
      `Melvin: I prefer the term "structured". Anyways, welcome to Copper Mountain! Where data is synonymous with permanence... mind the dangling pointers.`,
      `Melvin: Fixed sized arrays, everywhere. O(1) time complexity but let's face it, none of the flexibility. And the crown jewel, Dungeon of Deprecation Spiders.`,
      `${playerName}: Let me guess. Legacy code?`,
      `Melvin: Legacy code with opinions! The spiders spin their sinewy webs of obsolescence, APIs nobody remembers adding but everything somehow depends on.`,
      `Doc: You can’t just brute force technical debt. Alright ${playerName}, It’s time to start throwing data structures.`,
      `${playerName}: Ninja stars?`,
      `Doc: Hash Shuriken, constant-time razors. Fast, precise, and can slice through those insidious webs. That’s not all.`,
      `Doc: These are JSON fireballs. They’re versatile and burn through spider webs like a garbage collector through unused objects.`,
      `Doc: Press 'F' when close to an enemy to fire a data structure projectile.`,
      `${playerName}: Deprecation spiders, here we come.`,
    ],
    dungeonEntrance: [
      `Spider minion: This method... is still technically supported... Deprecated still means usable...`,
      `${playerName}: You’ve been enforcing rigid data long enough, time for modernization.`,
    ],
    dungeonBoss: [
      `Spider queen: You fools! My data access APIs may be old, but they are still documented. You cannot defeat me, I am bACKwARD coMPaTiBLe!`,
      `${playerName}: You’re technical debt with a crown. Time to update your APIs`,
    ],
    end: [
      `Melvin: My logs have quieted down. My ecosystem feels... extensible.`,
      `Doc: Vast flexibility at high speeds. Versatility is the best defense against obsolescence.`,
      `Doc: Basically, the more versatile the data, the fewer spiders.`,
      `Melvin: Can I get that on a t-shirt?`,
      `Doc: ${playerName}, fantastic job defeating the Spider queen! However, the lost of their queen will only slow the spiders down for the moment.`,
      `Doc: Deprecation is a perpetual problem as time ticks. Fend off their waves in Mountains survivor by examining the sword in the stone.`,
      `Doc: Find the owl statue to the west of here when you're ready to move on.`,
    ],
    transition: [`Melvin: Good you're here. Let's go meet up with the others at the Neon Factory.`],
  };
}
