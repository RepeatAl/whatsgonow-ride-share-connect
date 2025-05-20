
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppBootstrap } from '@/components/AppBootstrap';
import { LanguageProvider } from "@/contexts/LanguageContext";

import './App.css';
import RTLDebugPanel from "@/components/RTLDebugPanel";

// Create a client
const queryClient = new QueryClient();

function App() {
  const isDev = import.meta.env.DEV;
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AppBootstrap>
              <AppRoutes />
              <Toaster />
              {isDev && <RTLDebugPanel />}
            </AppBootstrap>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
