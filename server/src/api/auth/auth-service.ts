// import * as argon2 from "argon2";

import { db } from "../../db/db";
import logger from "../../utils/logger";
import { users } from "../../db/schemas/users";

import bcrypt from "bcrypt";

export const registerUser = async (data: any) => {
  logger.info("Service: Registering new user...");
  try {
    if (!data.password) {
      throw new Error("Password is required");
    }

    logger.info("Hashing password...");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    logger.info("Inserting user into database...");
    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        passwordHash: hashedPassword,
      })
      .returning();

    logger.info("User successfully registered:", {
      id: newUser.userId,
      email: newUser.email,
    });
    return newUser;
  } catch (error) {
    logger.error("Error during user registration:", error);
    throw error;
  }
};
