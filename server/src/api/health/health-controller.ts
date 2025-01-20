// health-controller.js
import { Request, Response, NextFunction } from "express";

export const getHealthHTML = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send(`
      <html>
        <head><title>Health Check</title></head>
        <body>
          <h1>Health Check: OK</h1>
          <p>The system is up and running.</p>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};

export const getHealthJSON = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ status: "OK" });
  } catch (error) {
    next(error);
  }
};