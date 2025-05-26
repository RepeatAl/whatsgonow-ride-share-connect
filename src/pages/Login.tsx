
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useStabilizedAuthContext } from "@/contexts/StabilizedAuthContext";
import { ConnectionError } from "@/components/ui/connection-error";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import AuthErrorHandler from "@/components/auth/AuthErrorHandler";

const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();
  const { signIn, isLoading } = useStabilizedAuthContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOffline) {
      setShowConnectionError(true);
      return;
    }

    if (!email || !password) {
      setError("E-Mail und Passwort sind erforderlich");
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      console.log("🔐 Starting login process for:", email);
      await signIn(email, password);
      console.log("✅ Login successful");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      if (err.message?.includes('fetch')) {
        setShowConnectionError(true);
      } else {
        setError(err.message || "Anmeldung fehlgeschlagen");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleRetry = () => {
    setShowConnectionError(false);
    setError("");
  };

  const handleBackToHome = () => {
    console.log("[Login] Navigating back to home:", `/${currentLanguage}`);
    navigate(`/${currentLanguage}`, { replace: true });
  };

  if (showConnectionError || isOffline) {
    return (
      <Layout pageType="auth" hideNavigation>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <ConnectionError 
                message="Keine Internetverbindung. Das Login benötigt eine aktive Internetverbindung."
                onRetry={handleRetry}
              />
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={handleBackToHome}>
                  Zurück zur Startseite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="auth" hideNavigation>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("auth:login", "Anmelden")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <AuthErrorHandler 
                error={error}
                email={email}
                onRetry={() => setError("")}
                onBackToHome={handleBackToHome}
              />
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth:email", "E-Mail")}
                </label>
                <Input
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth:email_placeholder", "ihre@email.com")}
                  disabled={isLoading || formLoading}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth:password", "Passwort")}
                </label>
                <Input
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading || formLoading}
                  required
                  autoComplete="current-password"
                />
                <div className="mt-2 text-right">
                  <Link 
                    to={getLocalizedUrl("/forgot-password")} 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t("auth:forgot_password", "Passwort vergessen?")}
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || formLoading}>
                {isLoading || formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth:logging_in", "Anmelden...")}
                  </>
                ) : (
                  t("auth:login", "Anmelden")
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Link to={getLocalizedUrl("/register")}>
                <Button variant="link" disabled={isLoading || formLoading}>
                  {t("auth:no_account", "Noch kein Konto? Registrieren")}
                </Button>
              </Link>
              <div>
                <Button variant="outline" disabled={isLoading || formLoading} onClick={handleBackToHome}>
                  {t("common:back_home", "Zurück zur Startseite")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
