export async function queueCheck(message, serverQueue) {
  if (!serverQueue || !serverQueue.songs || serverQueue.songs.length === 0) {
    return message.reply("🚫 **Nothing is playing or queued!**");
  }

  const queueDetails = serverQueue.songs
    .map(
      (song, index) =>
        `**${index === 0 ? "🎵 Now Playing" : `${index}.`}**\n` +
        `**Title:** ${song.title}\n` +
        `**Author:** ${song.author}\n` +
        `**Duration:** ${song.duration}\n`
    )
    .join("\n");

  return message.reply({
    content: `📜 **Server Music Queue**:\n\n${queueDetails}`,
    allowedMentions: { repliedUser: false }
  });
}
