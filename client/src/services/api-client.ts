// services/api-client.ts
import axios from "axios";

/**
 * Axios instance with interceptors to manage authentication tokens:
 * - Attaches the access token to Authorization headers for requests.
 * - Handles token refresh on 401 errors, ensuring only one refresh request at a time.
 * - Queues failed requests during refresh and retries them with the new token.
 * - Clears tokens and redirects to login on refresh failure.
 */

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const notifySubscribers = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token available");

          const { data } = await axios.post(`${baseUrl}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem("accessToken", data.accessToken);
          isRefreshing = false;
          notifySubscribers(data.accessToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          isRefreshing = false;

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/sign-in";
          throw err;
        }
      }

      return new Promise((resolve) => {
        addSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
