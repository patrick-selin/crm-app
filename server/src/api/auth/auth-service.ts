import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";
import { users } from "../../db/schemas/users";
import {
  RegisterSchema,
  LoginSchema,
} from "../../schemas/user-and-auth-schemas";
import logger from "../../utils/logger";
import { ValidationError } from "../../utils/errors/app-errors";

const JWT_SECRET = config.JWT_SECRET!;
const REFRESH_SECRET = config.REFRESH_SECRET!;

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
    if (
      error instanceof Error &&
      error.message.includes("duplicate key value")
    ) {
      throw new ValidationError(
        "An account with this email address or username already exists",
        "Duplicate email or username"
      );
    }
    throw error;
  }
};

export const login = async (data: LoginSchema) => {
  const { email, password } = data;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new ValidationError(
        "Invalid Credentials",
        "The email or password is incorrect"
      );
    }

    const accessToken = jwt.sign(
      { id: user.userId, role: user.role },
      JWT_SECRET,
      { expiresIn: "15d" } // muuta
    );
    const refreshToken = jwt.sign({ id: user.userId }, REFRESH_SECRET, {
      expiresIn: "14d",
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.userId,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getAuthDetails = async (userId: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    if (!user) {
      throw new ValidationError(
        "User Not Found",
        "No user exists with the given ID"
      );
    }

    return {
      id: user.userId,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, payload.id));

    if (!user) {
      throw new ValidationError(
        "User Not Found",
        "No user exists with the given ID"
      );
    }

    const newAccessToken = jwt.sign(
      { id: user.userId, firstName: user.firstName, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ValidationError(
        "Invalid Refresh Token",
        "JWT verification failed"
      );
    }
    throw error;
  }
};
