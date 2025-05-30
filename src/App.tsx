
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SimpleAuthProvider } from '@/contexts/SimpleAuthContext';
import { LanguageMCPProvider } from '@/mcp/language/LanguageMCP';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MCPRouter from '@/components/routing/MCPRouter';
import { Loader2 } from 'lucide-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <LanguageMCPProvider>
              <SimpleAuthProvider>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-screen w-screen">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                  </div>
                }>
                  <MCPRouter />
                </Suspense>
              </SimpleAuthProvider>
            </LanguageMCPProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
