import { useRef } from 'react';
import { App } from 'antd';
import type { ApiError } from '../models/ApiError';

export function useErrorHandler() {
  const { message } = App.useApp();
  const lastErrorRef = useRef<{ message: string; timestamp: number } | null>(null);

  const showError = (error: ApiError) => {
    const errorMessage = error.getUserMessage();
    const now = Date.now();
    
    // Check if this is a duplicate error within 1 second
    if (
      lastErrorRef.current &&
      lastErrorRef.current.message === errorMessage &&
      now - lastErrorRef.current.timestamp < 1000
    ) {
      return;
    }
    
    lastErrorRef.current = { message: errorMessage, timestamp: now };
    
    message.error({
      content: errorMessage,
      duration: 5,
      key: error.traceId || `error-${now}`,
    });
  };

  return { showError };
}
