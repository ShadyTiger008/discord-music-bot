import { Collection } from "discord.js";
import { logger } from "../utils/logger.js";
import { config } from "../config/index.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const commands = new Collection();

/**
 * Loads all commands recursively from the commands directory
 */
export async function loadCommands(dir = __dirname) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      await loadCommands(fullPath);
    } else if (item.name.endsWith(".js") && item.name !== "index.js") {
      try {
        // Calculate relative path for dynamic import
        const relativePath = path.relative(__dirname, fullPath).replace(/\\/g, "/");
        const { default: command } = await import(`./${relativePath}`);
        
        if (command && command.name) {
          commands.set(command.name, command);
          if (command.aliases) {
            command.aliases.forEach(alias => commands.set(alias, command));
          }
          logger.debug(`Loaded command: ${command.name}`);
        }
      } catch (error) {
        logger.error(`Failed to load command at ${fullPath}:`, error);
      }
    }
  }
}

/**
 * Unified execution handler for both Message and Interaction
 */
export async function handleCommand(input) {
  const isInteraction = input.isCommand?.();
  const guild = input.guild;
  
  if (!guild) return;

  let commandName, args;

  if (isInteraction) {
    commandName = input.commandName;
    args = input.options.data.map(opt => opt.value);
  } else {
    if (!input.content.startsWith(config.prefix)) return;
    const parts = input.content.slice(config.prefix.length).trim().split(/ +/);
    commandName = parts.shift().toLowerCase();
    args = parts;
  }

  const command = commands.get(commandName);
  
  // Special handling for built-in help/ping if they aren't in files yet
  // Actually, I'll move them to files soon.
  if (!command) {
    if (commandName === "help" || commandName === "ping") {
        // We'll handle these in events for now as before, or move them to general/
        return; 
    }
    return;
  }

  const context = {
    client: input.client,
    guild: input.guild,
    member: input.member,
    channel: input.channel,
    args: args,
    interaction: isInteraction ? input : null,
    message: isInteraction ? null : input,
    
    reply: async (content) => {
      if (isInteraction) {
        if (input.deferred || input.replied) return await input.editReply(content);
        return await input.reply(content);
      }
      return await input.reply(content);
    },
    
    defer: async () => {
      if (isInteraction) return await input.deferReply();
    }
  };

  try {
    await command.execute(context);
  } catch (error) {
    logger.error(`Error executing ${commandName}:`, error);
    const errorMessage = "❌ An error occurred while executing this command.";
    if (isInteraction) {
      if (input.deferred || input.replied) await input.editReply(errorMessage);
      else await input.reply({ content: errorMessage, ephemeral: true });
    } else {
      await input.reply(errorMessage);
    }
  }
}
