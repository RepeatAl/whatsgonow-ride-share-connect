
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageMCP } from "@/mcp/language/LanguageMCP";
import MCPRouter from "@/components/routing/MCPRouter";
import { extractLanguageFromUrl } from "@/contexts/language/utils";
import { defaultLanguage } from "@/contexts/language/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Component to extract language from URL
const AppWithLanguage = () => {
  const location = useLocation();
  
  // Extract language from current URL
  const currentLanguage = extractLanguageFromUrl(location.pathname) || defaultLanguage;
  
  return (
    <LanguageMCP initialLanguage={currentLanguage}>
      <MCPRouter />
    </LanguageMCP>
  );
};

const App = () => {
  console.log("🚀 App starting...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <SimpleAuthProvider>
              <AppWithLanguage />
              <Toaster />
              <Sonner />
            </SimpleAuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
