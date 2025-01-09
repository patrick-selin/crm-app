// index.ts
import { config } from "./config/config";
import app from "./server";
import logger from "./utils/logger";

app.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
  logger.info(
    `Server is running on port: ++${config.SERVER_PORT}, host: ${config.SERVER_HOST}++`
  );
  logger.info(`Environment mode: ++${process.env.NODE_ENV}++`);
});
