import "dotenv/config"; // Fallback for older node versions or different environments

export const config = {
  token: process.env.LOGIN_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  prefix: process.env.BOT_PREFIX || "@shady",
  debug: process.env.DEBUG_MODE === "true",
  ytdlOptions: {
    filter: "audioonly",
    highWaterMark: 1 << 25,
    quality: "highestaudio",
    liveBuffer: 1 << 20
  }
};

// Simple validation
if (!config.token) {
  throw new Error("LOGIN_TOKEN is missing in .env");
}

if (!config.clientId) {
  console.warn("WARNING: CLIENT_ID is missing. Slash commands won't be registrable via script.");
}

export const BOT_PREFIX = config.prefix;
export const TOKEN = config.token;
