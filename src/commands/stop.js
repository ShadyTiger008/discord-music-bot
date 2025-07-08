import { queue } from "../player/queue.js";

export async function stop(message, serverQueue) {
   if (!serverQueue) return message.reply("Nothing to stop!");
   serverQueue.songs = [];
   serverQueue.player.stop();
   serverQueue.connection.destroy();
   queue.delete(message.guild.id);
   message.reply("⏯️ Stopped and left the channel");
}
