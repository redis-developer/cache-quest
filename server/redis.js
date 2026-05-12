import { createClient } from "redis";

// process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

if (!process.env.REDIS_URL) {
  console.error("REDIS_URL not set ", process.env.REDIS_URL);
} else {
  console.log("Connecting to Redis Cloud");
}

/** @type {Record<string, ReturnType<typeof createClient>>} */
let clients = {};

/**
 * @param {import("redis").RedisClientOptions} [options]
 *
 * @returns {Promise<ReturnType<typeof createClient>>}
 */
export default async function getClient(options) {
  options = Object.assign(
    {},
    {
      url: process.env.REDIS_URL,
    },
    options
  );

  if (!options.url) {
    throw new Error("You must pass a URL to connect");
  }

  let client = clients[options.url];

  if (client) {
    return client;
  }

  client = createClient(options);

  client
    .on("error", (err) => {
      console.error("Redis Client Error", err);
      void refreshClient(client);
    })
    .connect();

  clients[options.url] = client;

  return client;
}

/**
 * @param {ReturnType<typeof createClient>} client
 */
async function refreshClient(client) {
  if (client) {
    const options = client.options;

    if (options?.url) {
      delete clients[options?.url];
    }

    await getClient(options);
  }
}
