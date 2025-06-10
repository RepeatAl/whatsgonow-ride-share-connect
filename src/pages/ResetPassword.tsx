
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { getLocalizedUrl } = useLanguageMCP();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Passwort muss mindestens 6 Zeichen lang sein";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("❌ Password reset error:", error);
        setError(error.message || "Fehler beim Zurücksetzen des Passworts");
        return;
      }

      console.log("✅ Password reset successful");
      
      // FIXED: Sign out user after password reset and redirect to login
      await supabase.auth.signOut();
      
      toast({
        title: "Passwort erfolgreich geändert",
        description: "Sie können sich jetzt mit Ihrem neuen Passwort anmelden.",
      });

      // Redirect to login page with success message
      navigate(getLocalizedUrl("/login?pwReset=1"), { replace: true });

    } catch (error: any) {
      console.error("❌ Unexpected error:", error);
      setError("Unerwarteter Fehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageType="public">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("auth:reset_password", "Neues Passwort setzen")}
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              Geben Sie Ihr neues Passwort ein.
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
                  Neues Passwort
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Mindestens 6 Zeichen"
                  disabled={loading}
                  required
                  className={error ? "border-red-500" : ""}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Passwort bestätigen
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Passwort wiederholen"
                  disabled={loading}
                  required
                  className={error ? "border-red-500" : ""}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !password || !confirmPassword}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Passwort ändern
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
