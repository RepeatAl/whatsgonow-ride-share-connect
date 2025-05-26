
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { ConnectionError } from "@/components/ui/connection-error";
import { AlertCircle, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";

const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();
  const { signIn, loading } = useSimpleAuth();
  
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
      setError(t("auth:validation.email_password_required", "E-Mail und Passwort sind erforderlich"));
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      console.log("🔐 Starting login process...");
      await signIn(email, password);
      console.log("✅ Login successful, redirect should happen automatically");
      // Redirect wird vom useSimpleAuthRedirect Hook gehandhabt
    } catch (err: any) {
      console.error("❌ Login error:", err);
      if (err.message?.includes('fetch')) {
        setShowConnectionError(true);
      } else {
        setError(err.message || t("auth:error.login_failed", "Anmeldung fehlgeschlagen"));
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleRetry = () => {
    setShowConnectionError(false);
    setError("");
  };

  if (showConnectionError || isOffline) {
    return (
      <Layout pageType="auth">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <ConnectionError 
                message={t("auth:error.no_connection", "Keine Internetverbindung. Das Login benötigt eine aktive Internetverbindung.")}
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
      </Layout>
    );
  }

  return (
    <Layout pageType="auth">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("auth:login", "Anmelden")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
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
                  disabled={loading || formLoading}
                  required
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
                  disabled={loading || formLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || formLoading}>
                {loading || formLoading ? (
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
                <Button variant="link" disabled={loading || formLoading}>
                  {t("auth:no_account", "Noch kein Konto? Registrieren")}
                </Button>
              </Link>
              <div>
                <Link to={getLocalizedUrl("/")}>
                  <Button variant="outline" disabled={loading || formLoading}>
                    {t("common:back_home", "Zurück zur Startseite")}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
