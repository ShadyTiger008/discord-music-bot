import { playAudio } from "../player/manage.js";
import yts from "yt-search";

export async function searchWithKey(message, args) {
  const searchKey = args.join(" "); // allow multi-word search
  if (!searchKey) {
    return message.reply("❗ Please provide a valid search keyword.");
  }

  try {
    // Search on YouTube
    const searchResponse = await yts(searchKey);
    const videoResults = searchResponse.videos;

    if (!videoResults.length) {
      return message.reply("🚫 No results found for your search.");
    }

    const song = videoResults[0]; // get top result

    // Prepare a nicely formatted message
    const embedMessage = `
            🎶 **Now Playing from Search:**
            **Title:** ${song.title}
            **Description:** ${song.description || "N/A"}
            📺 **Channel:** ${song.author.name}
            ⏱️ **Duration:** ${song.timestamp}
            👀 **Views:** ${song.views.toLocaleString()}
            🕒 **Uploaded:** ${song.ago}
            🔗 **URL:** ${song.url}
        `;

    await message.reply(embedMessage);

    // Play the selected song
    await playAudio(message, song.url);
  } catch (error) {
    console.error("❌ Error in searchWithKey:", error.message);
    return message.reply("❌ Failed to search or play the song. Try again.");
  }
}