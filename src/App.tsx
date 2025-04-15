
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatRealtimeProvider } from "./contexts/ChatRealtimeContext";
import { SenderOrdersProvider } from "./contexts/SenderOrdersContext";
import { AppRoutes } from "./components/routing/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ChatRealtimeProvider>
        <SenderOrdersProvider>
          <TooltipProvider>
            <div className="App">
              <AppRoutes />
              <Toaster />
            </div>
          </TooltipProvider>
        </SenderOrdersProvider>
      </ChatRealtimeProvider>
    </AuthProvider>
  );
}

export default App;
