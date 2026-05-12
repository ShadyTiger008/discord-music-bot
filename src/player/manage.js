import ytdl from "@distube/ytdl-core";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
  StreamType
} from "@discordjs/voice";
import { queue } from "./queue.js";
import ytpl from "@distube/ytpl";
import { logger } from "../utils/logger.js";
import { formatDuration, createMusicEmbed } from "../utils/formatters.js";
import { config } from "../config/index.js";

/**
 * Plays audio in a voice channel
 * @param {Object} context - Unified context or message shim
 * @param {string} url - YouTube URL
 */
export async function playAudio(context, url) {
  const { member, guild, channel } = context;
  const voiceChannel = member?.voice?.channel;

  if (!voiceChannel) {
    return context.reply("❌ You need to be in a voice channel to play music!");
  }

  const permissions = voiceChannel.permissionsFor(context.client.user);
  if (!permissions.has("Connect") || !permissions.has("Speak")) {
    return context.reply("❌ I don't have permission to join and speak in your voice channel!");
  }

  let serverQueue = queue.get(guild.id);

  try {
    const isPlaylist = ytpl.validateID(url);
    let newSongs = [];

    if (isPlaylist) {
      const response = await ytpl(url, { limit: 100 });
      newSongs = response.items.map(item => ({
        url: item.shortUrl || item.url,
        title: item.title,
        author: item.author.name,
        duration: item.durationSec || 0,
        thumbnail: item.bestThumbnail.url
      }));
      logger.info(`Playlist loaded: ${response.title} (${newSongs.length} songs) in ${guild.name}`);
    } else {
      const info = await ytdl.getInfo(url);
      newSongs = [{
        url: url,
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        duration: parseInt(info.videoDetails.lengthSeconds),
        thumbnail: info.videoDetails.thumbnails[0].url
      }];
    }

    if (serverQueue) {
      serverQueue.songs.push(...newSongs);
      const embed = createMusicEmbed(
        isPlaylist ? "📃 Playlist Added" : "➕ Song Added",
        `**[${newSongs[0].title}](${newSongs[0].url})**\n` +
        `Added **${newSongs.length}** song(s) to the queue.\n` +
        `Position: **${serverQueue.songs.length - serverQueue.currentIndex - 1}**`
      ).setThumbnail(newSongs[0].thumbnail);
      
      return context.reply({ embeds: [embed] });
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    });

    serverQueue = {
      connection,
      player: createAudioPlayer(),
      songs: newSongs,
      currentIndex: 0,
      volume: 1,
      textChannel: channel,
      voiceChannel: voiceChannel,
      resource: null
    };

    queue.set(guild.id, serverQueue);
    connection.subscribe(serverQueue.player);

    setupPlayerListeners(guild.id);
    setupConnectionListeners(guild.id);

    await playNextSong(serverQueue);

  } catch (error) {
    logger.error("Error in playAudio:", error);
    context.reply(`❌ Failed to play: ${error.message}`);
    if (!serverQueue) queue.delete(guild.id);
  }
}

function setupPlayerListeners(guildId) {
  const serverQueue = queue.get(guildId);
  if (!serverQueue) return;

  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    logger.debug(`Player idle in ${guildId}, playing next...`);
    playNextSong(serverQueue);
  });

  serverQueue.player.on("error", error => {
    logger.error(`Audio player error in ${guildId}:`, error);
    serverQueue.textChannel.send("❌ An error occurred during playback. Skipping to next song...");
    playNextSong(serverQueue);
  });
}

function setupConnectionListeners(guildId) {
  const serverQueue = queue.get(guildId);
  if (!serverQueue) return;

  serverQueue.connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(serverQueue.connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(serverQueue.connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
    } catch (error) {
      logger.warn(`Disconnected from ${guildId}, cleaning up.`);
      serverQueue.connection.destroy();
      queue.delete(guildId);
    }
  });
}

async function playNextSong(serverQueue) {
  if (serverQueue.currentIndex >= serverQueue.songs.length) {
    logger.info(`Queue finished in ${serverQueue.textChannel.guild.name}`);
    serverQueue.textChannel.send("📭 Queue ended. Leaving voice channel.");
    serverQueue.connection.destroy();
    queue.delete(serverQueue.textChannel.guild.id);
    return;
  }

  const song = serverQueue.songs[serverQueue.currentIndex];
  
  try {
    const stream = ytdl(song.url, {
      ...config.ytdlOptions,
      agent: undefined // Can add proxy agent here if needed for production
    });

    const resource = createAudioResource(stream, {
      inlineVolume: true,
      inputType: StreamType.Arbitrary
    });

    resource.volume.setVolume(serverQueue.volume);
    serverQueue.resource = resource;
    serverQueue.player.play(resource);

    const embed = createMusicEmbed(
      "🎶 Now Playing",
      `**[${song.title}](${song.url})**\n` +
      `Author: \`${song.author}\`\n` +
      `Duration: \`${formatDuration(song.duration)}\``
    ).setThumbnail(song.thumbnail);

    serverQueue.textChannel.send({ embeds: [embed] });
    serverQueue.currentIndex++;

  } catch (error) {
    logger.error(`Error playing ${song.title}:`, error);
    serverQueue.textChannel.send(`❌ Error playing **${song.title}**, skipping...`);
    serverQueue.currentIndex++;
    playNextSong(serverQueue);
  }
}
