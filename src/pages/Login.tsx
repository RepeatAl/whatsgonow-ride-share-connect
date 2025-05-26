
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { ConnectionError } from "@/components/ui/connection-error";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowConnectionError(false);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOffline) {
      setShowConnectionError(true);
      return;
    }

    // Placeholder for actual login logic
    console.log("Login form submitted (placeholder)");
  };

  const handleRetry = () => {
    setShowConnectionError(false);
  };

  if (showConnectionError || isOffline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <ConnectionError 
              message="Keine Internetverbindung. Das Login benötigt eine aktive Internetverbindung."
              onRetry={handleRetry}
            />
            <div className="mt-4 text-center">
              <Link to={getLocalizedUrl("/")}>
                <Button variant="outline">
                  {t("common:back_home", "Zurück zur Startseite")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {t("auth:login", "Anmelden")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              Login-Funktionalität wird aktuell implementiert. Diese Seite dient zur UI-Demonstration.
            </p>
          </div>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">E-Mail</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md" 
                placeholder="ihre@email.com"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Passwort</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md" 
                placeholder="••••••••"
                disabled
              />
            </div>
            <Button type="submit" className="w-full" disabled>
              {t("auth:login", "Anmelden")}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link to={getLocalizedUrl("/register")}>
              <Button variant="link">
                {t("auth:no_account", "Noch kein Konto? Registrieren")}
              </Button>
            </Link>
            <div>
              <Link to={getLocalizedUrl("/")}>
                <Button variant="outline">
                  {t("common:back_home", "Zurück zur Startseite")}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
