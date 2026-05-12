import { queue } from "../../player/queue.js";

export default {
  name: "skip",
  description: "Skips to the next song in the queue.",
  aliases: ["next"],
  execute: async (context) => {
    const { guild, reply } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue) {
      return reply("❌ Nothing is currently playing!");
    }

    serverQueue.player.stop(); // This triggers AudioPlayerStatus.Idle which calls playNextSong
    return reply("⏭️ Skipped to the next song!");
  }
};
