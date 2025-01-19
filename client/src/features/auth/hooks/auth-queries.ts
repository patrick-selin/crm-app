// features/auth/hooks/api-queries.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../api/auth-api";
import { useAuth } from "../context/auth-context";
import { notifications } from "@mantine/notifications";

export const useLogin = () => {
    const { setAccessToken, setUser } = useAuth();
  
    return useMutation({
      mutationFn: async ({ email, password }: { email: string; password: string }) => {
        // Call the API and return the data
        return await loginUser(email, password);
      },
      onSuccess: (data) => {
        // Ensure the response data is properly used
        console.log("Login Mutation Success:", data);
  
        // Set tokens and user in context
        setAccessToken(data.accessToken);
        setUser(data.user);
  
        // Show success notification
        notifications.show({
          title: "Login Successful",
          message: `Welcome back, ${data.user.email}!`,
          color: "green",
        });
      },
      onError: (error: any) => {
        // Log error for debugging
        console.error("Login Mutation Error:", error);
  
        // Handle error and notify the user
        notifications.show({
          title: "Login Failed",
          message:
            error?.response?.data?.message || "Invalid credentials. Please try again.",
          color: "red",
        });
      },
    });
  };
  
// Logout Hook
export const useLogout = () => {
  const { setAccessToken, setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
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
};
