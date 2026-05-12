import { ApplicationCommandOptionType } from "discord.js";
import { playAudio } from "../../player/manage.js";
import yts from "yt-search";
import { createMusicEmbed } from "../../utils/formatters.js";

export default {
  name: "search",
  description: "Searches YouTube and plays the first result.",
  options: [
    {
      name: "keywords",
      description: "The keywords to search for",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  execute: async (context) => {
    const { args, reply, message } = context;
    const searchKey = args.join(" ");

    if (!searchKey) {
      return reply("❌ Please provide search keywords!");
    }

    try {
      const searchResponse = await yts(searchKey);
      const videoResults = searchResponse.videos;

      if (!videoResults.length) {
        return reply("🚫 No results found for your search.");
      }

      const song = videoResults[0];

      const embed = createMusicEmbed("🔍 Search Result", `**Found:** [${song.title}](${song.url})\n**Channel:** ${song.author.name}\n**Duration:** ${song.timestamp}`);
      await reply({ embeds: [embed] });

      const targetMessage = message || {
        member: context.member,
        guild: context.guild,
        channel: context.channel,
        reply: reply
      };

      await playAudio(targetMessage, song.url);
    } catch (error) {
      throw error;
    }
  }
};
