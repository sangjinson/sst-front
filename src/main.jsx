import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';
import './App.css';
import { SidebarProvider } from '@context/SidebarContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // 🚀 가장 먼저 QueryClientProvider가 있어야 합니다.
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </SidebarProvider>
  </QueryClientProvider>
);