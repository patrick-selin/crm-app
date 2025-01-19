import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Notify all subscribers with the new token
const notifySubscribers = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add a new subscriber
const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// Request Interceptor: Attach Authorization header
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor: Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retried, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token available");

          const { data } = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken });

          // Update tokens in localStorage
          localStorage.setItem("accessToken", data.accessToken);

          isRefreshing = false;
          notifySubscribers(data.accessToken);

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (err) {
          isRefreshing = false;

          // Clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/sign-in";
          throw err;
        }
      }

      // Queue requests until the token is refreshed
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
