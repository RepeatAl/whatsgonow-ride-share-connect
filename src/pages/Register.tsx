
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isRedirectedUser, setIsRedirectedUser] = useState(false);

  useEffect(() => {
    if (!loading) {
      // If user has a session and a complete profile, redirect to dashboard
      if (user && profile && profile.profile_complete) {
        navigate("/dashboard");
        return;
      }
      
      // If user has a session but no profile, show the form with a notice
      // This handles users redirected from ProfileCheck
      if (user && !profile) {
        setIsRedirectedUser(true);
        setShowForm(true);
        return;
      }
      
      // If user is not logged in, show the regular registration form
      if (!user) {
        setShowForm(true);
      }
    }
  }, [user, loading, profile, navigate]);

  if (loading || !showForm) {
    return <LoadingScreen message="Lade Registrierungsseite..." />;
  }

  return (
    <Layout>
      <div className="container py-12">
        {isRedirectedUser && (
          <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sie wurden hierher weitergeleitet, da für Ihren Account kein vollständiges Profil existiert. 
              Bitte vervollständigen Sie Ihre Registrierung, um fortzufahren.
            </AlertDescription>
          </Alert>
        )}
        <RegisterForm onSwitchToLogin={() => navigate("/login")} />
      </div>
    </Layout>
  );
};

export default Register;
