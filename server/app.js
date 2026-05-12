import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import getClient from "./redis.js";
import * as playerstate from "./components/playerstate/index.js";
import * as gamestate from "./components/gamestate/index.js";
import * as leaderboard from "./components/leaderboard/index.js";

const app = express();

app.use(express.static("public"));

app.use(express.json());

const redisStore = new RedisStore({
  client: await getClient(),
  disableTTL: true,
  prefix: process.env.REDIS_SESSION_PREFIX,
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: true,
    secret: process.env.REDIS_SESSION_SECRET,
    rolling: true, //refreshes expiration on every response sent to client
    cookie: {
      secure: false, //if true only send cookie over https
      httpOnly: false, //if true prevent client from reading cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// app.use((req, res, next) => {
//   if (["POST", "PUT", "PATCH"].includes(req.method)) {
//     express.json({ limit: "10mb" })(req, res, next);
//   } else {
//     next();
//   }
// });

app.use("/hello", (req, res) => {
  if (req.session.viewCount) req.session.viewCount++;
  else req.session.viewCount = 1;

  res.send(
    req.session
    // `id: ${req.session.id}<br>
    // viewCount: ${req.session.viewCount}<br>
    // session: ${JSON.stringify(req.session, null, "<p>")}`
  );
});

app.use("/session", (req, res) => {
  res.send({ id: req.session.id });
});

app.use("/api/playerstate", playerstate.router);
app.use("/api/gamestate", gamestate.router);
app.use("/api/leaderboard", leaderboard.router);

export async function initialize() {
  await playerstate.initialize();
  await gamestate.initialize();
}

export default app;
