// src/utils/logger.ts
// new
import { createLogger, format, transports } from "winston";

/* Winston Log Levels
**********************
logger.error("This is an error message");
logger.warn("This is a warning");
logger.info("Server is listening on port 3000");
logger.http("Received GET request on /api/v1/customers");
logger.verbose("Detailed log about a specific operation");
logger.debug("Debugging details here");
logger.silly("Potentially noisy, low-priority log");
*/

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  if (stack) {
    return `${timestamp} [${level}]: ${stack}`;
  }
  return `${timestamp} [${level}]: ${message} | meta: ${JSON.stringify(meta)}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    colorize(),
    logFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
