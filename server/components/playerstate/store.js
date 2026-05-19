import getClient from "../../redis.js";
import { SCHEMA_FIELD_TYPE } from "redis";

/**
 * An error object
 * @typedef {Object} PlayerError
 * @property {number} status
 * @property {string} message
 *
 * A Player status
 * @typedef {"Player" | "in progress" | "complete"} PlayerStatus
 *
 * A Player object
 * @typedef {Object} Player
 * @property {string} name
 * @property {PlayerStatus} status
 * @property {string} created_date
 * @property {string} updated_date
 *
 * A Player document
 * @typedef {Object} PlayerDocument
 * @property {string} id
 * @property {Player} value
 *
 * A Player object
 * @typedef {Object} Players
 * @property {number} total
 * @property {PlayerDocument[]} documents
 */

const PLAYER_INDEX = "player-idx";
const PLAYER_PREFIX = "players:";

/**
 * Checks if the PLAYER_INDEX already exists in Redis
 *
 * @returns {Promise<boolean>}
 */
async function haveIndex() {
  const redis = await getClient();
  const indexes = await redis.ft._list();

  return indexes.some((index) => {
    return index === PLAYER_INDEX;
  });
}

/**
 * Creates the PLAYER_INDEX if it doesn't exist already
 *
 * @returns {Promise<void>}
 */
export async function createIndexIfNotExists() {
  const redis = await getClient();

  if (!(await haveIndex())) {
    await redis.ft.create(
      PLAYER_INDEX,
      {
        "$.id": {
          AS: "id",
          type: SCHEMA_FIELD_TYPE.TEXT,
        },
        "$.name": {
          AS: "name",
          type: SCHEMA_FIELD_TYPE.TEXT,
        },
      },
      {
        ON: "JSON",
        PREFIX: PLAYER_PREFIX,
      },
    );
  }
}

/**
 * Drops the PLAYER_INDEX if it exists
 *
 * @returns {Promise<void>}
 */
export async function dropIndex() {
  const redis = await getClient();

  if (await haveIndex()) {
    await redis.ft.dropIndex(PLAYER_INDEX);
  }
}

/**
 * Initializes Player index if necessary
 *
 * @returns {Promise<void>}
 */
export async function initialize() {
  await createIndexIfNotExists();
}

const Player_REGEXP = new RegExp(`^${PLAYER_PREFIX}`);

/**
 * Allow for id with or without PLAYER_PREFIX
 *
 * @param {string} id
 * @returns {string}
 */
function formatId(id) {
  return Player_REGEXP.test(id) ? id : `${PLAYER_PREFIX}${id}`;
}

/**
 * Gets all game
 *
 * @returns {Promise<Players>}
 */
export async function all() {
  const redis = await getClient();

  return /** @type {Promise<Players>} */ (redis.ft.search(PLAYER_INDEX, "*"));
}

/**
 * Gets a Player by id
 *
 * @param {string} id
 * @returns {Promise<Player | PlayerError | null>}
 */
export async function one(id) {
  const redis = await getClient();

  const Player = await redis.json.get(formatId(id));

  if (!Player) {
    return { status: 404, message: "Not Found" };
  }

  return /** @type {Player} */ (Player);
}

/**
 * Searches for player by name and/or status
 *
 * @param {string} [id]
 * @param {string} [name]
 * @returns {Promise<Players>}
 */
export async function search(name, id) {
  const redis = await getClient();
  const searches = [];

  if (id) {
    searches.push(`@id:"${id}"`);
  }

  if (name) {
    searches.push(`@name:(${name})`);
  }

  return /** @type {Promise<Players>} */ (redis.ft.search(PLAYER_INDEX, searches.join(" ")));
}

/**
 * Creates a Player
 *
 */
export async function create(playerData) {
  const redis = await getClient();

  const result = await redis.json.set(formatId(playerData.id), "$", playerData);

  if (result?.toUpperCase() === "OK") {
    return { status: 200, message: "Player created" };
  } else {
    return { status: 400, message: "Player is invalid" };
  }
}

/**
 * Updates a Player
 *
 */
export async function update(playerData) {
  const redis = await getClient();

  const PlayerOrError = await one(playerData.id);

  if (!PlayerOrError || isFinite(/** @type {number} */ (PlayerOrError.status))) {
    return { status: 404, message: "Not Found" };
  }

  const result = await redis.json.set(formatId(playerData.id), "$", playerData);

  if (result?.toUpperCase() === "OK") {
    return { status: 200, message: "Player updated" };
  } else {
    return { status: 400, message: "Player is invalid" };
  }
}

/**
 * Deletes a Player
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
    await redis.del(game.documents.map((Player) => Player.id));
  }
}
