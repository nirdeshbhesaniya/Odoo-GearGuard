import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const startLoading = useCallback((key = 'global') => {
    if (key === 'global') {
      setGlobalLoading(true);
    } else {
      setLoadingStates((prev) => ({ ...prev, [key]: true }));
    }
  }, []);

  const stopLoading = useCallback((key = 'global') => {
    if (key === 'global') {
      setGlobalLoading(false);
    } else {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  const isLoading = useCallback(
    (key = 'global') => {
      if (key === 'global') return globalLoading;
      return loadingStates[key] || false;
    },
    [globalLoading, loadingStates]
  );

  return (
    <LoadingContext.Provider
      value={{ startLoading, stopLoading, isLoading, globalLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};
