export default function playerStateSingleton() {
  let instance = null;

  function createInstance() {
    let state = {
      id: 6379,
      name: "Redis",
      attack: { dungeon: 5, survivor: 5 },
      health: { dungeon: 100, survivor: 100 },
      speed: { dungeon: 250, survivor: 200 },
      highScore: { Grassland: 0, Mountains: 0, Badlands: 0 },

      leaderboard: "Grassland",
      map: "level1",
      position: { x: 1280, y: 575 }, //ch1 start
      // position: { x: 1100, y: 170 }, //leaderboard
      // position: { x: 1030, y: 500 }, //ch1 end

      // map: "level2",
      // position: { x: 1600, y: 850 },
      // map: "level3",
      // position: { x: 1920, y: 900 },
      // map: "level4",
      // position: { x: 580, y: 440 },

      // map: "lair",
      // position: { x: 290, y: 1450 },
      // position: { x: 2950, y: 1500 }, //boss
      // map: "dungeon",
      // position: { x: 180, y: 2640 },
      // position: { x: 950, y: 380 }, //boss
      // map: "badlands",
      // position: { x: 600, y: 2500 },
      // position: { x: 1800, y: 450 }, //boss
      // map: "neonfactory",
      // position: { x: 160, y: 3100 },
      // position: { x: 500, y: 2200 }, //melvin
      // position: { x: 500, y: 1200 }, //kallie
      // position: { x: 1300, y: 300 }, //boss

      // map: "survivor1",
      // map: "survivor2",
      // map: "survivor3",

      // map: "credits",

      skillUnlocked: { swordBeam: true, shuriken: false, shieldAura: false },
      enemiesKilled: { goblin: 0, spider: 0, skeleton: 0, vampire: 0 },
      // survivorMode: { health: 100, speed: 180 }, //TODO: upgradable with currency
      // dungeonMode: { health: 100, speed: 180 }
    };

    return {
      get() {
        //using spread operator to return a copy of the state object
        //ensures that modifications to the copy do not affect the original state
        return { ...state };
      },

      set(arg1, arg2) {
        switch (arguments.length) {
          case 2:
            state[arg1] = arg2;
            break;
          case 3:
            state[arg1][arg2] = arguments[2];
            break;
          case 4: //untested
            state[arg1][arg2][arguments[2]] = arguments[3];
            break;
        }
      },

      load(data) {
        state = data;
      },
    };
  }

  //singleton
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
}
