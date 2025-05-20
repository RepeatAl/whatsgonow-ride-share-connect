
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppBootstrap } from '@/components/AppBootstrap';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserSessionProvider } from "@/contexts/UserSessionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LaunchProvider from "@/components/launch/LaunchProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

import './App.css';
import RTLDebugPanel from "@/components/RTLDebugPanel";

// Create a client
const queryClient = new QueryClient();

function App() {
  const isDev = import.meta.env.DEV;
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserSessionProvider>
            <AuthProvider>
              <LaunchProvider>
                <ThemeProvider>
                  <LanguageProvider>
                    <AppBootstrap>
                      <AppRoutes />
                      <Toaster />
                      {isDev && <RTLDebugPanel />}
                    </AppBootstrap>
                  </LanguageProvider>
                </ThemeProvider>
              </LaunchProvider>
            </AuthProvider>
          </UserSessionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
