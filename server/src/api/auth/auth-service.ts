import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {config} from "../../config/config"
import { db } from "../../db/db";
import { eq } from "drizzle-orm";
import { users } from "../../db/schemas/users";
import { RegisterSchema, LoginSchema } from "../../schemas/user-and-auth-schemas";
import logger from "../../utils/logger";

export const registerUser = async (data: RegisterSchema) => {
  logger.info("Service: Registering new user...");

  try {
    if (!data.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);
    logger.info(`Password hashed: ${hashedPassword.substring(0, 10)}...`);

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

const JWT_SECRET = config.JWT_SECRET!;
const REFRESH_SECRET = config.REFRESH_SECRET!;

export const login = async (data: LoginSchema) => {
  const { email, password } = data;

  const [user] = await db.select().from(users).where(eq(users.email, email));


  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    { id: user.userId, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ id: user.userId }, REFRESH_SECRET, {
    expiresIn: "28d",
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.userId, email: user.email, role: user.role },
  };
};
