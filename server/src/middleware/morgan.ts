// src/middleware/morganMiddleware.ts
import morgan, { StreamOptions } from "morgan";
import { Request, Response } from "express";
import logger from "../utils/logger";

const stream: StreamOptions = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};


morgan.token("req-body", (req: Request, _res: Response) => {
  return JSON.stringify(req.body);
});

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms :req-body",
  { stream, skip }
);

export default morganMiddleware;
