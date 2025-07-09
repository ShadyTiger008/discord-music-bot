import { playAudio } from "../player/manage.js";

export async function play(message, args, directUrl) {
  const url = args.length !== 0 ? args[0] : directUrl;

  if (!url) return message.reply("Provide a YouTube URL!");

  await playAudio(message, url);
}
