import { logger } from "../utils/logger.js";
import { config } from "../config/index.js";

export default function ready(client) {
  logger.success(`🤖 Logged in as ${client.user?.tag}`);
  logger.info(`Prefix is set to: ${config.prefix}`);
  
  client.user.setActivity({
    name: `${config.prefix}help | Music`,
    type: 2 // Listening
  });
}
