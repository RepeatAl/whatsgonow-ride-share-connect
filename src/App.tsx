
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { MCPRouter } from '@/components/routing/MCPRouter';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Main App Component - Simplified for MCP debugging
 * Provider hierarchy: QueryClient -> Router -> Auth -> MCP -> Routes
 */
const App: React.FC = () => {
  console.log('[APP] Mounting application...');
  console.log('[APP] Current URL:', window.location.pathname);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen message="App wird geladen..." />}>
            <MCPRouter />
            <Toaster />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
