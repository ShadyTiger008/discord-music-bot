import { ApplicationCommandOptionType } from "discord.js";
import { playAudio } from "../../player/manage.js";

export default {
  name: "bajao",
  description: "Plays a song or playlist from YouTube.",
  aliases: ["play"],
  options: [
    {
      name: "url",
      description: "The YouTube URL or search keywords",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  execute: async (context) => {
    const { args, message, interaction, reply } = context;
    const url = args[0];

    if (!url) {
      return reply("❌ Please provide a YouTube URL or search keywords!");
    }

    // We'll update playAudio to take context later, for now we pass message or a shim
    const targetMessage = message || {
      member: context.member,
      guild: context.guild,
      channel: context.channel,
      reply: reply
    };

    await playAudio(targetMessage, url);
  }
};
