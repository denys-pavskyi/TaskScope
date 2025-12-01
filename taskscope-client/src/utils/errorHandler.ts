import { message as staticMessage } from 'antd';
import type { AxiosError } from 'axios';
import { ApiError, type ApiErrorResponse } from '../models/ApiError';

export function handleApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // Check for response data (API error response)
    if (axiosError.response?.data) {
        return new ApiError(axiosError.response.data);
    }

    // Check for network errors (connection refused, timeout, etc.)
    if (axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ERR_CONNECTION_REFUSED') {
        return new ApiError({
            title: 'Connection Error',
            detail: 'Unable to connect to the server. Please check if the server is running.',
            status: 0
        });
    }

    // Check for timeout errors
    if (axiosError.code === 'ECONNABORTED') {
        return new ApiError({
            title: 'Timeout Error',
            detail: 'The request took too long. Please try again.',
            status: 0
        });
    }

    // Generic error with message
    if (axiosError.message) {
        return new ApiError({
            title: 'Network Error',
            detail: axiosError.message,
            status: axiosError.response?.status || 0
        });
    }

    // Fallback for unknown errors
    return new ApiError({
        title: 'Unknown Error',
        detail: 'An unexpected error occurred',
        status: 500
    });
}

export function showErrorToast(error: unknown): void {
    const apiError = handleApiError(error);
    const userMessage = apiError.getUserMessage();
    
    staticMessage.error({
        content: userMessage,
        duration: 5,
        key: apiError.traceId || `error-${Date.now()}`,
    });
}

export function getErrorMessage(error: unknown): string {
    const apiError = handleApiError(error);
    return apiError.getUserMessage();
}
