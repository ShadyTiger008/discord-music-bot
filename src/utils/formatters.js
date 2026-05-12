import { EmbedBuilder } from "discord.js";

/**
 * Formats seconds into mm:ss or hh:mm:ss
 * @param {number} seconds 
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "Unknown";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Creates a standard music bot embed
 * @param {string} title 
 * @param {string} description 
 * @param {string} color 
 * @returns {EmbedBuilder}
 */
export function createMusicEmbed(title, description, color = "#1DB954") {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: "Shady Music Bot • Production Grade" });
}
