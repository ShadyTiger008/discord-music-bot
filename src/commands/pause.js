export async function pause(message, serverQueue) {
   if (!serverQueue) return message.reply("Nothing is playing!");
   serverQueue.player.pause();
   message.reply("⏸️ Song paused!");

}
