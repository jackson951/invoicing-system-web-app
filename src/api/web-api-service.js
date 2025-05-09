import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { checkTokenExpiration, logoutUser } from "./auth";

// Set your API base URL here
const BASE_URL = "https://localhost:7221/api/";

// Create an Axios instance
export const ApiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hook to apply request/response interceptors and handle token expiration
export const useApiInterceptors = () => {
  const { authToken, removeToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Auto logout when token expires using timeout
    const expiration = localStorage.getItem("tokenExpiration");
    if (expiration) {
      const timeout = parseInt(expiration, 10) - Date.now();
      if (timeout > 0) {
        const timer = setTimeout(() => {
          toast.error("Session expired. Please log in again.");
          removeToken();
          logoutUser();
        }, timeout);

        return () => clearTimeout(timer); // Clean up on unmount
      } else {
        // Token already expired
        removeToken();
        logoutUser();
        navigate("/login");
      }
    }

    // ✅ Axios Request Interceptor: Attach token if valid
    const requestInterceptor = ApiService.interceptors.request.use(
      (config) => {
        if (authToken && checkTokenExpiration()) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Axios Response Interceptor: Handle 401 Unauthorized
    const responseInterceptor = ApiService.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          removeToken();
          logoutUser();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // ✅ Cleanup interceptors on unmount or authToken change
    return () => {
      ApiService.interceptors.request.eject(requestInterceptor);
      ApiService.interceptors.response.eject(responseInterceptor);
    };
  }, [authToken, removeToken, navigate]);

  return ApiService;
};
