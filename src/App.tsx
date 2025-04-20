
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRealtimeProvider } from "@/contexts/ChatRealtimeContext"; 
import { AppRoutes as Routes } from "@/components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { initSupabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { isPublicRoute } from "@/routes/publicRoutes";

function App() {
  const [supabaseInitialized, setSupabaseInitialized] = useState<boolean | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Security check - redirect to login from root path if not authenticated
  useEffect(() => {
    if (location.pathname === "/") {
      const isLoggedIn = !!localStorage.getItem("supabase.auth.token");
      // Root path is considered public but we still want to check login status
      if (!isLoggedIn) {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

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

// Inner component that can access the auth context
function AppContent() {
  const { isInitialLoad, user, sessionExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if session expired
  useEffect(() => {
    if (!isInitialLoad && sessionExpired && !isPublicRoute(location.pathname)) {
      navigate("/login", { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [sessionExpired, navigate, location.pathname, isInitialLoad]);

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
