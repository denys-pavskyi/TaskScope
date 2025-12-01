import { useEffect } from 'react';
import { AppRouter } from './routes/AppRouter';
import { setErrorCallback } from './services/apiClient';
import { useErrorHandler } from './hooks/useErrorHandler';

export const App = () => {
  const { showError } = useErrorHandler();

  useEffect(() => {
    setErrorCallback(showError);
  }, [showError]);

  return <AppRouter />;
};
