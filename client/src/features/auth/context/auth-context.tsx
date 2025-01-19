// auth/context/auth-context.tsx
import React, { createContext, useContext, useState } from "react";
import { notifications } from "@mantine/notifications";

type UserType = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: UserType | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserType | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      notifications.show({ title: "Login Successful", message: "Welcome back!", color: "green" });
    } catch (error) {
      notifications.show({
        title: "Login Failed",
        message: error instanceof Error ? error.message : "Invalid credentials",
        color: "red",
      });
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    notifications.show({ title: "Logged Out", message: "See you next time!", color: "blue" });
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        setAccessToken,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};