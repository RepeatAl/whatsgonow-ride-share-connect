
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRealtimeProvider } from "@/contexts/ChatRealtimeContext"; 
import { AppRoutes as Routes } from "@/components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { initSupabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";

function App() {
  const [supabaseInitialized, setSupabaseInitialized] = useState<boolean | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      try {
        const result = await initSupabase();
        setSupabaseInitialized(result.success);
        if (!result.success) {
          setInitError(result.message || "Verbindung zu Supabase fehlgeschlagen");
        }
      } catch (err) {
        console.error("Fehler bei der Supabase-Initialisierung:", err);
        setSupabaseInitialized(false);
        setInitError("Unerwarteter Fehler bei der Verbindung zur Datenbank");
      }
    };

    init();
  }, []);

  if (supabaseInitialized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h1 className="text-xl font-bold text-red-600">Verbindungsfehler</h1>
        <p>{initError || "Die Verbindung zur Datenbank konnte nicht hergestellt werden."}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <AppContent />
    </>
  );
}

function AppContent() {
  const { isInitialLoad, user, sessionExpired } = useAuth();

  if (isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        <span className="mb-2">Lädt Sitzung...</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <ChatRealtimeProvider>
      <Routes />
    </ChatRealtimeProvider>
  );
}

export default App;
