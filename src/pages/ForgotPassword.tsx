import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const ForgotPassword = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Bitte geben Sie eine E-Mail-Adresse ein");
      return;
    }

    if (!validateEmail(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    setLoading(true);
    
    try {
      console.log("📧 Sending password reset email to:", email);
      
      // Important: Set the correct redirect URL for password reset
      const resetUrl = `${window.location.origin}${getLocalizedUrl("/reset-password")}`;
      console.log("🔗 Reset URL:", resetUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });

      if (error) {
        console.error("❌ Password reset error:", error);
        
        // Handle specific error cases
        if (error.message.includes("rate_limit")) {
          setError("Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.");
        } else if (error.message.includes("invalid_email")) {
          setError("Die eingegebene E-Mail-Adresse ist ungültig.");
        } else if (error.message.includes("user_not_found")) {
          // For security reasons, we don't reveal if user exists or not
          // So we still show success message
          setResetSent(true);
        } else {
          setError(error.message || "Es gab ein Problem beim Senden der E-Mail.");
        }
        return;
      }

      console.log("✅ Password reset email sent successfully");
      setResetSent(true);
      
      toast({
        title: "E-Mail gesendet",
        description: "Überprüfen Sie Ihr Postfach für den Passwort-Reset Link.",
      });
      
    } catch (error: any) {
      console.error("❌ Unexpected error:", error);
      setError("Unerwarteter Fehler beim Senden der E-Mail. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
    return (
      <Layout pageType="public">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">E-Mail gesendet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-600">
                Wir haben einen Passwort-Reset Link an <strong>{email}</strong> gesendet.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 text-sm">
                  <strong>Wichtig:</strong> Überprüfen Sie auch Ihren Spam-Ordner, falls die E-Mail nicht in den nächsten Minuten ankommt.
                </p>
              </div>
              <div className="space-y-2">
                <Link to={getLocalizedUrl("/login")}>
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zur Anmeldung
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setResetSent(false);
                    setEmail("");
                    setError("");
                  }}
                  className="w-full"
                >
                  Andere E-Mail verwenden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="public">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("auth:forgot_password", "Passwort vergessen")}
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth:email", "E-Mail")}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(""); // Clear error when user types
                  }}
                  placeholder={t("auth:email_placeholder", "ihre@email.com")}
                  disabled={loading}
                  required
                  autoComplete="email"
                  className={error ? "border-red-500" : ""}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  "Reset-Link senden"
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
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

export default ForgotPassword;
