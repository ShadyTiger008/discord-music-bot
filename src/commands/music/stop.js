import { queue } from "../../player/queue.js";

export default {
  name: "chup",
  description: "Stops the music and clears the queue.",
  aliases: ["stop", "leave"],
  execute: async (context) => {
    const { guild, reply } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue) {
      return reply("❌ Nothing is currently playing!");
    }

    serverQueue.songs = [];
    serverQueue.player.stop();
    serverQueue.connection.destroy();
    queue.delete(guild.id);

    return reply("⏹️ Music stopped and queue cleared!");
  }
};
