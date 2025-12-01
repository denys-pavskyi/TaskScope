import axios from "axios";
import { API_BASE_URL } from "../consts/api";
import { handleApiError } from "../utils/errorHandler";
import type { ApiError } from "../models/ApiError";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error callback that will be set from the App component
let errorCallback: ((error: ApiError) => void) | null = null;

export function setErrorCallback(callback: (error: ApiError) => void) {
  errorCallback = callback;
}

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = handleApiError(error);
    
    // Call the error callback if it's set
    if (errorCallback) {
      errorCallback(apiError);
    }
    
    return Promise.reject(apiError);
  }
);