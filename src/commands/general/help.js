import { createMusicEmbed } from "../../utils/formatters.js";
import { config } from "../../config/index.js";

export default {
  name: "help",
  description: "📋 View all available music commands and usage info.",
  execute: async (context) => {
    const { reply } = context;
    const helpEmbed = createMusicEmbed(
      "🎶 Shady Music Bot Commands",
      `Use the commands below via Slash commands or by prefixing with \`${config.prefix}\`.\n\n` +
      `**Music Commands:**\n` +
      `🎵 \`/bajao <url>\` - Plays music\n` +
      `⏸️ \`/ruko\` - Pauses music\n` +
      `⏯️ \`/chalu\` - Resumes music\n` +
      `⏹️ \`/chup\` - Stops music\n` +
      `⏭️ \`/skip\` - Skips song\n` +
      `🔊 \`/volume <1-100>\` - Sets volume\n` +
      `📜 \`/queue\` - Shows queue\n` +
      `⏩ \`/goto <index>\` - Jump to index\n` +
      `🔍 \`/search <keywords>\` - Search & Play`
    );
    return await reply({ embeds: [helpEmbed] });
  }
};
