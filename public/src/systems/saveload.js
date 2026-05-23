import { playerState, gameState } from "../states/stateManager.js";

const LEADERBOARD_PREFIX = "leaderboards:survivor-";

//playerstate\\
export async function createPlayerData() {
  const playerData = playerState.get();
  console.log("Creating player data:", playerData);

  const response = await fetch(`/api/playerstate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerData }),
  });

  if (!response.ok) {
    console.error(`Error creating player data: ${response.statusText}`);
  }

  return `Create player successful, Player ID: ${playerData.id}`;
}

export async function savePlayerData() {
  const playerData = playerState.get();
  console.log("Saving player data:", playerData);

  let response = await fetch(`/api/playerstate/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerData }),
  });

  if (!response.ok) {
    // If player not found, create new player data
    if (response.status === 404) {
      console.log("No save file found, creating new save.");
      return await createPlayerData();
    } else {
      console.error(`Error saving player data: ${response.statusText}`);
      return `Save player failed, Player ID: ${playerData.id}`;
    }
  }

  return `Save player successful, Player ID: ${playerData.id}`;
}

export async function loadPlayerData(playerId) {
  // fetch player data from backend API
  // "http://localhost:3000" can be removed from fetch URL because it's the same origin
  const response = await fetch(`/api/playerstate/${playerId}`);

  if (!response.ok) {
    if (response.status === 404) {
      console.warn("No player data found.");
      return null;
    } else {
      console.error(`Error loading player data: ${response.statusText}`);
    }
  }

  const data = await response.json();
  playerState.load(data);
  console.log("Loading player data:", data);

  return `Load player successful, Player ID: ${data.id}`;
}

//gamestate\\
export async function createGameData() {
  const gameData = gameState.get();
  console.log("Creating game data:", gameData);

  const response = await fetch(`/api/gamestate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameData }),
  });

  if (!response.ok) {
    console.error(`Error creating game data: ${response.statusText}`);
  }

  return `Create game successful, Game ID: ${gameData.id}`;
}

export async function saveGameData() {
  const gameData = gameState.get();
  console.log("Saving game data:", gameData);

  let response = await fetch(`/api/gamestate/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameData }),
  });

  if (!response.ok) {
    // If game not found, create new game data
    if (response.status === 404) {
      console.log("No save file found, creating new save.");
      return await createGameData();
    } else {
      console.error(`Error saving game data: ${response.statusText}`);
      return `Save game failed, Game ID: ${gameData.id}`;
    }
  }

  return `Save game successful, Game ID: ${gameData.id}`;
}

export async function loadGameData(playerId) {
  // fetch game data from backend API
  // "http://localhost:3000" can be removed from fetch URL because it's the same origin
  const response = await fetch(`/api/gamestate/${playerId}`);

  if (!response.ok) {
    if (response.status === 404) {
      console.warn("No game data found.");
      return null;
    } else {
      console.error(`Error loading game data: ${response.statusText}`);
    }
  }

  const data = await response.json();
  gameState.load(data);
  console.log("Loading game data:", data);

  return `Load game successful, Game ID: ${data.id}`;
}

//leaderboard\\
export async function saveScore(score) {
  let response = await fetch(`/api/leaderboard/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: LEADERBOARD_PREFIX + playerState.get().leaderboard,
      score: score,
      member: `${playerState.get().name}-${playerState.get().id}`,
    }),
  });

  if (!response.ok) {
    console.error(`Error updating leaderboard: ${response.statusText}`);
  }

  console.log(`Saved score: ${score}`);
}

export async function getLeaderboardEntries(count) {
  let response = await fetch(
    `/api/leaderboard/${LEADERBOARD_PREFIX + playerState.get().leaderboard}?count=${count}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    console.error(`Error updating leaderboard: ${response.statusText}`);
  }

  let rankSubtract = count;
  const entries = await response.json();

  return entries.map((entry) => {
    if (rankSubtract > 0) rankSubtract--;
    return {
      rank: count - rankSubtract,
      name: entry.value.substring(0, entry.value.indexOf("-")),
      score: entry.score,
    };
  });
}

//other
export async function getSessionId() {
  let response = await fetch(`/session`);

  if (!response.ok) {
    if (response.status === 404) {
      console.log("Not connected to game backend server");
      return null;
    } else {
      console.error(`Error loading player data: ${response.statusText}`);
    }
  }

  const session = await response.json();
  console.log("Session ID: ", session.id);

  return session;
}
