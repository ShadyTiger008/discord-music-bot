import { Client } from "discord.js";
import ready from "./ready.js";
import messageCreate from "./messageCreate.js";

export default function registerEvents(client) {
  client.once("ready", ready);
  client.on("messageCreate", messageCreate);
}
