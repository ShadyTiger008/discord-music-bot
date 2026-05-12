import { ApplicationCommandOptionType } from "discord.js";
import { queue } from "../../player/queue.js";
import { playAudio } from "../../player/manage.js";

export default {
  name: "goto",
  description: "Skips to a specific song in the queue by index.",
  options: [
    {
      name: "index",
      description: "The index of the song in the queue",
      type: ApplicationCommandOptionType.Integer,
      required: true
    }
  ],
  execute: async (context) => {
    const { guild, args, reply, message } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue || serverQueue.songs.length === 0) {
      return reply("🚫 **Nothing is playing or queued!**");
    }

    const index = parseInt(args[0]);
    if (isNaN(index) || index < 0 || index >= serverQueue.songs.length) {
      return reply(`❗ Please provide a valid index between 0 and ${serverQueue.songs.length - 1}.`);
    }

    serverQueue.currentIndex = index - 1; // Subtract 1 because playNextSong will increment it
    serverQueue.player.stop(); // Stop current song to trigger playNextSong

    return reply(`⏩ Jumping to song at index **${index}**...`);
  }
};
