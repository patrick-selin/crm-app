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

          const { data } = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken });

          localStorage.setItem("accessToken", data.accessToken);

          isRefreshing = false;
          notifySubscribers(data.accessToken);

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
