
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OptimizedAuthProvider } from "@/contexts/OptimizedAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageMCPProvider } from "@/mcp/language/LanguageMCP";
import { LanguageRouter } from "@/components/routing/LanguageRouter";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageMCPProvider>
            <OptimizedAuthProvider>
              <LanguageRouter>
                <div /> {/* This is now handled by AppRoutes in LanguageRouter */}
              </LanguageRouter>
              <Toaster />
            </OptimizedAuthProvider>
          </LanguageMCPProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
