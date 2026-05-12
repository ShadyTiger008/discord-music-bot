import { REST, Routes } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsRoot = path.join(__dirname, "../src/commands");

const commandDefinitions = [];

/**
 * Recursively scans for command files
 */
async function scanCommands(dir) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      await scanCommands(fullPath);
    } else if (item.name.endsWith(".js") && item.name !== "index.js") {
      try {
        const { default: command } = await import(`file://${fullPath}`);
        if (command && command.name) {
          commandDefinitions.push({
            name: command.name,
            description: command.description,
            options: command.options || []
          });
          console.log(`✅ Found command: ${command.name} (${path.relative(commandsRoot, fullPath)})`);
        }
      } catch (error) {
        console.error(`❌ Failed to load command at ${fullPath}:`, error);
      }
    }
  }
}

async function registerCommands() {
  console.log("🔍 Scanning for commands...");
  await scanCommands(commandsRoot);

  const token = process.env.LOGIN_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId) {
    console.error("❌ LOGIN_TOKEN or CLIENT_ID missing in environment.");
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log(`🚀 Started refreshing ${commandDefinitions.length} application (/) commands.`);

    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commandDefinitions }
      );
      console.log(`✨ Successfully reloaded commands for guild ${guildId}`);
    } else {
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commandDefinitions }
      );
      console.log("✨ Successfully reloaded global application (/) commands.");
    }
  } catch (error) {
    console.error("❌ Registration failed:", error);
  }
}

registerCommands();
