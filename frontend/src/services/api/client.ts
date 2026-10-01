import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach telemetry trace & timing + sanitize DOM node references
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    (config as unknown as { metadata?: { startTime: number } }).metadata = { startTime: Date.now() };

    // Defensively sanitize request data to strip any accidental React synthetic events or DOM nodes
    if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
      const sanitized: Record<string, unknown> = {};
      const raw = config.data as Record<string, unknown>;
      for (const [key, val] of Object.entries(raw)) {
        if (
          val &&
          typeof val === "object" &&
          ("target" in val || "currentTarget" in val || "nodeType" in val || "_reactFiber" in val)
        ) {
          // Stripping accidental DOM event
          continue;
        }
        sanitized[key] = val;
      }
      config.data = sanitized;
    }

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
    // Safely extract message — response.data may contain circular DOM references
    // (e.g. SVGSVGElement with React Fiber nodes) that crash JSON.stringify
    let message = "Network error";
    try {
      const data = error.response?.data as Record<string, unknown> | undefined;
      const detail = data?.detail;
      message = typeof detail === "string" ? detail : (error.message || "Network error");
    } catch {
      message = error.message || "Network error";
    }
    console.warn(`[API ERROR ${status || "NETWORK"}] ${message}`);
    return Promise.reject(error);
  }
);
