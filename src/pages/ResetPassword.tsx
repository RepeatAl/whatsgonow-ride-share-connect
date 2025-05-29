
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Layout from "@/components/Layout";

const ResetPassword = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Check for recovery session on component mount
  useEffect(() => {
    const checkRecoverySession = async () => {
      try {
        console.log("🔍 Checking for recovery session...");
        
        // Check if we have a recovery session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Error checking session:", error);
          setErrors({ general: "Fehler beim Laden der Sitzung." });
          setIsValidToken(false);
          return;
        }

        // Check if this is a recovery session (password reset)
        if (session && session.user) {
          console.log("✅ Valid recovery session found");
          setIsValidToken(true);
        } else {
          console.log("❌ No valid recovery session");
          setErrors({ 
            general: "Ungültiger oder abgelaufener Reset-Link. Bitte fordere einen neuen an." 
          });
          setIsValidToken(false);
        }
      } catch (error) {
        console.error("❌ Unexpected error:", error);
        setErrors({ general: "Unerwarteter Fehler beim Validieren des Reset-Links." });
        setIsValidToken(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    checkRecoverySession();
  }, []);

  const validatePasswords = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Passwort ist erforderlich";
    } else if (password.length < 6) {
      newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Passwort-Bestätigung ist erforderlich";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("🔐 Updating password...");
      
      // Update the user's password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("❌ Password update error:", error);
        
        // Handle specific error messages
        if (error.message.includes("session_not_found")) {
          setErrors({ 
            general: "Ihre Sitzung ist abgelaufen. Bitte fordern Sie einen neuen Reset-Link an." 
          });
        } else if (error.message.includes("same_password")) {
          setErrors({ 
            general: "Das neue Passwort muss sich vom aktuellen unterscheiden." 
          });
        } else {
          setErrors({ 
            general: error.message || "Fehler beim Setzen des neuen Passworts." 
          });
        }
        return;
      }

      console.log("✅ Password updated successfully");
      
      // Show success state
      setResetSuccess(true);
      
      toast({
        title: "Passwort erfolgreich geändert",
        description: "Ihr neues Passwort wurde gesetzt. Sie können sich jetzt anmelden.",
      });

      // Sign out the user to ensure they need to login with new password
      await supabase.auth.signOut();
      
    } catch (error: any) {
      console.error("❌ Unexpected error updating password:", error);
      setErrors({ 
        general: "Unerwarteter Fehler beim Setzen des Passworts. Bitte versuchen Sie es erneut." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <Layout pageType="auth">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset-Link wird geprüft...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-10 h-10 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin mx-auto my-4"></div>
              <p className="text-gray-600">Bitte warten Sie einen Moment.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <Layout pageType="auth">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-red-600">Ungültiger Reset-Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                {errors.general || "Der Reset-Link ist ungültig oder abgelaufen."}
              </p>
              <div className="space-y-2">
                <Link to={getLocalizedUrl("/forgot-password")}>
                  <Button className="w-full">
                    Neuen Reset-Link anfordern
                  </Button>
                </Link>
                <Link to={getLocalizedUrl("/login")}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zur Anmeldung
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <Layout pageType="auth">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Passwort erfolgreich geändert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                Ihr neues Passwort wurde erfolgreich gesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
              </p>
              <Link to={getLocalizedUrl("/login")}>
                <Button className="w-full">
                  Jetzt anmelden
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Main reset password form
  return (
    <Layout pageType="auth">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Neues Passwort setzen
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              Geben Sie Ihr neues Passwort ein
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Neues Passwort
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className={errors.password ? "border-red-500" : ""}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Passwort wird gesetzt...
                  </>
                ) : (
                  "Passwort speichern"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link to={getLocalizedUrl("/login")}>
                <Button variant="link">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück zur Anmeldung
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
