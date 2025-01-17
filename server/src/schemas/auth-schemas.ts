import { z } from "zod";


export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const JwtPayloadSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "user"]),
  iat: z.number(),
  exp: z.number(), 
});
