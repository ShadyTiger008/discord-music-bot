import { queue } from "../player/queue.js";
import { pause } from "./pause.js";
import { play } from "./play.js";
import { queueCheck } from "./queueCheck.js";
import { queuePlay } from "./queuePlay.js";
import { resume } from "./resume.js";
import { skip } from "./skip.js";
import { stop } from "./stop.js";
import { setVolume } from "./volume.js";

export async function handleCommand(message) {
  // Check if message is from a guild
  if (!message.guild) {
    return message.reply("❌ Commands can only be used in servers!");
  }

  const [prefix, command, ...args] = message.content.split(" ");
  const serverQueue = queue.get(message.guild.id); // Fixed: use message.guild.id instead of guildId

  // Check if queue is required for the command
  if (!serverQueue && ["ruko", "chalu", "chup", "skip"].includes(command)) {
    return message.reply("❌ Nothing is currently playing!");
  }

  switch (command) {
    case "bajao":
      play(message, args);
      break;
    case "ruko":
      pause(message, serverQueue);
      break;
    case "chalu":
      resume(message, serverQueue);
      break;
    case "chup":
      stop(message, serverQueue);
      break;
    case "skip":
      skip(message, serverQueue);
      break;
    case "volume":
      setVolume(message, serverQueue, args);
      break;
    case "queue":
      queueCheck(message, serverQueue);
      break;
    case "goto":
      queuePlay(message, serverQueue, args);
      break;

    default:
      message.reply("❓ Unknown command");
  }
}
