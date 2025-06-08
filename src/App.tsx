
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { OptimizedAuthProvider } from "@/contexts/OptimizedAuthContext";
import { LanguageMCPProvider } from "@/mcp/language/LanguageMCP";
import MCPRouter from "@/components/routing/MCPRouter";
import "./App.css";

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
    <QueryClientProvider client={queryClient}>
      <LanguageMCPProvider>
        <OptimizedAuthProvider>
          <TooltipProvider>
            <MCPRouter />
            <Toaster />
          </TooltipProvider>
        </OptimizedAuthProvider>
      </LanguageMCPProvider>
    </QueryClientProvider>
  );
}

export default App;
