
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { ConnectionError } from "@/components/ui/connection-error";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";

const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();
  const { signIn, loading: authLoading } = useSimpleAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Monitor online/offline status
  useEffect(() => {
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

  // Clear errors when user types
  useEffect(() => {
    if (error && (email || password)) {
      setError("");
    }
  }, [email, password, error]);

  const validateForm = () => {
    if (!email) {
      setError("E-Mail-Adresse ist erforderlich");
      return false;
    }
    if (!password) {
      setError("Passwort ist erforderlich");
      return false;
    }
    if (!email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return false;
    }
    return true;
  };

  const cleanupAuthState = async () => {
    try {
      // Clear any existing sessions
      await supabase.auth.signOut();
      
      // Clear localStorage auth data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.log("Cleanup completed (some errors ignored)");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOffline) {
      setShowConnectionError(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Rate limiting for repeated failed attempts
    if (loginAttempts >= 5) {
      setError("Zu viele fehlgeschlagene Anmeldeversuche. Bitte warten Sie 5 Minuten.");
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      
      console.log("🔐 Starting login process for:", email);
      
      // Clean up any existing auth state before login
      await cleanupAuthState();
      
      await signIn(email, password);
      
      console.log("✅ Login successful");
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
      
    } catch (err: any) {
      console.error("❌ Login error:", err);
      
      // Increment login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = "Anmeldung fehlgeschlagen";
      
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = "E-Mail oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.";
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = "Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link in Ihrer E-Mail.";
      } else if (err.message?.includes('Too many requests')) {
        errorMessage = "Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.";
      } else if (err.message?.includes('User not found')) {
        errorMessage = "Kein Konto mit dieser E-Mail-Adresse gefunden.";
      } else if (err.message?.includes('fetch')) {
        setShowConnectionError(true);
        return;
      } else if (err.message?.includes('network')) {
        setShowConnectionError(true);
        return;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
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

  const handleForgotPassword = () => {
    // Pre-fill email in forgot password if available
    const forgotPasswordUrl = getLocalizedUrl("/forgot-password");
    navigate(forgotPasswordUrl, { state: { email } });
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 text-sm">{error}</p>
                    {loginAttempts >= 3 && (
                      <p className="text-red-600 text-xs mt-1">
                        Nach {5 - loginAttempts} weiteren Fehlversuchen müssen Sie 5 Minuten warten.
                      </p>
                    )}
                  </div>
                </div>
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
                  disabled={authLoading || formLoading}
                  required
                  autoComplete="email"
                  className={error ? "border-red-500" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth:password", "Passwort")}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={authLoading || formLoading}
                    required
                    autoComplete="current-password"
                    className={error ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={authLoading || formLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <div className="mt-2 text-right">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 hover:underline p-0 h-auto"
                    onClick={handleForgotPassword}
                    disabled={authLoading || formLoading}
                  >
                    {t("auth:forgot_password", "Passwort vergessen?")}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={authLoading || formLoading || loginAttempts >= 5}
              >
                {authLoading || formLoading ? (
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
                <Button variant="link" disabled={authLoading || formLoading}>
                  {t("auth:no_account", "Noch kein Konto? Registrieren")}
                </Button>
              </Link>
              <div>
                <Button 
                  variant="outline" 
                  disabled={authLoading || formLoading} 
                  onClick={handleBackToHome}
                >
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
