import { play } from "./play.js";

export async function queuePlay(message, serverQueue, args) {
  const queueIndex = parseInt(args[0], 10);

  if (!serverQueue || !serverQueue.songs || serverQueue.songs.length === 0) {
    return message.reply("🚫 **Nothing is playing or queued!**");
  }

  if (
    isNaN(queueIndex) ||
    queueIndex < 0 ||
    queueIndex >= serverQueue.songs.length
  ) {
    return message.reply(
      "❗ Please provide a **valid song index** from the queue."
    );
  }

  // Update the current index
  serverQueue.currentIndex = queueIndex;

  const selectedSong = serverQueue.songs[queueIndex];

  // You can call a play function here if you want to start the song
  const song = serverQueue.songs[queueIndex];
  await play(message, [], song.url);

  return message.reply({
    content: `▶️ **Now playing from queue:**\n**Title:** ${selectedSong.title}\n**Author:** ${selectedSong.author}\n**Duration:** ${selectedSong.duration}`,
    allowedMentions: { repliedUser: false }
  });
}
