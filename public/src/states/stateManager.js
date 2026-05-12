import gameStateSingleton from "./gameState.js";
import playerStateSingleton from "./playerState.js";

export const gameState = gameStateSingleton().getInstance();
export const playerState = playerStateSingleton().getInstance();
