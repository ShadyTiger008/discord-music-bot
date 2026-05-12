import { queue } from "../../player/queue.js";
import { createMusicEmbed } from "../../utils/formatters.js";

export default {
  name: "queue",
  description: "Shows the current music queue.",
  aliases: ["q", "list"],
  execute: async (context) => {
    const { guild, reply } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue || serverQueue.songs.length === 0) {
      return reply("🚫 **Nothing is playing or queued!**");
    }

    const currentSong = serverQueue.songs[serverQueue.currentIndex];
    const upcoming = serverQueue.songs.slice(serverQueue.currentIndex + 1, serverQueue.currentIndex + 11);

    let description = `**Now Playing:**\n[${currentSong.title}](${currentSong.url}) | \`${currentSong.author}\`\n\n`;

    if (upcoming.length > 0) {
      description += "**Upcoming:**\n";
      description += upcoming
        .map((song, i) => `\`${serverQueue.currentIndex + i + 1}.\` [${song.title}](${song.url}) | \`${song.author}\``)
        .join("\n");
      
      if (serverQueue.songs.length > serverQueue.currentIndex + 11) {
        description += `\n... and ${serverQueue.songs.length - (serverQueue.currentIndex + 11)} more.`;
      }
    } else {
      description += "_No more songs in queue._";
    }

    const embed = createMusicEmbed("📜 Music Queue", description);
    return reply({ embeds: [embed] });
  }
};
