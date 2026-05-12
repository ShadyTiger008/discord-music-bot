import { handleCommand } from "../commands/index.js";
import { logger } from "../utils/logger.js";
import { createMusicEmbed } from "../utils/formatters.js";
import { config } from "../config/index.js";

export default async function interactionCreate(interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "help") {
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
    return await interaction.reply({ embeds: [helpEmbed] });
  }

  if (commandName === "ping") {
    return await interaction.reply("🏓 Pong!");
  }

  try {
    await handleCommand(interaction);
  } catch (error) {
    logger.error("Error handling interaction:", error);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("❌ Internal error occurred.");
    } else {
      await interaction.reply({ content: "❌ Internal error occurred.", ephemeral: true });
    }
  }
}
