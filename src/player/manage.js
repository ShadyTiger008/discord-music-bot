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

export async function playAudio(message, url) {
  const voiceChannel = message.member?.voice?.channel;
  if (!voiceChannel) return message.reply("Join a voice channel first!");

  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

    // Get video info for detailed response
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const duration = info.videoDetails.lengthSeconds;
    const author = info.videoDetails.author.name;

    // Format duration from seconds to mm:ss
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    console.log(
      `🎵 Playing: ${title} by ${author} (${formatDuration(duration)}) in ${
        voiceChannel.name
      }`
    );

    const stream = ytdl(url, { filter: "audioonly", highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);

    const player = createAudioPlayer();
    player.play(resource);

    connection.subscribe(player);

    queue.set(message.guild.id, {
      connection,
      player,
      resource,
      volume: 1,
      songs: [{ url, title, author, duration }]
    });

    // Detailed reply message
    message.reply(
      `🎵 **Now playing:**\n**${title}**\n👤 *${author}*\n⏱️ *${formatDuration(
        duration
      )}*\n🔊 *Volume: 100%*`
    );

    // Handle player events
    player.on(AudioPlayerStatus.Playing, () => {
      console.log(`▶️ Audio player started playing: ${title}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log(`⏹️ Audio player finished playing: ${title}`);
      connection.destroy();
      queue.delete(message.guild.id);
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
