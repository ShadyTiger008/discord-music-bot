import { queue } from "../../player/queue.js";

export default {
  name: "ruko",
  description: "Pauses the currently playing song.",
  aliases: ["pause"],
  execute: async (context) => {
    const { guild, reply } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue) {
      return reply("❌ Nothing is currently playing!");
    }

    if (serverQueue.player.state.status === "paused") {
      return reply("⚠️ The music is already paused!");
    }

    serverQueue.player.pause();
    return reply("⏸️ Song paused!");
  }
};
