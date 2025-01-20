//features/auth/auth-api.ts
import axiosInstance from "../../../services/api-client";

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data; // { accessToken, refreshToken, user }
};

export const logoutUser = async () => {
  return Promise.resolve();
};

export const fetchUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    // console.log("/auth/me response:", response.data);
    return response.data; // { id, firstName, email, role }
  } catch (error) {
    console.error("/auth/me failed:", error);
    throw error;
  }
};
