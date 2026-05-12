import { config } from "../config/index.js";

const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m",    // Cyan
  warn: "\x1b[33m",    // Yellow
  error: "\x1b[31m",   // Red
  debug: "\x1b[90m",   // Gray
  success: "\x1b[32m"  // Green
};

function getTimestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (...args) => {
    console.log(`${colors.info}[${getTimestamp()}] [INFO]${colors.reset}`, ...args);
  },
  warn: (...args) => {
    console.warn(`${colors.warn}[${getTimestamp()}] [WARN]${colors.reset}`, ...args);
  },
  error: (...args) => {
    console.error(`${colors.error}[${getTimestamp()}] [ERROR]${colors.reset}`, ...args);
  },
  debug: (...args) => {
    if (config.debug) {
      console.log(`${colors.debug}[${getTimestamp()}] [DEBUG]${colors.reset}`, ...args);
    }
  },
  success: (...args) => {
    console.log(`${colors.success}[${getTimestamp()}] [SUCCESS]${colors.reset}`, ...args);
  }
};

// For backward compatibility if needed, but we should migrate to the object
export function log(...args) {
  logger.info(...args);
}
