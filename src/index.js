import { client } from "./client.js";
import registerEvents from "./events/index.js";
import { loadCommands } from "./commands/index.js";
import { logger } from "./utils/logger.js";
import { config } from "./config/index.js";

async function bootstrap() {
  try {
    await loadCommands();
    registerEvents(client);
    await client.login(config.token);
  } catch (error) {
    logger.error("Failed to start bot:", error);
    process.exit(1);
  }
}

bootstrap();
