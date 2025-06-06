import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { LanguageMCPProvider, useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Toaster } from '@/components/ui/toaster';
import MCPRouter from '@/components/routing/MCPRouter';
import { OptimizedAuthProvider } from '@/contexts/OptimizedAuthContext';

function App() {
  const { currentLanguage } = useLanguageMCP();

  console.log('🚀 App starting with optimized auth and language:', currentLanguage);

  return (
    <Router>
      <QueryClient>
        <LanguageMCPProvider>
          <OptimizedAuthProvider>
            <Toaster />
            <MCPRouter />
          </OptimizedAuthProvider>
        </LanguageMCPProvider>
      </QueryClient>
    </Router>
  );
}

export default App;
