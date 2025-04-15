
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatRealtimeProvider } from "./contexts/ChatRealtimeContext";
import { SenderOrdersProvider } from "./contexts/SenderOrdersContext";
import { AppRoutes } from "./components/routing/AppRoutes";
import { LoadingScreen } from "./components/ui/loading-screen";
import { useAuth } from "./contexts/AuthContext";

// Main app component that handles providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Inner component that can access the auth context
function AppContent() {
  const { isInitialLoad } = useAuth();

  return (
    <ChatRealtimeProvider>
      <SenderOrdersProvider>
        <TooltipProvider>
          <div className="App">
            {isInitialLoad ? (
              <LoadingScreen message="Anwendung wird geladen..." />
            ) : (
              <AppRoutes />
            )}
            <Toaster />
          </div>
        </TooltipProvider>
      </SenderOrdersProvider>
    </ChatRealtimeProvider>
  );
}

export default App;
