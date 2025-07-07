import dotenv from "dotenv";
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

dotenv.config({
  path: "./.env"
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on("messageCreate", async (message) => {
  console.log(message.content);

  // Reply to non-bot messages
  if (!message.author.bot) {
    message.reply(`Hey @${message.author.username} bro!`);
  }

  // Check if message is from bot or doesn't start with "@sunao"
  if (message.author.bot || !message.content.startsWith("@sunao")) return;

  const args = message.content.split(" ");
  const url = args[1];

  // Validate YouTube URL
  if (!url || !ytdl.validateURL(url)) {
    return message.reply("Provide a valid YouTube URL.");
  }

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
    });

    player.on("error", (error) => {
      console.error("Audio player error:", error);
      message.reply("❌ An error occurred while playing the audio.");
      connection.destroy();
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
