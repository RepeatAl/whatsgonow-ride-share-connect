
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Passwort aktualisiert",
        description: "Dein Passwort wurde erfolgreich zurückgesetzt.",
      });

      // Redirect to login
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Es gab ein Problem beim Aktualisieren des Passworts.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we have a valid session for password reset
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Ungültiger Link",
          description: "Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.",
        });
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Neues Passwort festlegen</CardTitle>
            <CardDescription>
              Bitte gib dein neues Passwort ein.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Neues Passwort
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
                {isLoading ? "Wird verarbeitet..." : "Passwort aktualisieren"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
