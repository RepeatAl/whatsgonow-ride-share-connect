
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import MCPRouter from "@/components/routing/MCPRouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  console.log("🚀 App starting...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleAuthProvider>
          <BrowserRouter>
            <MCPRouter />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </SimpleAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
