import { playAudio } from "../player/manage.js";

export async function play(message, args) {
  const url = args[0];
  if (!url) return message.reply("Provide a YouTube URL!");

  await playAudio(message, url);
}
