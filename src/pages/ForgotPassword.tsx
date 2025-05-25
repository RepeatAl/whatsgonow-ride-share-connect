
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { getLocalizedUrl } = useLanguageMCP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${getLocalizedUrl("/reset-password")}`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "E-Mail gesendet",
        description: "Bitte überprüfe dein E-Mail-Postfach für weitere Anweisungen.",
      });

      // Clear form
      setEmail("");
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Es gab ein Problem beim Zurücksetzen des Passworts.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">E-Mail gesendet!</CardTitle>
              <CardDescription className="text-center">
                Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines Passworts gesendet.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Falls du die E-Mail nicht siehst, überprüfe bitte deinen Spam-Ordner.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" asChild>
                <Link to={getLocalizedUrl("/login")}>Zurück zum Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Passwort zurücksetzen</CardTitle>
            <CardDescription>
              Gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="deine@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="brand"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Wird verarbeitet...
                  </>
                ) : "Passwort zurücksetzen"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link to={getLocalizedUrl("/login")}>Zurück zum Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
