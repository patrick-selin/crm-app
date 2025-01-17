// // auth-service.ts
import bcrypt from "bcrypt";
import { db } from "../../db/db";
import logger from "../../utils/logger";
import { users } from "../../db/schemas/users";
import { RegisterSchema } from "../../schemas/user-and-auth-schemas";

export const registerUser = async (data: any) => {
  logger.info("Service: Registering new user...");

  const validatedData = RegisterSchema.parse(data);

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  try {
    const [newUser] = await db
      .insert(users)
      .values({
        ...validatedData,
        passwordHash: hashedPassword,
      })
      .returning();

    logger.info("New user created:", { id: newUser.userId, email: newUser.email });
    return newUser;
  } catch (error) {
    logger.error("Service error in registerUser:", { error });
    throw error;
  }
};
