
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

const ForgotPassword = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { getLocalizedUrl } = useLanguageMCP();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine E-Mail-Adresse ein",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/de/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "E-Mail gesendet",
        description: "Überprüfe dein Postfach für den Passwort-Reset Link.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Es gab ein Problem beim Senden der E-Mail.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Layout pageType="auth">
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
              <p className="text-sm text-gray-500">
                Überprüfe auch deinen Spam-Ordner, falls die E-Mail nicht ankommt.
              </p>
              <div className="space-y-2">
                <Link to={getLocalizedUrl("/login")}>
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zur Anmeldung
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setEmailSent(false)}
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
    <Layout pageType="auth">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("auth:forgot_password", "Passwort vergessen")}
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("auth:email", "E-Mail")}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth:email_placeholder", "ihre@email.com")}
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
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
