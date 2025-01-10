// testServices.js

import { testItems as testItemsDb } from "../../db/schemas/test-schema";
import { DbClient } from "../../../types/db";
import { v4 as uuidv4 } from "uuid";

export const getAllTestItems = async (db: DbClient) => {
  try {
    const result = await db.select().from(testItemsDb);
    return result;
  } catch (error) {
    throw error;
  }
};

export const createTestItem = async (
  db: DbClient,
  content: string,
  important: boolean
) => {
  try {
    const id = uuidv4();
    const [newItem] = await db
      .insert(testItemsDb)
      .values({ id, content, important })
      .returning();

    return newItem;
  } catch (error) {
    throw error;
  }
};
