import { z } from "zod";

export const UserSchema = z.object({
  userId: z.string().uuid(),
  username: z.string().min(3).max(100),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must not exceed 100 characters" }),
  passwordHash: z.string(),
  role: z.enum(["admin", "user"]),
  firstName: z
    .string()
    .min(2, { message: "First name is required" })
    .max(50, { message: "First name must not exceed 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name is required" })
    .max(50, { message: "Last name must not exceed 50 characters" }),
  phone: z
    .string()
    .min(8, { message: "Phone number is required, min 8" })
    .max(15, { message: "Phone number must not exceed 15 characters" }),
  address: z
    .string()
    .min(2, { message: "Address is required,, min 2" })
    .max(100, { message: "Address must not exceed 100 characters" }),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(50, { message: "City must not exceed 50 characters" }),
  postalCode: z
    .string()
    .min(5, { message: "Postal code is required, min 5" })
    .max(6, { message: "Postal code must not exceed 6 characters" }),
  country: z
    .string()
    .min(1, { message: "Country is required" })
    .max(50, { message: "Country must not exceed 50 characters" })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const RegisterSchema = UserSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
  role: true,
  passwordHash: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AuthUserScema = z.object({
  id: z.string().uuid(),
  firstName: z
    .string()
    .min(2, { message: "First name is required" })
    .max(50, { message: "First name must not exceed 50 characters" }),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});


export const JwtPayloadSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "user"]),
  iat: z.number(),
  exp: z.number(), 
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
export type RegisterSchema = z.infer<typeof RegisterSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;