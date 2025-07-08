export async function resume(message, serverQueue) {
  if (!serverQueue) return message.reply("Nothing is playing!");
  serverQueue.player.unpause();
  message.reply("▶️ Song resumed");
}
