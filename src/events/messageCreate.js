import { Message } from "discord.js";
import { BOT_PREFIX } from "../config.js";
import { handleCommand } from "../commands/index.js";

export default async function messageCreate(message) {
  if (message.author.bot || !message.content.startsWith(BOT_PREFIX)) return;

  await handleCommand(message);
}
