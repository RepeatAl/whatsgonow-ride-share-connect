
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

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

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button 
              variant="ghost" 
              className="w-fit mb-4" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
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
                <Input
                  id="email"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                {isLoading ? "Wird verarbeitet..." : "Passwort zurücksetzen"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link to="/login">Zurück zum Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
