
import React, { ErrorInfo, ReactNode, useState, useEffect } from "react";
import { Loader2, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserSession } from "@/contexts/UserSessionContext";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate("/");
    resetError();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-6 space-y-4 bg-background border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-destructive">Ein Fehler ist aufgetreten</h2>
        <div className="p-4 bg-destructive/10 rounded-md">
          <p className="text-sm text-destructive">
            {error?.message || "Die Anwendung konnte nicht initialisiert werden."}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support, falls der Fehler bestehen bleibt.
        </p>
        <div className="flex justify-between">
          <Button onClick={handleGoHome} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Zur Startseite
          </Button>
          <Button onClick={resetError}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Seite neu laden
          </Button>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Anwendung wird geladen...</p>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: ReactNode, fallback: React.ComponentType<ErrorFallbackProps> }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode, fallback: React.ComponentType<ErrorFallbackProps> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("Error captured in ErrorBoundary:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Application error details:", error, errorInfo);
  }

  resetError = () => {
    console.log("Resetting error state...");
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const ErrorFallbackComponent = this.props.fallback;
      return <ErrorFallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export const AppBootstrap = ({ children }: { children: ReactNode }) => {
  const { loading, isInitialLoad } = useUserSession();
  const [isAppReady, setIsAppReady] = useState(false);
  
  useEffect(() => {
    console.log("AppBootstrap: Loading state:", { loading, isInitialLoad });
    
    // Check if the app is ready to render
    if (!loading && !isInitialLoad) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsAppReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, isInitialLoad]);
  
  if (!isAppReady) {
    return <LoadingFallback />;
  }
  
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};
