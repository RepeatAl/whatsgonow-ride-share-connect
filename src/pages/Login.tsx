
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, profile, loading: authLoading } = useAuth();

  // Redirect on successful login based on role
  useEffect(() => {
    if (user && profile && !authLoading) {
      if (profile.role === 'admin' || profile.role === 'admin_limited') {
        navigate("/admin", { replace: true });
      } else {
        const destination = (location.state as any)?.from || "/";
        navigate(destination, { replace: true });
      }
    }
  }, [user, profile, authLoading, location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation is handled by the useEffect above
    } catch (err) {
      console.error("Login error:", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setError(""); // Clear any existing errors when toggling
  };

  if (authLoading) {
    return <Layout>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
                  
                  <Button type="submit" className="w-full" disabled={isLoading} variant="brand">
                    {isLoading ? "Wird verarbeitet..." : "Einloggen"}
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
