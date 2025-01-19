//features/auth/auth-api.ts
import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

// Login API
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
  console.log("Login user API response.data: " + JSON.stringify(response.data));
  return response.data; // { accessToken, refreshToken, user }
};

// Logout API
export const logoutUser = async () => {
  await axios.post(`${baseUrl}/auth/logout`);
};
