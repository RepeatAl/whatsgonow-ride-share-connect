import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isPublicRoute } from "@/routes/publicRoutes";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('signup') === 'true') {
      setIsSignup(true);
    }
  }, [location]);

  useEffect(() => {
    if (user && !redirecting) {
      const from = location.state?.from?.pathname || '/dashboard';
      setRedirecting(true);
      navigate(from);
    }
  }, [user, navigate, redirecting, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Layout>
      <TooltipProvider>
        <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
          {isSignup ? (
            <RegisterForm />
          ) : (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Logge dich in dein Whatsgonow-Konto ein
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
                  
                  <div className="flex justify-end">
                    <Button variant="link" asChild className="px-0">
                      <Link to="/forgot-password">Passwort vergessen?</Link>
                    </Button>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading} variant="brand">
                    {isLoading ? "Wird verarbeitet..." : "Einloggen"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" onClick={() => setIsSignup(!isSignup)} className="text-sm">
                  {isSignup ? "Schon registriert? Login" : "Noch kein Konto? Jetzt registrieren"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default Login;
