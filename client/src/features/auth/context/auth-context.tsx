// auth/context/auth-context.tsx
import React, { createContext, useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { notifications } from "@mantine/notifications";

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

// Types
type AuthContextType = {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      notifications.show({ title: "Login Successful", message: "Welcome back!", color: "green" });
    },
    onError: (error) => {
      notifications.show({
        title: "Login Failed",
        message: error instanceof Error ? error.message : "Invalid credentials",
        color: "red",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`${baseUrl}/auth/logout`);
    },
    onSuccess: () => {
      setAccessToken(null);
      setUser(null);
      queryClient.clear();
      notifications.show({ title: "Logged Out", message: "See you next time!", color: "blue" });
    },
    onError: () => {
      notifications.show({ title: "Logout Failed", message: "Something went wrong.", color: "red" });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout }}>
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
