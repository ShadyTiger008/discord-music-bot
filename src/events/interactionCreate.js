import { EmbedBuilder, Message } from "discord.js";
import { BOT_PREFIX } from "../config.js";
import { handleCommand } from "../commands/index.js";

export default async function interactionCreate(interaction) {
  const helpEmbed = new EmbedBuilder()
    .setColor("#1DB954")
    .setTitle("🎶 Shady Music Bot Commands")
    .setDescription(
      "Use the commands below by typing them in the server where the bot is present.\n\nExample: `@shady bajao <YouTube URL>`"
    )
    .addFields(
      {
        name: "🎵 `@shady bajao <YouTube URL>`",
        value: "Plays the given YouTube song or playlist in your voice channel."
      },
      {
        name: "⏸️ `@shady ruko`",
        value: "Pauses the currently playing song."
      },
      {
        name: "⏯️ `@shady chalu`",
        value: "Resumes the paused song."
      },
      {
        name: "⏹️ `@shady chup`",
        value: "Stops the music and clears the queue."
      },
      {
        name: "⏭️ `@shady skip`",
        value: "Skips to the next song in the queue."
      },
      {
        name: "🔊 `@shady volume <1-100>`",
        value: "Sets the volume for the player (default is 100)."
      },
      {
        name: "📜 `@shady queue`",
        value: "Shows the current music queue."
      },
      {
        name: "⏩ `@shady goto <index>`",
        value: "Plays the song at the given position in the queue."
      },
      {
        name: "🔍 `@shady search <keywords>`",
        value:
          "Searches YouTube and plays the first result.\nExample: `@shady search ratiyaan`"
      }
    )
    .setFooter({ text: "Powered by Shady Bot • Enjoy your music!" });

  console.log("Interaction", interaction);
  if (interaction.isRepliable()) {
    switch (interaction.commandName) {
      case "ping":
        interaction.reply("Pong!!");
        break;
      case "help":
        interaction.reply({ embeds: [helpEmbed] });
        break;
      default:
        interaction.reply("No such interaction exists");
        break;
    }
  }

  //   await handleCommand(message);
}
