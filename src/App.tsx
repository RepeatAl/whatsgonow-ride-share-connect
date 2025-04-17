
import { useAuth } from "@/contexts/AuthContext";
import { ChatRealtimeProvider } from "@/contexts/ChatRealtimeContext"; 
import { AppRoutes as Routes } from "@/components/routing/AppRoutes";

function App() {
  return <AppContent />;
}

// Inner component that can access the auth context
function AppContent() {
  const { isInitialLoad } = useAuth();

  if (isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="mb-2">⏳ Lädt Sitzung...</span>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => window.location.reload()}
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <ChatRealtimeProvider>
      <Routes /> {/* oder dein Router-Baum */}
    </ChatRealtimeProvider>
  );
}

export default App;
