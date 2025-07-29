import { handleInteraction } from "../interactions/index.js";

export default async function interactionCreate(interaction) {
  await handleInteraction(interaction);
}
