// auth/context/auth-context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

type UserType = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: UserType | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);

  // Helpers to manage tokens in localStorage
  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    setAccessTokenState(token);
  };

  const setRefreshToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem("refreshToken");
    }
    setRefreshTokenState(token);
  };

  // On app load, restore tokens from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedAccessToken) setAccessTokenState(storedAccessToken);
    if (storedRefreshToken) setRefreshTokenState(storedRefreshToken);
  }, []);

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    notifications.show({ title: "Logged Out", message: "See you next time!", color: "blue" });
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        setAccessToken,
        setRefreshToken,
        setUser,
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
