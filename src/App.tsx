
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/routing/AppRoutes';
import { StabilizedLanguageRouter } from './components/routing/StabilizedLanguageRouter';
import { OptimizedLanguageProvider } from './contexts/language/OptimizedLanguageProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserSessionProvider } from './contexts/UserSessionContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';

import './App.css';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col w-full">
          <ThemeProvider>
            <UserSessionProvider>
              <AuthProvider>
                <OptimizedLanguageProvider>
                  <TooltipProvider>
                    <StabilizedLanguageRouter>
                      <AppRoutes />
                    </StabilizedLanguageRouter>
                    <Toaster />
                  </TooltipProvider>
                </OptimizedLanguageProvider>
              </AuthProvider>
            </UserSessionProvider>
          </ThemeProvider>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
