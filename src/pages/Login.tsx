
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
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
import { AlertCircle, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading: authLoading, sessionExpired } = useAuth();

  // Extract the redirect destination from state if available
  const from = location.state?.from || "/";
  
  useEffect(() => {
    console.log("🔍 Login page - Auth state:", user ? "Authenticated" : "Unauthenticated");
    
    // Only redirect if the user is authenticated AND not from an expired session
    if (user && !authLoading && !sessionExpired) {
      const destination = from === "/" ? "/dashboard" : from;
      console.log("🚀 Redirecting authenticated user to:", destination);
      toast({
        title: "Anmeldung erfolgreich",
        description: "Du wirst weitergeleitet...",
      });
      // Redirect after a slight delay to allow toast to be seen
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 1000);
    }
  }, [user, authLoading, location, navigate, from, sessionExpired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log("🔑 Attempting login for:", email);
      await signIn(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Anmeldung fehlgeschlagen. Bitte überprüfe deine E-Mail und dein Passwort.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  if (authLoading) {
    return <Layout>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Authentifizierung wird überprüft...</p>
        </div>
      </div>
    </Layout>;
  }

  return (
    <Layout minimal>
      <TooltipProvider>
        <div className="flex items-center justify-center min-h-screen p-4 bg-neutral-50">
          {isSignup ? (
            <RegisterForm onSwitchToLogin={toggleSignup} />
          ) : (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Logge dich in dein Whatsgonow-Konto ein
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionExpired && (
                  <Alert className="mb-4 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-600">
                      Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">E-Mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="deine@email.de" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Passwort</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
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
                    ) : "Einloggen"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={toggleSignup} 
                  className="text-sm"
                >
                  Noch kein Konto? Jetzt registrieren
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
