# Information

Play the game at: [redis.io/cache-quest](https://redis.io/cache-quest)

This is the source code for Cache Quest, a browser rpg/rougelite game powered by Redis and built using KAPLAY.js.

- [Redis](https://redis.io/try-free/)
- [KAPLAY.js](https://kaplayjs.com/)

### Placeholder character sprites

This game uses [Tiny Swords](https://pixelfrog-assets.itch.io/tiny-swords) characters created by Pixel Frog. Characters sprites that can be downloaded free of charge are kept intact with permission of the artist. Character sprites that cannot be redistributed are replaced with whitespace placeholder art.

# How to run this project

There are two ways to run this project once you've cloned the repo. You can run this project locally using Docker which pulls the latest alpine image of Redis. Alternatively, you can run this using Node with Redis Cloud.

## Option 1: Run using Docker

### 1. Copy and rename the `.env.docker.example` file

```bash
cp .env.docker.example .env.docker
```

Your `.env.docker` should use the appropriate docker internal URLs.

```bash
REDIS_URL="redis://redis:6379"
```

### 2. Copy and rename the `.env.example` file:

```bash
cp .env.example .env
```

Your `.env` should use localhost for the `REDIS_URL`

```bash
REDIS_URL="redis://localhost:6379"
REDIS_SESSION_PREFIX = "sessions:"
REDIS_SESSION_SECRET = "diet Dr.Pepper"
PORT = 3000
```

### 3. Spin up docker containers:

```bash
docker compose up -d
```

Navigate to `http://localhost:3000` to test play the game.

## Option 2: Run using Node with Redis Cloud

### 1. Connect to Redis Cloud

Instead of a locally hosted Redis server, you can connect to a free Redis database on Redis Cloud. If you don't yet have a database setup in Redis Cloud [get started here for free](https://redis.io/try-free/?utm_medium=webinar&utm_source=live-link&utm_campaign=wb-2026-04-30-cache-quest-building-a-lag-free-game-backend).

To connect to a Redis Cloud database, log into the Redis Cloud console and find the following:

1. The `public endpoint` (looks like `redis-#####.####.us-region-2-#.ec2.redns.redis-cloud.com:#####`)
1. Your `username` (`default` is the default username, otherwise find the one you setup)
1. Your `password` (either setup through Data Access Control, or available in the `Security` section of the database
   page).

### 2. Copy and rename the `.env.example` file

```bash
cp .env.example .env
```

### 3. Edit environment variables

Combine the above values into a connection string and put it in your `.env`. It should
look something like the following:

```bash
REDIS_URL="redis://default:<password>@redis-#####.####.us-region-2-#.ec2.redns.redis-cloud.com:#####"
REDIS_SESSION_PREFIX = "sessions:"
REDIS_SESSION_SECRET = "diet Dr.Pepper"
PORT = 3000
```

### 4. Run the development server

```bash
npm install
# then
npm run dev
```

Navigate to `http://localhost:3000` to test play the game.

# Project structure

```
cache-quest
├───public
│   ├───assets
│   │   ├───characters
│   │   ├───data
│   │   ├───dialog
│   │   ├───fx
│   │   ├───maps
│   │   ├───objects
│   │   └───ui
│   ├───lib
│   └───src
│       ├───entities
│       ├───scenes
│       ├───states
│       └───systems
│           └───skills
└───server
    └───components
        ├───gamestate
        ├───leaderboard
        └───playerstate
```

# Credits

Producer: Rebekah Reddis\
Developer: Chanh Tran\
UI designer: Meghan Wittbrodt\
Story Editor: Sylvia Ogweng

Character and environment art:\
[Pixel Frog](https://pixelfrog-assets.itch.io/)\
[Szadi art.](https://szadiart.itch.io/)
