import { queue } from "../../player/queue.js";

export default {
  name: "chalu",
  description: "Resumes the paused song.",
  aliases: ["resume", "unpause"],
  execute: async (context) => {
    const { guild, reply } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue) {
      return reply("❌ Nothing is currently playing!");
    }

    if (serverQueue.player.state.status !== "paused") {
      return reply("⚠️ The music is not paused!");
    }

    serverQueue.player.unpause();
    return reply("▶️ Music resumed!");
  }
};
