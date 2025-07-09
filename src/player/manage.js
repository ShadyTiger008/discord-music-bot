process.env.YTDL_NO_UPDATE = "1";

import ytdl from "@distube/ytdl-core";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus
} from "@discordjs/voice";
import { queue } from "./queue.js";
import ytpl from "@distube/ytpl";

export async function playAudio(message, url) {
  const voiceChannel = message.member?.voice?.channel;
  if (!voiceChannel) return message.reply("Join a voice channel first!");

  const serverQueue = queue.get(message.guild.id);

  try {
    const isPlaylist = url.includes("playlist");

    let newSongs = [];

    if (isPlaylist) {
      const response = await ytpl(url);
      // Convert playlist items to song objects
      newSongs = response.items.map((item) => ({
        url: item.url,
        title: item.title,
        author: item.author.name,
        duration: item.duration || 0
      }));

      console.log(
        `📃 Playlist loaded: ${response.title} (${newSongs.length} songs)`
      );
    } else {
      // Get video info for single video
      const info = await ytdl.getInfo(url);
      const newSong = {
        url: url,
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        duration: parseInt(info.videoDetails.lengthSeconds)
      };
      newSongs = [newSong];
    }

    // Format duration from seconds to mm:ss
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // If there's already a queue, add songs to it
    if (serverQueue) {
      // console.log("new songs", newSongs)
      serverQueue.songs.push(...newSongs);
      // console.log("server queue", serverQueue)

      const replyMessage = isPlaylist
        ? `📃 **Playlist added to queue:**\n**${
            newSongs.length
          } songs**\n🎵 **Total in queue:** ${
            serverQueue.songs.length - serverQueue.currentIndex - 1
          } songs`
        : `➕ **Added to queue:**\n**${newSongs[0].title}**\n👤 *${
            newSongs[0].author
          }*\n⏱️ *${formatDuration(
            newSongs[0].duration
          )}*\n🎵 **Position in queue:** ${
            serverQueue.songs.length - serverQueue.currentIndex
          }`;

      return message.reply(replyMessage);
    }

    // No existing queue, create new connection and start playing
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

    const currentSong = newSongs[0];
    console.log(
      `🎵 Playing: ${currentSong.title} by ${
        currentSong.author
      } (${formatDuration(currentSong.duration)}) in ${voiceChannel.name}`
    );

    // Create audio stream and resource for the current song
    const stream = ytdl(currentSong.url, {
      filter: "audioonly",
      highWaterMark: 1 << 25
    });
    const resource = createAudioResource(stream);

    const player = createAudioPlayer();
    player.play(resource);

    connection.subscribe(player);

    // Store queue information
    queue.set(message.guild.id, {
      connection,
      player,
      songs: newSongs,
      currentIndex: 0,
      volume: 1,
      textChannel: message.channel,
      voiceChannel
    });

    // Detailed reply message
    const replyMessage = isPlaylist
      ? `📃 **Playlist added:**\n**${
          newSongs.length
        } songs**\n🎵 **Now playing:**\n**${currentSong.title}**\n👤 *${
          currentSong.author
        }*\n⏱️ *${currentSong.duration}*\n🔊 *Volume: 100%*`
      : `🎵 **Now playing:**\n**${currentSong.title}**\n👤 *${
          currentSong.author
        }*\n⏱️ *${formatDuration(currentSong.duration)}*\n🔊 *Volume: 100%*`;

    message.reply(replyMessage);

    // Handle player events
    player.on(AudioPlayerStatus.Playing, () => {
      console.log(`▶️ Audio player started playing: ${currentSong.title}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log(`⏹️ Audio player finished playing: ${currentSong.title}`);

      const serverQueue = queue.get(message.guild.id);
      if (serverQueue) {
        playNextSong(serverQueue);
      }
    });

    player.on("error", (error) => {
      console.error(`❌ Audio player error: ${error.message}`);
      message.reply("❌ An error occurred while playing the audio.");
      connection.destroy();
      queue.delete(message.guild.id);
    });
  } catch (error) {
    console.error(`❌ Error playing audio: ${error.message}`);
    message.reply("❌ Failed to play the audio. Please try again.");
  }
}

// Function to play the next song in queue
async function playNextSong(serverQueue) {
  serverQueue.currentIndex++;

  if (serverQueue.currentIndex >= serverQueue.songs.length) {
    // No more songs, disconnect
    console.log("📭 Queue ended, disconnecting...");
    serverQueue.connection.destroy();
    queue.delete(serverQueue.textChannel.guild.id);
    serverQueue.textChannel.send(
      "📭 Queue ended. Disconnected from voice channel."
    );
    return;
  }

  const nextSong = serverQueue.songs[serverQueue.currentIndex];

  try {
    console.log(`🎵 Playing next: ${nextSong.title}`);

    const stream = ytdl(nextSong.url, {
      filter: "audioonly",
      highWaterMark: 1 << 25
    });
    const resource = createAudioResource(stream);

    serverQueue.player.play(resource);

    // Format duration
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    serverQueue.textChannel.send(
      `🎵 **Now playing:**\n**${nextSong.title}**\n👤 *${
        nextSong.author
      }*\n⏱️ *${(nextSong.duration)}*`
    );
  } catch (error) {
    console.error(`❌ Error playing next song: ${error.message}`);
    serverQueue.textChannel.send("❌ Error playing next song, skipping...");
    playNextSong(serverQueue); // Try next song
  }
}
