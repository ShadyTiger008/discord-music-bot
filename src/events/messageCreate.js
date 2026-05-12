import { handleCommand } from "../commands/index.js";
import { config } from "../config/index.js";

export default async function messageCreate(message) {
  if (message.author.bot || !message.guild) return;

  // Check for prefix
  if (!message.content.startsWith(config.prefix)) return;

  // We could also handle help/ping here or let the handler handle it if we add them as commands
  // For now, let's just pass to handleCommand
  await handleCommand(message);
}
