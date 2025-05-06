import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

// Set your API base URL here
const BASE_URL = "https://localhost:7221/api/";


export const ApiService = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Hook to apply request/response interceptors
export const useApiInterceptors = () => {
	const { authToken, removeToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const requestInterceptor = ApiService.interceptors.request.use(
			(config) => {
				if (authToken) {
					config.headers.Authorization = `Bearer ${authToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseInterceptor = ApiService.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					toast.error("Session expired. Please log in again.", {
						position: "top-right",
						autoClose: 3000,
					});
					removeToken();
					navigate("/login");
				}
				return Promise.reject(error);
			}
		);

		return () => {
			ApiService.interceptors.request.eject(requestInterceptor);
			ApiService.interceptors.response.eject(responseInterceptor);
		};
	}, [authToken, removeToken, navigate]);
};
