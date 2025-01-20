// features/auth/hooks/api-queries.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/auth-api";
import { useAuth } from "../context/auth-context";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";


export const useLogin = () => {
    const { setAccessToken, setRefreshToken, setUser } = useAuth();
  
    return useMutation({
      mutationFn: async ({ email, password }: { email: string; password: string }) => {
        return loginUser(email, password);
      },
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
  
        notifications.show({
          title: "Login Successful",
          message: `Welcome back, ${data.user.firstName}!`,
          color: "green",
        });
      },
      onError: (error: AxiosError<{ message: string }>) => {
        notifications.show({
          title: "Login Failed",
          message:
            error.response?.data?.message || "Invalid credentials. Please try again.",
          color: "red",
        });
      },
    });
  };
  export const useLogout = () => {
    const { setAccessToken, setRefreshToken, setUser } = useAuth();
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async () => {
        return Promise.resolve();
      },
      onSuccess: () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
  
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
  
        // Clear query cache
        queryClient.clear();
  
        notifications.show({
          title: "Logged Out",
          message: "See you next time!",
          color: "blue",
        });
      },
      onError: () => {
        notifications.show({
          title: "Logout Failed",
          message: "Something went wrong. Please try again.",
          color: "red",
        });
      },
    });
  };
  
  