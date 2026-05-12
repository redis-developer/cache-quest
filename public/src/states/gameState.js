export default function gameStateSingleton() {
  let instance = null;

  function createInstance() {
    let state = {
      //game id
      id: 6379,

      //chapter int used for npc dialog
      story: { chapter: 1, subchapter: 1 },

      //booleans used to spawn dungeon boss and initiate end of chapter dialogue
      bossDefeated: {
        chapter1: false,
        chapter2: false,
        chapter3: false,
        chapter4: false,
      },

      //booleans used to spawn portal to survivor mode, not used
      // suvivorMode: { chapter1: true, chapter2: true, chapter3: true },

      // chest: { lair: true },
    };

    return {
      get() {
        //using spread operator to return a copy of the state object
        //ensures that modifications to the copy do not affect the original state
        return { ...state };
      },

      set(property, value) {
        switch (arguments.length) {
          case 2:
            state[property] = value;
            break;
          case 3:
            state[property][value] = arguments[2];
            break;
          case 4: //untested
            state[property][value][arguments[2]] = arguments[3];
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
