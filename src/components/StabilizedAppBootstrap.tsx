
import React, { ReactNode } from "react";
import { Loader2, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StableLoading } from "@/components/ui/stable-loading";
import { useStableAppState } from "@/hooks/useStableAppState";

interface StabilizedAppBootstrapProps {
  children: ReactNode;
  requiredNamespaces?: string[];
  requireAuth?: boolean;
}

export const StabilizedAppBootstrap = ({ 
  children, 
  requiredNamespaces = ['common'],
  requireAuth = false 
}: StabilizedAppBootstrapProps) => {
  const navigate = useNavigate();
  const appState = useStableAppState({ 
    requiredNamespaces, 
    requireAuth,
    minimumLoadTime: 200 // Shorter minimum load time
  });
  
  // Show loading state with stable dimensions
  if (!appState.isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-md p-6 space-y-4 bg-background">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Anwendung wird geladen...</p>
            
            {/* Progress indicators */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Authentifizierung</span>
                <span className={appState.authReady ? "text-green-600" : "text-muted-foreground"}>
                  {appState.authReady ? "✓" : "..."}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sprache</span>
                <span className={appState.languageReady ? "text-green-600" : "text-muted-foreground"}>
                  {appState.languageReady ? "✓" : "..."}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Übersetzungen</span>
                <span className={appState.translationsReady ? "text-green-600" : "text-muted-foreground"}>
                  {appState.translationsReady ? "✓" : "..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};
