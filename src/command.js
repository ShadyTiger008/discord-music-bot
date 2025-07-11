import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!"
  },
  {
    name: "help",
    description: "📋 View all available music commands and usage info."
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.LOGIN_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
