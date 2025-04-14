import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signIn,
    signUp,
    user
  } = useAuth();

  // Determine if we should redirect based on query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setIsSignup(true);
    }
  }, [location]);

  // Handle redirect for authenticated users
  useEffect(() => {
    if (user && !redirecting) {
      setRedirecting(true);
      navigate("/dashboard");
    }
  }, [user, navigate, redirecting]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isSignup) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      // Error is already handled in the auth context with toast
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // If we're already redirecting, show a loading message
  if (redirecting) {
    return <Layout>
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Du wirst zum Dashboard weitergeleitet...</p>
          </div>
        </div>
      </Layout>;
  }
  return <Layout>
      <TooltipProvider>
        <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{isSignup ? "Registrieren" : "Login"}</CardTitle>
              <CardDescription>
                {isSignup ? "Erstelle ein neues Konto bei Whatsgonow" : "Logge dich in dein Whatsgonow-Konto ein"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">E-Mail</label>
                  <Input id="email" type="email" placeholder="deine@email.de" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Passwort</label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                
                {error && <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>}
                
                <Button type="submit" className="w-full" disabled={isLoading} variant="brand">
                  {isLoading ? "Wird verarbeitet..." : isSignup ? "Registrieren" : "Einloggen"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" onClick={() => setIsSignup(!isSignup)} className="text-sm">
                {isSignup ? "Schon registriert? Login" : "Noch kein Konto? Jetzt registrieren"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TooltipProvider>
    </Layout>;
};
export default Login;