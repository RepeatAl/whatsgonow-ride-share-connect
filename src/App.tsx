
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageMCPProvider, useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Toaster } from '@/components/ui/toaster';
import MCPRouter from '@/components/routing/MCPRouter';
import { OptimizedAuthProvider } from '@/contexts/OptimizedAuthContext';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App starting with optimized auth and language');

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <LanguageMCPProvider>
          <OptimizedAuthProvider>
            <Toaster />
            <MCPRouter />
          </OptimizedAuthProvider>
        </LanguageMCPProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
