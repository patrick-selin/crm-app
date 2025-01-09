// testController.js
import { Request, Response } from "express";
import { getAllTestItems, createTestItem } from "../../api/test-route/test-service";
import { db } from "../../db/db";

export const getTestItems = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const testItems = await getAllTestItems(db);
    if (testItems.length === 0) {
      return res.status(404).json({ message: "No test items found" });
    }
    return res.status(200).json(testItems);
  } catch (error) {
    console.error("Error in getTestItems controller:", error);
    return res.status(500).json({ error: "Error fetching data" });
  }
};

export const addTestItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(process.env.NODE_ENV);
    const { content, important } = req.body;
    console.log(`REQ BODY :: ${JSON.stringify(req.body)}`);
    const newItem = await createTestItem(db, content, important);

    res.status(201).json(newItem);
  } catch (_error) {
    res.status(500).json({ error: "Failed to create a test item" });
  }
};
