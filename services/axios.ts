import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { loading } from "@/plugins/loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});

/**
 * 🔐 Attach Bearer token to every request
 */
axiosInstance.interceptors.request.use((config) => {
  const skipLoading =
    config.headers?.["X-No-Loading"] ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/public"));

  if (!skipLoading) {
    loading.start();
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    loading.finish();
    return response;
  },
  (error: AxiosError) => {
    loading.finish();

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const headerVal: any = (error.config as any)?.headers?.["X-No-Auth-Redirect"] ?? (error.config as any)?.headers?.["x-no-auth-redirect"];
        const noRedirect = headerVal === true || headerVal === "true" || headerVal === 1 || headerVal === "1";
        const path = window.location?.pathname || "";
        const isPublicPage = path.startsWith("/public");

        if (!noRedirect && !isPublicPage) {
          localStorage.removeItem("auth_token");
          window.location.href = "/";
        }
      }
    }

    // Log helpful debug information for 5xx/4xx responses
    try {
      console.error("Axios error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        responseData: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
      });
    } catch (e) {
      console.error("Error logging axios error", e);
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
