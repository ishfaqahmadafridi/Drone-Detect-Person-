import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach telemetry trace & timing
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    (config as unknown as { metadata?: { startTime: number } }).metadata = { startTime: Date.now() };
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Latency tracking and unified error normalization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const startTime = (response.config as unknown as { metadata?: { startTime: number } }).metadata?.startTime;
    if (startTime) {
      const duration = Date.now() - startTime;
      if (process.env.NODE_ENV === "development") {
        console.debug(`[API ${response.config.method?.toUpperCase()} ${response.config.url}] completed in ${duration}ms`);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as { detail?: string })?.detail || error.message;
    console.warn(`[API ERROR ${status || "NETWORK"}] ${message}`);
    return Promise.reject(error);
  }
);
