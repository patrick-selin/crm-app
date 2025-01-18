// context/auth-context.tsx
import React, { createContext } from "react";

export interface AuthContextProps {
  user: unknown;
  accessToken: string | null;
  setUser: React.Dispatch<React.SetStateAction<unknown>>;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  login?: (credentials: { email: string; password: string }) => Promise<void>;
  logout?: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);