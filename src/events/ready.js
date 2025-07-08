import { Client } from "discord.js";

export default function ready(client) {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
}
