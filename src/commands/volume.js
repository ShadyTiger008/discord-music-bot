export async function setVolume(message, serverQueue, args) {
  if (!serverQueue) return message.reply("Nothing is playing");
  const vol = args[0];

  const volume = parseInt(vol, 10);
  if (isNaN(volume) || volume < 0 || volume > 100) {
    return message.reply("Provide a volume between 0 to 100");
  }

  serverQueue.volume = volume / 100;
  serverQueue.player.state?.resource?.volume?.setVolume(serverQueue.volume);
  message.reply(`🔊 Volume set to ${volume}%`);
}
