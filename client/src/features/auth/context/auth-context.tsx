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
  loading: boolean; // Add a loading state
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
  const [loading, setLoading] = useState(true); // New state for initialization

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

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    notifications.show({ title: "Logged Out", message: "See you next time!", color: "blue" });
  };

  // Initialize authentication state
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken) {
      setAccessTokenState(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshTokenState(storedRefreshToken);
    }

    // Simulate fetching user profile if needed
    if (storedAccessToken) {
      setUser({
        id: "1", // Replace with API call to fetch user data if needed
        email: "user@example.com",
        role: "user",
      });
    }

    setLoading(false); // Mark initialization as complete
  }, []);

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        loading,
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
