import { help } from "./help.js";
import { ping } from "./ping.js";

export async function handleInteraction(interaction) {
  console.log("Interaction", interaction);
  if (interaction.isRepliable()) {
    switch (interaction.commandName) {
      case "ping":
        ping(interaction);
        break;
      case "help":
        help(interaction);
        break;
      default:
        interaction.reply("No such interaction exists");
        break;
    }
  }
}
