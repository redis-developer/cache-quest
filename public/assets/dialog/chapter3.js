import { playerState } from "../../src/states/stateManager.js";

export function getChapterThreeDialog() {
  const playerName = playerState.get().name;

  return {
    intro: [
      `Kallie: Oh, hi! Hello! Wow, you loaded fast. Sorry. Sorry. New connections make my monitoring nervous.`,
      `Doc: This place could do with some greenery with all of this aridity.`,
      `Kallie: Welcome to Oasis, my little corner of order in this analytics system.`,
      `Doc: Ah, analytics. Where numbers go in, answers come out, and nobody agrees on the dashboard.`,
      `${playerName}: Hello Kallie. Nice place you’ve got here. Very... horizontally ambitious.`,
      `Kallie: Everything is under load. I haven’t slept since my last deploy! My users are adding filters faster than I can index.`,
      `Kallie: Costs are climbing. Bottlenecks everywhere. I’m this close to... vertical scaling.`,
      `${playerName}: Whoa. Let’s not say things we can’t take back.`,
      `Doc: Great traffic, terrible performance?`,
      `Kallie: Exactly. I'm one bottleneck away from a full-on incident report or worse, a root cause analysis.`,
      `Doc: Kallie, breathe. You’re swapping faster than a runaway thread.`,
      `Kallie: Okay, okay. So. My ecosystem grows when I collect scales, my resource units.`,
      `${playerName}: But something is keeping you from collecting scales?`,
      `Kallie: YES. Bottleneck skeletons! They infest the badlands, throttle everything, and steal my scales!`,
      `Kallie: Please. Clear them out. I just want to scale without being robbed by undead cost centers.`,
      `${playerName}: Alright. I’ll clear the Badlands. No bottlenecks, no undead, no surprise cloud bills.`,
      `Doc: ${playerName} before you go, behold the hybrid shield. Keyword literal precision on one side, vector similarity on the other.`,
      `Doc: It oscillates between offense and defense. Hold 'Shift' to activate your hybrid shield while you're in the badlands.`,
    ],
    badlandsEntrance: [
      `Skeleton: Bubf... buffering... suhh... suffering`,
      `${playerName}: Buffer and suffer no more!`,
    ],
    badlandsBoss: [
      `Cost vampire: Ahhhh, I smell... overprovisioning.`,
      `${playerName}: You charge by the mistake don't you?`,
      `Cost vampire:  By each request. By each retry. By each mistake. I thrive on inefficiency. Redundant queries. Overprovisioned clusters.`,
      `${playerName}: Sorry. I’m on a budget.`,
    ],
    end: [
      `Kallie: You. You got the scales back?`,
      `${playerName}: All of them. Even the ones labeled "temporary workaround."`,
      `Kallie: Oh thank the load balancers.`,
      `Doc: Look at that. Horizontal growth. Vertical relief. Sustainable throughput.`,
      `Kallie: Thank you, thank you ${playerName}. I’ll name a dashboard after you!`,
      `Doc: You did it, ${playerName}. You have restored throughput and brought uptime back to SLA levels.`,
      `Doc: And yet... I sense a disturbance in the bandwidth. A spike in entropy. Something wicked this way pings. You must continue to hone your skills. Push your limits.`,
      `Doc: Enter the Badlands survivor. There, you will face waves of malformed latency, bottlenecks, and poorly documented APIs.`,
      `Doc: If you can endure that... you may endure what comes next.`,
    ],
    transition: [
      `Message from Melvin: URGENT - ${playerName} come see me right away. Something has happened.`,
    ],
  };
}
