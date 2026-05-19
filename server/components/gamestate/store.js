import getClient from "../../redis.js";
import { SCHEMA_FIELD_TYPE } from "redis";

/**
 * An error object
 * @typedef {Object} GameError
 * @property {number} status
 * @property {string} message
 *
 * A Game status
 * @typedef {"Game" | "in progress" | "complete"} GameStatus
 *
 * A Game object
 * @typedef {Object} Game
 * @property {string} name
 * @property {GameStatus} status
 * @property {string} created_date
 * @property {string} updated_date
 *
 * A Game document
 * @typedef {Object} GameDocument
 * @property {string} id
 * @property {Game} value
 *
 * A Game object
 * @typedef {Object} Games
 * @property {number} total
 * @property {GameDocument[]} documents
 */

const GAME_INDEX = "game-idx";
const GAME_PREFIX = "games:";

/**
 * Checks if the GAME_INDEX already exists in Redis
 *
 * @returns {Promise<boolean>}
 */
async function haveIndex() {
  const redis = await getClient();
  const indexes = await redis.ft._list();

  return indexes.some((index) => {
    return index === GAME_INDEX;
  });
}

/**
 * Creates the GAME_INDEX if it doesn't exist already
 *
 * @returns {Promise<void>}
 */
export async function createIndexIfNotExists() {
  const redis = await getClient();

  if (!(await haveIndex())) {
    await redis.ft.create(
      GAME_INDEX,
      {
        "$.id": {
          AS: "id",
          type: SCHEMA_FIELD_TYPE.TEXT,
        },
      },
      {
        ON: "JSON",
        PREFIX: GAME_PREFIX,
      },
    );
  }
}

/**
 * Drops the GAME_INDEX if it exists
 *
 * @returns {Promise<void>}
 */
export async function dropIndex() {
  const redis = await getClient();

  if (await haveIndex()) {
    await redis.ft.dropIndex(GAME_INDEX);
  }
}

/**
 * Initializes Game index if necessary
 *
 * @returns {Promise<void>}
 */
export async function initialize() {
  await createIndexIfNotExists();
}

const Game_REGEXP = new RegExp(`^${GAME_PREFIX}`);

/**
 * Allow for id with or without GAME_PREFIX
 *
 * @param {string} id
 * @returns {string}
 */
function formatId(id) {
  return Game_REGEXP.test(id) ? id : `${GAME_PREFIX}${id}`;
}

/**
 * Gets all game
 *
 * @returns {Promise<Games>}
 */
export async function all() {
  const redis = await getClient();

  return /** @type {Promise<Games>} */ (redis.ft.search(GAME_INDEX, "*"));
}

/**
 * Gets a Game by id
 *
 * @param {string} id
 * @returns {Promise<Game | GameError | null>}
 */
export async function one(id) {
  const redis = await getClient();

  const Game = await redis.json.get(formatId(id));

  if (!Game) {
    return { status: 404, message: "Not Found" };
  }

  return /** @type {Game} */ (Game);
}

/**
 * Searches for game by name and/or status
 *
 * @param {string} [id]
 * @returns {Promise<Games>}
 */
export async function search(id, status) {
  const redis = await getClient();
  const searches = [];

  if (id) {
    searches.push(`@id:(${id})`);
  }

  return /** @type {Promise<Games>} */ (redis.ft.search(GAME_INDEX, searches.join(" ")));
}

/**
 * Creates a Game
 *
 */
export async function create(gameData) {
  const redis = await getClient();

  const result = await redis.json.set(formatId(gameData.id), "$", gameData);

  if (result?.toUpperCase() === "OK") {
    return { status: 200, message: "Game created" };
  } else {
    return { status: 400, message: "Game is invalid" };
  }
}

/**
 * Updates a Game
 *
 */
export async function update(gameData) {
  const redis = await getClient();

  const GameOrError = await one(gameData.id);

  if (!GameOrError || isFinite(/** @type {number} */ (GameOrError.status))) {
    return { status: 404, message: "Not Found" };
  }

  const result = await redis.json.set(formatId(gameData.id), "$", gameData);

  if (result?.toUpperCase() === "OK") {
    return { status: 200, message: "Game updated" };
  } else {
    return { status: 400, message: "Game is invalid" };
  }
}

/**
 * Deletes a Game
 *
 * @param {string} id
 */
export async function del(id) {
  const redis = await getClient();

  await redis.json.del(formatId(id));
}

/**
 * Delete all game
 *
 * @returns {Promise<void>}
 */
export async function delAll() {
  const redis = await getClient();
  const game = await all();

  if (game.total > 0) {
    await redis.del(game.documents.map((Game) => Game.id));
  }
}
