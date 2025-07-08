export async function skip(message, serverQueue) {
   if (!serverQueue) return message.reply("Nothing to skip!");
   serverQueue.player.stop();
   message.reply("⏯️ Song skipped");
}
