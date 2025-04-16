
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatRealtimeProvider } from "./contexts/ChatRealtimeContext";
import { SenderOrdersProvider } from "./contexts/SenderOrdersContext";
import { AppRoutes } from "./components/routing/AppRoutes";
import { LoadingScreen } from "./components/ui/loading-screen";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { initSupabase } from "./lib/supabaseClient";

// Main app component that handles providers
function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await initSupabase();
        if (!result.success) {
          setInitError(`Fehler bei der Initialisierung: ${result.message}`);
        }
      } catch (err) {
        setInitError(`Unerwarteter Fehler: ${(err as Error).message}`);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, []);
  
  if (isInitializing) {
    return <LoadingScreen message="Verbindung wird hergestellt..." />;
  }
  
  if (initError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="rounded-lg bg-destructive/10 p-6 max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Verbindungsproblem</h2>
          <p className="text-sm text-muted-foreground mb-4">{initError}</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => window.location.reload()}
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

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
