import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache kept in memory for 10 minutes after last use
      retry: 2, // Retry failed requests 2 times before giving up
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: true, // Refetch data when component mounts
      refetchOnReconnect: 'always', // Always refetch when network reconnects
      networkMode: 'online', // Only make requests when online
    },
    mutations: {
      retry: 1, // Retry failed mutations 1 time before giving up
      networkMode: 'online', // Only make mutation requests when online
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { queryClient };
