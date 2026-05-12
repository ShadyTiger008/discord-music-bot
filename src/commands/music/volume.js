import { ApplicationCommandOptionType } from "discord.js";
import { queue } from "../../player/queue.js";

export default {
  name: "volume",
  description: "Sets the volume for the player (1-100).",
  options: [
    {
      name: "level",
      description: "Volume level (1-100)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 1,
      max_value: 100
    }
  ],
  execute: async (context) => {
    const { guild, args, reply } = context;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue) {
      return reply("❌ Nothing is currently playing!");
    }

    const vol = parseInt(args[0]);
    if (isNaN(vol) || vol < 1 || vol > 100) {
      return reply("❌ Please provide a volume between 1 and 100!");
    }

    // We need to use serverQueue.resource if it has inlineVolume enabled
    // Currently manage.js doesn't seem to set resource on serverQueue
    // I'll update manage.js later. For now, we update the value.
    serverQueue.volume = vol / 100;
    if (serverQueue.resource?.volume) {
      serverQueue.resource.volume.setVolume(serverQueue.volume);
    }

    return reply(`🔊 Volume set to **${vol}%**`);
  }
};
