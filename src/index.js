import { Client, Events, GatewayIntentBits } from "discord.js";
import ytdl from "@distube/ytdl-core";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState
} from "@discordjs/voice";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Queue system
const queueMicrotask = new Map();

const pause = (message, serverQueue) => {
  if (!serverQueue) return message.reply("Nothing is playing!");
  serverQueue.player.pause();
  message.reply("⏸️ Song paused!");
};

const resume = (message, serverQueue) => {
  if (!serverQueue) return message.reply("Nothing is playing!");
  serverQueue.player.unpause();
  message.reply("▶️ Song resumed");
};

const skip = (message, serverQueue) => {
  if (!serverQueue) return message.reply("Nothing to skip!");
  serverQueue.player.stop();
  message.reply("⏯️ Song skipped");
};

const stop = (message, serverQueue) => {
  if (!serverQueue) return message.reply("Nothing to stop!");
  serverQueue.songs = [];
  serverQueue.player.stop();
  serverQueue.connection.destroy();
  queueMicrotask.delete(message.guild.id);
  message.reply("⏯️ Stopped and left the channel");
};

const setVolume = (message, serverQueue, vol) => {
  if (!serverQueue) return message.reply("Nothing is playing");

  if (isNaN(vol) || vol < 0 || vol > 100)
    return message.reply("Provide a volume between 0 to 100");

  serverQueue.volume = vol / 100;
  serverQueue.player.state?.resource?.volume?.setVolume(serverQueue.volume);
  // Note: Volume control with discord.js voice is limited
  // This will store the volume preference but actual volume control
  // depends on the audio resource implementation

  message.reply(`🔊 Volume set to ${vol}%`);
};

client.on("messageCreate", async (message) => {
  console.log(message.content);

  // Reply to non-bot messages
  if (!message.author.bot) {
    message.reply(`Hey @${message.author.username} bro!`);
  }

  // Check if message is from bot or doesn't start with "@sunao"
  if (message.author.bot || !message.content.startsWith("@shady")) return;

  const args = message.content.split(" ");
  const command = args[1]; // Fixed: define command variable
  const url = args[2]; // Fixed: URL is now args[2] since command is args[1]
  const vol = args[2]; // Volume value for volume command

  // Get server queue
  const serverQueue = queueMicrotask.get(message.guild.id);

  switch (command) {
    case "ruko": // Fixed: added quotes
      pause(message, serverQueue);
      return; // Fixed: added return to prevent fall-through
    case "chalu": // Fixed: added quotes
      resume(message, serverQueue);
      return;
    case "change": // Fixed: added quotes
      skip(message, serverQueue);
      return;
    case "chup": // Fixed: added quotes
      stop(message, serverQueue);
      return;
    case "awaj": // Added volume command
      setVolume(message, serverQueue, vol);
      return;
    case "bajao": // Added play command for URL playing
      break; // Continue to URL validation
    default:
      message.reply("Use proper command");
      return;
  }

  // Validate YouTube URL (only for play command)
  if (command === "bajao" && (!url || !ytdl.validateURL(url))) {
    return message.reply("Provide a valid YouTube URL.");
  }

  // Only proceed with audio playing if it's the play command
  if (command !== "bajao") return;

  // Check if user is in a voice channel
  const voiceChannel = message?.member?.voice?.channel;
  console.log("------------voice channel------------", voiceChannel?.name);

  if (!voiceChannel) {
    return message.reply("Join a voice channel first!");
  }

  try {
    // Join voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    // Wait for connection to be ready
    await entersState(connection, VoiceConnectionStatus.Ready, 30000);

    // Get video info for better feedback
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    // Create audio stream
    const stream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    });

    // Create audio resource
    const resource = createAudioResource(stream, {
      inputType: "arbitrary"
    });

    // Create and configure audio player
    const player = createAudioPlayer();

    // Subscribe connection to player
    connection.subscribe(player);

    // Store in queue for command functions
    queueMicrotask.set(message.guild.id, {
      connection,
      player,
      songs: [{ title, url }],
      volume: 1,
      resource // Store resource for volume control
    });

    // Play the audio
    player.play(resource);

    // Send confirmation message
    message.reply(`🎵 Now playing: **${title}**`);

    // Handle player events
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("Audio player is playing");
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log("Audio player is idle - song finished");
      connection.destroy();
      queueMicrotask.delete(message.guild.id); // Clean up queue
    });

    player.on("error", (error) => {
      console.error("Audio player error:", error);
      message.reply("❌ An error occurred while playing the audio.");
      connection.destroy();
      queueMicrotask.delete(message.guild.id); // Clean up queue
    });

    // Handle connection events
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000)
        ]);
      } catch (error) {
        connection.destroy();
        queueMicrotask.delete(message.guild.id); // Clean up queue
      }
    });
  } catch (error) {
    console.error("Error playing audio:", error);
    message.reply("❌ Failed to play the audio. Please try again.");
  }
});

client.on("interactionCreate", (interaction) => {
  console.log("Interaction", interaction);
  if (interaction.isRepliable()) {
    interaction.reply("Pong!!");
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.LOGIN_TOKEN);
