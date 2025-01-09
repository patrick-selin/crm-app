// testController.js
import { Request, Response } from "express";

export const getHealthHTML = async (_req: Request, res: Response) => {
  res.send(`
        <html>
          <head><title>Health Check</title></head>
          <body>
            <h1>Health Check: OK</h1>
            <p>The system is up and running.</p>
          </body>
        </html>
      `);
};

export const getHealthJSON = async (_req: Request, res: Response) => {
  res.json({ status: "OK" });
};
